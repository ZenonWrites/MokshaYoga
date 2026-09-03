import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

function FloatingOrb() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const t = performance.now() * 0.001
    meshRef.current.rotation.x = t * 0.08
    meshRef.current.rotation.y = t * 0.05
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.15
  })

  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]} position={[2.2, 0.2, -2]}>
      <MeshDistortMaterial
        color="#8a9a6a"
        attach="material"
        distort={0.35}
        speed={1.2}
        transparent
        opacity={0.07}
        roughness={0.8}
      />
    </Sphere>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={0.4} />
        <FloatingOrb />
      </Canvas>
    </div>
  )
}
