'use client'

import { useRef, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './hero.vert'
import fragmentShader from './hero.frag'

function ShaderPlane({ onFirstFrame }: { onFirstFrame?: (gl: THREE.WebGLRenderer) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5))
  const { size } = useThree()
  const captured = useRef(false)
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

    // Capture one frame for liquidGL background after shader has warmed up
    frameCount.current++
    if (!captured.current && frameCount.current > 30 && onFirstFrame) {
      onFirstFrame(gl)
      captured.current = true
    }
  })

  const handlePointerMove = useCallback((e: any) => {
    if (e.uv) mouseRef.current.set(e.uv.x, e.uv.y)
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
  const handleFirstFrame = useCallback((gl: THREE.WebGLRenderer) => {
    // Capture shader as static image for liquidGL to refract.
    // Tiled across full page height so glass works at any scroll position.
    const canvas = gl.domElement
    if (canvas.width === 0) return
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      let bgDiv = document.getElementById('shader-bg-static')
      if (!bgDiv) {
        bgDiv = document.createElement('div')
        bgDiv.id = 'shader-bg-static'
        Object.assign(bgDiv.style, {
          position: 'absolute',
          top: '0', left: '0',
          width: '100%',
          height: `${document.body.scrollHeight}px`,
          zIndex: '-1',
          pointerEvents: 'none',
          backgroundImage: `url(${dataUrl})`,
          backgroundSize: '100vw 100vh',
          backgroundRepeat: 'repeat',
        })
        document.body.prepend(bgDiv)
      }
    } catch (_) {}
  }, [])

  return (
    <div className="fixed inset-0" style={{ zIndex: -2 }} data-liquid-ignore>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, preserveDrawingBuffer: true }}
        style={{ background: '#0a0a0a' }}
      >
        <ShaderPlane onFirstFrame={handleFirstFrame} />
      </Canvas>
    </div>
  )
}
