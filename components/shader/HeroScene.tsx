'use client'

import { useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './hero.vert'
import fragmentShader from './hero.frag'

function ShaderPlane({ onFrame }: { onFrame?: (gl: THREE.WebGLRenderer) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5))
  const { size } = useThree()
  const frameCount = useRef(0)

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  })

  useFrame(({ clock, gl }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouseRef.current, 0.05)
    uniforms.current.uResolution.value.set(size.width, size.height)

    // Copy to 2D mirror every 3 frames for liquidGL to capture
    frameCount.current++
    if (frameCount.current % 3 === 0 && onFrame) {
      onFrame(gl)
    }
  })

  const handlePointerMove = useCallback((e: any) => {
    if (e.uv) {
      mouseRef.current.set(e.uv.x, e.uv.y)
    }
  }, [])

  return (
    <mesh ref={meshRef} onPointerMove={handlePointerMove}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export function HeroScene() {
  const mirrorRef = useRef<HTMLCanvasElement>(null)

  const handleFrame = useCallback((gl: THREE.WebGLRenderer) => {
    const mirror = mirrorRef.current
    if (!mirror) return
    const src = gl.domElement
    // Match dimensions
    if (mirror.width !== src.width || mirror.height !== src.height) {
      mirror.width = src.width
      mirror.height = src.height
    }
    const ctx = mirror.getContext('2d')
    if (ctx) {
      ctx.drawImage(src, 0, 0)
    }
  }, [])

  return (
    <>
      {/* Real WebGL shader — fixed, marked for liquidGL to ignore */}
      <div className="fixed inset-0" style={{ zIndex: -2 }} data-liquid-ignore>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: false, preserveDrawingBuffer: true }}
          style={{ background: '#0a0a0a' }}
        >
          <ShaderPlane onFrame={handleFrame} />
        </Canvas>
      </div>

      {/* 2D mirror canvas — NOT fixed, capturable by html2canvas for liquidGL */}
      <canvas
        ref={mirrorRef}
        id="shader-mirror"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
