import { Suspense, useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

/** Real Burton's Reliable logo decal on a white nameplate (local texture, no CDN). */
function LogoBadge() {
  const tex = useLoader(THREE.TextureLoader, '/logo.png')
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return (
    <mesh position={[0, 0.62, 1.187]}>
      <planeGeometry args={[0.82, 0.31]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  )
}

/**
 * Procedural futuristic HVAC condenser unit:
 * metallic cabinet with louvers, top grille, spinning turbine fan,
 * copper refrigerant lines and a glowing core.
 */
export default function HVACUnit({ reduced = false }: { reduced?: boolean }) {
  const group = useRef<THREE.Group>(null)
  const fan = useRef<THREE.Group>(null)
  const statusStrip = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state, delta) => {
    if (fan.current && !reduced) fan.current.rotation.y += delta * 5.5
    if (group.current) {
      group.current.rotation.y += delta * (reduced ? 0 : 0.12)
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05
    }
    if (statusStrip.current && !reduced) {
      statusStrip.current.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 2.4) * 0.9
    }
  })

  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#a8b6ca',
        metalness: 0.85,
        roughness: 0.28,
        envMapIntensity: 1.6,
      }),
    [],
  )
  const darkSteel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5b6f94',
        metalness: 0.75,
        roughness: 0.35,
        envMapIntensity: 1.4,
      }),
    [],
  )
  const copper = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b87333',
        metalness: 1,
        roughness: 0.25,
      }),
    [],
  )
  const blade = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8d3e2',
        metalness: 0.95,
        roughness: 0.2,
        side: THREE.DoubleSide,
      }),
    [],
  )

  // Louver slats around the cabinet — instanced for performance.
  const louvers = useMemo(() => {
    const items: { pos: [number, number, number]; rotY: number }[] = []
    const sides = [
      { rotY: 0, x: 0, z: 1.155 },
      { rotY: Math.PI, x: 0, z: -1.155 },
      { rotY: Math.PI / 2, x: 1.155, z: 0 },
      { rotY: -Math.PI / 2, x: -1.155, z: 0 },
    ]
    for (const s of sides) {
      for (let i = 0; i < 12; i++) {
        items.push({ pos: [s.x, -0.85 + i * 0.16, s.z], rotY: s.rotY })
      }
    }
    return items
  }, [])

  // Refrigerant line curve
  const pipeCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.9, -1.05, 1.0),
        new THREE.Vector3(1.45, -0.9, 1.2),
        new THREE.Vector3(1.7, -0.3, 0.9),
        new THREE.Vector3(1.85, 0.4, 0.2),
        new THREE.Vector3(1.75, 0.9, -0.6),
      ]),
    [],
  )
  const pipeCurve2 = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.7, -1.1, 1.05),
        new THREE.Vector3(1.3, -1.05, 1.45),
        new THREE.Vector3(1.8, -0.7, 1.3),
        new THREE.Vector3(2.05, 0.0, 0.7),
      ]),
    [],
  )

  return (
    <group ref={group}>
      {/* Cabinet */}
      <mesh material={steel} castShadow>
        <boxGeometry args={[2.3, 2.2, 2.3]} />
      </mesh>
      {/* Corner posts */}
      {[
        [-1.16, 1.16], [1.16, 1.16], [-1.16, -1.16], [1.16, -1.16],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} material={darkSteel}>
          <boxGeometry args={[0.14, 2.26, 0.14]} />
        </mesh>
      ))}
      {/* Louvers */}
      {louvers.map((l, i) => (
        <mesh key={i} position={l.pos} rotation={[0.35, l.rotY, 0]} material={darkSteel}>
          <boxGeometry args={[2.0, 0.035, 0.09]} />
        </mesh>
      ))}
      {/* Top plate */}
      <mesh position={[0, 1.14, 0]} material={darkSteel}>
        <boxGeometry args={[2.36, 0.1, 2.36]} />
      </mesh>
      {/* Fan shroud */}
      <mesh position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]} material={steel}>
        <ringGeometry args={[0.88, 1.08, 48]} />
      </mesh>
      <mesh position={[0, 1.3, 0]} material={darkSteel}>
        <cylinderGeometry args={[0.92, 0.98, 0.22, 48, 1, true]} />
      </mesh>

      {/* Turbine fan */}
      <group ref={fan} position={[0, 1.28, 0]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            rotation={[0, (i / 6) * Math.PI * 2, 0.5]}
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 0.45,
              0,
              -Math.sin((i / 6) * Math.PI * 2) * 0.45,
            ]}
            material={blade}
          >
            <boxGeometry args={[0.72, 0.02, 0.3]} />
          </mesh>
        ))}
        <mesh material={darkSteel}>
          <cylinderGeometry args={[0.16, 0.16, 0.18, 24]} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#3629d1" emissive="#3629d1" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Protective grille */}
      <group position={[0, 1.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0.25, 0.45, 0.65, 0.85].map((r) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.012, 8, 48]} />
            <meshStandardMaterial color="#556274" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]} position={[0, 0, 0]}>
            <boxGeometry args={[1.76, 0.02, 0.02]} />
            <meshStandardMaterial color="#556274" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Refrigerant lines */}
      <mesh material={copper}>
        <tubeGeometry args={[pipeCurve, 40, 0.045, 12]} />
      </mesh>
      <mesh material={copper}>
        <tubeGeometry args={[pipeCurve2, 40, 0.03, 12]} />
      </mesh>

      {/* Branded nameplate */}
      <mesh position={[0, 0.62, 1.17]} material={steel}>
        <boxGeometry args={[0.95, 0.42, 0.035]} />
      </mesh>
      <mesh position={[0, 0.62, 1.182]}>
        <boxGeometry args={[0.9, 0.37, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.05} />
      </mesh>
      <Suspense fallback={null}>
        <LogoBadge />
      </Suspense>

      {/* Service panel with glowing status strip */}
      <mesh position={[0, -0.2, 1.17]} material={darkSteel}>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
      </mesh>
      <mesh position={[0, 0.12, 1.2]}>
        <boxGeometry args={[0.5, 0.05, 0.02]} />
        <meshStandardMaterial ref={statusStrip} color="#5a52e8" emissive="#5a52e8" emissiveIntensity={2.4} />
      </mesh>
      <mesh position={[-0.18, -0.05, 1.2]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color="#d1121d" emissive="#d1121d" emissiveIntensity={2} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -1.2, 0]} material={darkSteel}>
        <boxGeometry args={[2.5, 0.16, 2.5]} />
      </mesh>
    </group>
  )
}
