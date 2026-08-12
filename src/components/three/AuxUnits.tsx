import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Satellite equipment for the hero scene, a wall-mount mini-split head and a
 * smart thermostat puck. Procedural like HVACUnit; no external assets.
 */

export function MiniSplit() {
  const shell = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f4f4fe',
        metalness: 0.15,
        roughness: 0.32,
        envMapIntensity: 1.2,
      }),
    [],
  )
  const dark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#141157',
        metalness: 0.6,
        roughness: 0.4,
      }),
    [],
  )
  return (
    <group>
      {/* Curved shell */}
      <RoundedBox args={[1.7, 0.55, 0.42]} radius={0.12} smoothness={4} material={shell} />
      {/* Bottom outlet vent with slats */}
      <mesh position={[0, -0.17, 0.16]} rotation={[0.5, 0, 0]} material={dark}>
        <boxGeometry args={[1.46, 0.14, 0.06]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.145 - i * 0.035, 0.205]} rotation={[0.5, 0, 0]} material={shell}>
          <boxGeometry args={[1.42, 0.012, 0.05]} />
        </mesh>
      ))}
      {/* Top intake grooves */}
      {[-0.05, 0, 0.05].map((z) => (
        <mesh key={z} position={[0, 0.28, z]} material={dark}>
          <boxGeometry args={[1.5, 0.008, 0.02]} />
        </mesh>
      ))}
      {/* Status display */}
      <mesh position={[0.58, 0.02, 0.215]}>
        <boxGeometry args={[0.2, 0.08, 0.01]} />
        <meshStandardMaterial color="#3629d1" emissive="#3629d1" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <mesh position={[0.45, 0.02, 0.216]}>
        <circleGeometry args={[0.015, 12]} />
        <meshStandardMaterial color="#d1121d" emissive="#d1121d" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function SmartThermostat() {
  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8d3e2',
        metalness: 0.9,
        roughness: 0.22,
        envMapIntensity: 1.5,
      }),
    [],
  )
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#232a75',
        metalness: 0.5,
        roughness: 0.18,
        envMapIntensity: 1.7,
        emissive: '#3629d1',
        emissiveIntensity: 0.22,
      }),
    [],
  )
  return (
    <group>
      {/* Metal bezel + dark glass face */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <torusGeometry args={[0.42, 0.065, 16, 48]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={glass}>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 48]} />
      </mesh>
      {/* Glowing temperature ring + readout */}
      <mesh position={[0, 0, 0.075]}>
        <torusGeometry args={[0.27, 0.014, 8, 48]} />
        <meshStandardMaterial color="#5a52e8" emissive="#5a52e8" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.072]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#dedefb" emissive="#dedefb" emissiveIntensity={1.1} />
      </mesh>
      <mesh position={[0, -0.19, 0.072]}>
        <circleGeometry args={[0.022, 12]} />
        <meshStandardMaterial color="#d1121d" emissive="#d1121d" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* Wall mount stub */}
      <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <cylinderGeometry args={[0.12, 0.16, 0.08, 24]} />
      </mesh>
    </group>
  )
}
