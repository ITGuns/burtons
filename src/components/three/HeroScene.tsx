import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import EquipmentCarousel from './EquipmentCarousel'
import Particles from './Particles'

/** Holographic technical rings orbiting the unit. */
function HoloRings({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (g.current && !reduced) g.current.rotation.y -= delta * 0.1
  })
  return (
    <group ref={g}>
      {[2.4, 3.1, 3.9].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.06, 0, 0]} position={[0, -0.6 + i * 0.3, 0]}>
          <torusGeometry args={[r, 0.004, 8, 128]} />
          <meshBasicMaterial
            color={i === 1 ? '#fdd2d4' : '#ffffff'}
            transparent
            opacity={i === 1 ? 0.3 : 0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Camera rig: mouse parallax + scroll pull-back, smoothly interpolated. */
function Rig({
  scrollRef, reduced, focusX,
}: { scrollRef: React.RefObject<number>; reduced: boolean; focusX: number }) {
  const { camera, pointer } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const scroll = scrollRef.current ?? 0
    const px = reduced ? 0 : pointer.x
    const py = reduced ? 0 : pointer.y
    target.set(
      focusX * 0.55 + px * 0.7,
      0.4 + py * 0.4 + scroll * 2.2,
      6.4 + scroll * 5.5,
    )
    camera.position.lerp(target, 0.045)
    camera.lookAt(focusX, 0.15 - scroll * 0.8, 0)
  })
  return null
}

interface Props {
  scrollRef: React.RefObject<number>
  reduced: boolean
  mobile: boolean
  onReady?: () => void
}

export default function HeroScene({ scrollRef, reduced, mobile, onReady }: Props) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0.4, 6.2], fov: 42 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
      shadows={false}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.35} />
        <directionalLight position={[5, 6, 4]} intensity={3} color="#ffffff" />
        <directionalLight position={[-6, 3, -4]} intensity={1.2} color="#b7b4f6" />
        <pointLight position={[0, 3.4, 2]} intensity={3} color="#dedefb" distance={12} />
        <pointLight position={[3, -1, 3]} intensity={1} color="#fa8e94" distance={8} />

        {/* Composition: carousel sits right-of-center on desktop, centered on mobile */}
        <group position={mobile ? [0, 0.8, 0] : [2.1, 0.2, 0]} scale={mobile ? 0.55 : 0.8}>
          <EquipmentCarousel reduced={reduced} />
          <HoloRings reduced={reduced} />
        </group>
        <Particles count={mobile ? 120 : 350} reduced={reduced} />

        <Rig scrollRef={scrollRef} reduced={reduced} focusX={mobile ? 0 : 2.1} />
        {/* Procedural environment — no external HDR fetch, fully offline. */}
        <Environment resolution={64}>
          <Lightformer intensity={3.4} position={[0, 4, -2]} scale={[8, 3, 1]} color="#ffffff" />
          <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#b7b4f6" />
          <Lightformer intensity={1.6} position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ebecfa" />
          <Lightformer intensity={0.5} position={[0, -2, 4]} scale={[4, 1, 1]} color="#fab4b9" />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
