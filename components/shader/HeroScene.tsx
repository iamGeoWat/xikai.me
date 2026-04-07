'use client'

import { useRef, useCallback, useEffect } from 'react'
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
  const bgApplied = useRef(false)

  const handleFrame = useCallback((gl: THREE.WebGLRenderer) => {
    // After a few frames, capture the shader as a static image
    // and set it as the body background so liquidGL can see it
    // at ALL scroll positions (not just the first viewport)
    if (bgApplied.current) return

    const canvas = gl.domElement
    if (canvas.width === 0 || canvas.height === 0) return

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      // Set on a full-page div instead of body, so html2canvas captures it
      // at every scroll position. The real shader (fixed canvas) is the visual bg.
      let bgDiv = document.getElementById('shader-bg-static')
      if (!bgDiv) {
        bgDiv = document.createElement('div')
        bgDiv.id = 'shader-bg-static'
        bgDiv.style.cssText = `
          position: absolute; top: 0; left: 0; width: 100%; height: ${document.body.scrollHeight}px;
          z-index: -1; pointer-events: none;
          background-image: url(${dataUrl});
          background-size: 100vw 100vh;
          background-repeat: repeat;
        `
        document.body.prepend(bgDiv)
      }
      bgApplied.current = true
    } catch (_) {
      // Ignore cross-origin errors
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
    </>
  )
}
