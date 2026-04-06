'use client'

import { useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './hero.vert'
import fragmentShader from './hero.frag'

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5))
  const { size } = useThree()

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouseRef.current, 0.05)
    uniforms.current.uResolution.value.set(size.width, size.height)
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
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: '#0a0a0a' }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  )
}
