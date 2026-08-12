import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

import { SYSTEM_PARTS, type SystemPart } from './systemParts'

function Hotspot({
  part, active, onSelect,
}: { part: SystemPart; active: boolean; onSelect: (id: string) => void }) {
  return (
    <Html position={part.position} center zIndexRange={[40, 0]}>
      <button
        onClick={() => onSelect(part.id)}
        aria-label={`Explore ${part.label}`}
        className={`relative flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 cursor-pointer ${
          active
            ? 'bg-electric-400 border-electric-300 scale-110 shadow-[0_0_20px_rgba(90,82,232,0.8)]'
            : 'bg-navy-900/80 border-electric-400/60 hover:bg-royal-600/60'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${active ? 'bg-navy-900' : 'bg-electric-400'}`} />
        {!active && (
          <span className="absolute inset-0 rounded-full border border-electric-400/50 animate-pulse-ring" />
        )}
      </button>
    </Html>
  )
}

/** Simplified cutaway home + HVAC system, slowly rotating. */
function SystemModel({ activePart, reduced }: { activePart: string | null; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += delta * 0.06
  })

  const wall = { color: '#16135e', metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.5 } as const
  const highlight = (id: string) => (activePart === id ? 2.2 : 0)

  return (
    <group ref={group} position={[0.2, -0.9, 0]}>
      {/* House shell (cutaway) */}
      <mesh position={[1.2, 1.2, 0]}>
        <boxGeometry args={[3.4, 2.4, 2.6]} />
        <meshStandardMaterial {...wall} side={THREE.BackSide} />
      </mesh>
      {/* Roof line */}
      <mesh position={[1.2, 2.75, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.6, 1.1, 4]} />
        <meshStandardMaterial color="#100e48" metalness={0.2} roughness={0.8} transparent opacity={0.6} />
      </mesh>
      {/* Floor */}
      <mesh position={[1.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.6]} />
        <meshStandardMaterial color="#0a0834" roughness={0.9} />
      </mesh>

      {/* Outdoor condenser (compressor) */}
      <group position={[-2.6, 0.42, 1.2]}>
        <mesh>
          <boxGeometry args={[0.9, 0.85, 0.9]} />
          <meshStandardMaterial
            color="#8a97ab" metalness={0.9} roughness={0.35}
            emissive="#3629d1" emissiveIntensity={highlight('compressor') * 0.25}
          />
        </mesh>
        <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.34, 32]} />
          <meshStandardMaterial color="#2a3548" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Air handler (indoor unit) */}
      <mesh position={[1.6, 1.5, 0.4]}>
        <boxGeometry args={[0.7, 1.1, 0.6]} />
        <meshStandardMaterial
          color="#c8d3e2" metalness={0.7} roughness={0.4}
          emissive="#3629d1" emissiveIntensity={highlight('air-handler') * 0.25}
        />
      </mesh>

      {/* Ductwork */}
      <group>
        <mesh position={[0.8, 2.35, -0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 2.6, 16]} />
          <meshStandardMaterial
            color="#8a97ab" metalness={0.85} roughness={0.3}
            emissive="#3629d1" emissiveIntensity={highlight('ductwork') * 0.3}
          />
        </mesh>
        <mesh position={[2.1, 2.0, -0.6]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.8, 16]} />
          <meshStandardMaterial color="#8a97ab" metalness={0.85} roughness={0.3}
            emissive="#3629d1" emissiveIntensity={highlight('ductwork') * 0.3} />
        </mesh>
        <mesh position={[-0.4, 2.0, -0.6]}>
          <cylinderGeometry args={[0.14, 0.14, 0.8, 16]} />
          <meshStandardMaterial color="#8a97ab" metalness={0.85} roughness={0.3}
            emissive="#3629d1" emissiveIntensity={highlight('ductwork') * 0.3} />
        </mesh>
      </group>

      {/* Thermostat */}
      <mesh position={[0.1, 1.3, 1.32]}>
        <boxGeometry args={[0.3, 0.4, 0.06]} />
        <meshStandardMaterial
          color="#ebecfa" metalness={0.3} roughness={0.4}
          emissive="#5a52e8" emissiveIntensity={0.6 + highlight('thermostat') * 0.5}
        />
      </mesh>

      {/* Refrigerant lines: outdoor → indoor */}
      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-2.2, 0.3, 1.2),
              new THREE.Vector3(-1.0, 0.25, 1.1),
              new THREE.Vector3(0.4, 0.4, 0.7),
              new THREE.Vector3(1.4, 1.0, 0.45),
            ]),
            32, 0.045, 10,
          ]}
        />
        <meshStandardMaterial
          color="#b87333" metalness={1} roughness={0.25}
          emissive="#d1121d" emissiveIntensity={highlight('refrigerant') * 0.4}
        />
      </mesh>
    </group>
  )
}

interface Props {
  activePart: string | null
  onSelect: (id: string) => void
  reduced: boolean
  mobile: boolean
}

export default function SystemExplorer({ activePart, onSelect, reduced, mobile }: Props) {
  const [hovering, setHovering] = useState(false)
  return (
    <div
      className="w-full h-full"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0.6, 2.2, 7.4], fov: 40 }}
        gl={{ antialias: !mobile, alpha: true }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} color="#dedefb" />
          <pointLight position={[-4, 2, 3]} intensity={1} color="#3629d1" />
          <SystemModel activePart={activePart} reduced={reduced || hovering} />
          {SYSTEM_PARTS.map((p) => (
            <Hotspot key={p.id} part={p} active={activePart === p.id} onSelect={onSelect} />
          ))}
          <ContactShadows position={[0, -1.05, 0]} opacity={0.5} scale={12} blur={2.8} far={4} color="#020617" />
          <Environment resolution={64}>
            <Lightformer intensity={2.5} position={[0, 5, -2]} scale={[8, 3, 1]} color="#dedefb" />
            <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#3629d1" />
          </Environment>
          <fog attach="fog" args={['#171082', 12, 24]} />
        </Suspense>
      </Canvas>
    </div>
  )
}
