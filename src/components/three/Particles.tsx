import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Cool-air particles drifting upward from the unit + ambient dust field. */
export default function Particles({ count = 350, reduced = false }: { count?: number; reduced?: boolean }) {
  const points = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 6
      const a = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = Math.random() * 7 - 2
      positions[i * 3 + 2] = Math.sin(a) * r
      speeds[i] = 0.15 + Math.random() * 0.45
    }
    return { positions, speeds }
  }, [count])

  useFrame((_, delta) => {
    if (!points.current || reduced) return
    const pos = points.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * delta
      if (y > 5) y = -2
      pos.setY(i, y)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
