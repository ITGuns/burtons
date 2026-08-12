import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import HVACUnit from './HVACUnit'
import { MiniSplit, SmartThermostat } from './AuxUnits'

const SLOT_COUNT = 3
const STEP = (Math.PI * 2) / SLOT_COUNT
const HOLD_SECONDS = 5.5
// Narrow ellipse: depth swing is generous, side swing tight, so waiting units
// tuck behind the featured one instead of drifting over the headline.
const RADIUS_X = 0.9
const RADIUS_Z = 2.0

/**
 * Automatic 3D turntable: the three equipment types ride a circular track and
 * take turns front-and-center. Units stay upright; distance + scale convey
 * depth. Static (condenser featured) when reduced motion is requested.
 */
export default function EquipmentCarousel({ reduced }: { reduced: boolean }) {
  const slots = useRef<(THREE.Group | null)[]>([])
  const angle = useRef(0)
  const target = useRef(0)
  const lastAdvance = useRef(0)

  useFrame((state, delta) => {
    if (!reduced) {
      if (state.clock.elapsedTime - lastAdvance.current > HOLD_SECONDS) {
        lastAdvance.current = state.clock.elapsedTime
        target.current += STEP
      }
      angle.current = THREE.MathUtils.damp(angle.current, target.current, 2.4, delta)
    }
    slots.current.forEach((g, i) => {
      if (!g) return
      const a = angle.current + i * STEP
      const depth = Math.cos(a) // 1 = front, -1 = behind
      g.position.set(Math.sin(a) * RADIUS_X, (depth - 1) * 0.22, depth * RADIUS_Z)
      g.scale.setScalar(THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(depth, -1, 1, 0.35, 1), 0.35, 1))
    })
  })

  const float = {
    speed: reduced ? 0 : 1.3,
    rotationIntensity: reduced ? 0 : 0.12,
    floatIntensity: reduced ? 0 : 0.3,
  }

  return (
    <group>
      <group ref={(el) => { slots.current[0] = el }}>
        <Float {...float}>
          <HVACUnit reduced={reduced} />
        </Float>
      </group>
      <group ref={(el) => { slots.current[1] = el }}>
        <Float {...float}>
          <group scale={1.55} rotation={[0.06, -0.12, 0]}>
            <MiniSplit />
          </group>
        </Float>
      </group>
      <group ref={(el) => { slots.current[2] = el }}>
        <Float {...float}>
          <group scale={1.75}>
            <SmartThermostat />
          </group>
        </Float>
      </group>
    </group>
  )
}
