'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

import vertexShader from './hero.vert'
import fragmentShader from './hero.frag'

function HeroPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseTarget = useRef(new THREE.Vector2(0, 0))
  const mouseCurrent = useRef(new THREE.Vector2(0, 0))

  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uResolution.value.set(
      state.size.width * state.viewport.dpr,
      state.size.height * state.viewport.dpr,
    )

    // Lerp mouse for smoothness
    mouseCurrent.current.lerp(mouseTarget.current, 0.05)
    uniforms.uMouse.value.copy(mouseCurrent.current)
  })

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      // Map pointer to -1..1
      mouseTarget.current.set(
        (e.pointer.x),
        (e.pointer.y),
      )
    },
    [],
  )

  return (
    <mesh ref={meshRef} onPointerMove={handlePointerMove}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-0 animate-[fadeIn_2s_ease_forwards]">
      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: '#0a0a0a' }}
      >
        <HeroPlane />
      </Canvas>
    </div>
  )
}
