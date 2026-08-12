export interface SystemPart {
  id: string
  label: string
  title: string
  description: string
  position: [number, number, number]
}

export const SYSTEM_PARTS: SystemPart[] = [
  {
    id: 'compressor',
    label: 'Compressor',
    title: 'COMPRESSOR',
    description: 'The heart of your cooling system. It pressurizes refrigerant and drives the entire cooling cycle.',
    position: [-2.6, 0.4, 1.2],
  },
  {
    id: 'air-handler',
    label: 'Air Handler',
    title: 'AIR HANDLER',
    description: 'Moves conditioned air throughout your home, working with the evaporator coil to deliver comfort.',
    position: [1.6, 1.5, 0.4],
  },
  {
    id: 'ductwork',
    label: 'Ductwork',
    title: 'DUCT SYSTEM',
    description: 'Delivers conditioned air throughout your property. Sealed, balanced ducts mean even temperatures and lower bills.',
    position: [0.8, 2.55, -0.6],
  },
  {
    id: 'thermostat',
    label: 'Thermostat',
    title: 'THERMOSTAT',
    description: 'The command center. It reads your home’s temperature and tells the system when to heat or cool.',
    position: [0.1, 1.3, 1.45],
  },
  {
    id: 'refrigerant',
    label: 'Refrigerant Lines',
    title: 'REFRIGERANT LINES',
    description: 'Copper lines that carry refrigerant between the outdoor and indoor units, the system’s circulatory system.',
    position: [-0.9, 0.55, 1.1],
  },
]
