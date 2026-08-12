import type { ServiceDef } from '../lib/types'

export const SERVICES: ServiceDef[] = [
  {
    slug: 'residential-commercial-hvac',
    title: 'Residential & Commercial HVAC',
    short: 'Complete comfort systems for homes and businesses.',
    headline: 'ONE TEAM. EVERY SYSTEM.',
    description:
      "From single-family homes to commercial properties across Baton Rouge, Burton's Reliable services, installs and maintains complete heating and cooling systems — sized correctly, installed cleanly, and backed by 13+ years of hands-on experience.",
    bullets: ['Residential systems', 'Commercial systems', 'System sizing & consultation', 'Free estimates'],
    icon: 'Building2',
  },
  {
    slug: 'hvac-installation',
    title: 'HVAC Installation',
    short: 'Precision installs for full comfort systems.',
    headline: 'INSTALLED RIGHT. FROM DAY ONE.',
    description:
      'A comfort system is only as good as its installation. We handle complete HVAC installations — equipment selection, sizing, placement, and clean professional workmanship — with transparent pricing and no surprises.',
    bullets: ['Full system installation', 'Equipment consultation', 'Transparent pricing', 'Free estimates'],
    icon: 'Wrench',
  },
  {
    slug: 'ac-installation',
    title: 'AC Installation',
    short: 'Cooling built for Louisiana summers.',
    headline: 'BUILT FOR BATON ROUGE HEAT.',
    description:
      'Louisiana summers are unforgiving. We install air conditioning systems matched to your property and your budget, so your home stays cool through the hottest months of the year.',
    bullets: ['New AC installation', 'System replacement', 'Correct sizing', 'Free consultation'],
    icon: 'Snowflake',
  },
  {
    slug: 'heating-services',
    title: 'Heating Services',
    short: 'Dependable warmth when temperatures drop.',
    headline: 'WARMTH YOU CAN COUNT ON.',
    description:
      'When cold fronts move through Baton Rouge, your heating system needs to respond. We service, repair and maintain heating systems of all types for homes and businesses.',
    bullets: ['Heating repair', 'System tune-ups', 'Safety checks', 'Residential & commercial'],
    icon: 'Flame',
  },
  {
    slug: 'furnace-installation',
    title: 'Furnace Installation',
    short: 'Modern, efficient furnace systems.',
    headline: 'MODERN HEAT. PROFESSIONALLY INSTALLED.',
    description:
      'Whether you are replacing an aging furnace or installing new equipment, we handle furnace installation from selection through commissioning — done right the first time.',
    bullets: ['Furnace replacement', 'New installation', 'Equipment guidance', 'Free estimates'],
    icon: 'ThermometerSun',
  },
  {
    slug: 'preventive-maintenance',
    title: 'Preventive Maintenance',
    short: 'Stop breakdowns before they start.',
    headline: 'SMALL CHECKUPS. BIG SAVINGS.',
    description:
      'Regular maintenance keeps your system efficient, extends equipment life, and catches small issues before they become expensive failures. We offer thorough preventive maintenance for all HVAC systems.',
    bullets: ['Seasonal tune-ups', 'Filter & coil care', 'Performance checks', 'Extends system life'],
    icon: 'ShieldCheck',
  },
  {
    slug: 'winterization',
    title: 'Winterization',
    short: 'Prepare your system for the cold season.',
    headline: 'READY BEFORE THE FREEZE.',
    description:
      'Louisiana winters may be short, but hard freezes are real. Our winterization service prepares your HVAC system and protects your equipment before cold weather arrives.',
    bullets: ['Pre-season preparation', 'System protection', 'Heating readiness check', 'Peace of mind'],
    icon: 'CloudSnow',
  },
  {
    slug: 'emergency-services',
    title: 'Emergency HVAC Services',
    short: 'Fast response when comfort fails.',
    headline: 'WHEN COMFORT STOPS, WE GET IT MOVING AGAIN.',
    description:
      "HVAC failures never wait for a convenient time. Burton's Reliable offers emergency HVAC service for Baton Rouge homes and businesses — call (225) 603-2253 and we'll get your system moving again.",
    bullets: ['Emergency response', 'Rapid diagnostics', 'Honest assessment', 'Call (225) 603-2253'],
    icon: 'Siren',
  },
  {
    slug: 'hvac-diagnostics',
    title: 'HVAC Diagnostics',
    short: 'Find the real problem — fast.',
    headline: 'PRECISION DIAGNOSTICS. HONEST ANSWERS.',
    description:
      'Strange noises, weak airflow, rising bills? Our diagnostic process pinpoints exactly what is wrong with your system, and we explain it in plain language with transparent pricing before any work begins.',
    bullets: ['Full system inspection', 'Plain-language findings', 'Transparent pricing', 'No hidden fees'],
    icon: 'Gauge',
  },
  {
    slug: 'hvac-repairs',
    title: 'HVAC Repairs',
    short: 'Honest, lasting repairs for every system.',
    headline: 'FIXED RIGHT. PRICED FAIR.',
    description:
      'From worn components to failed compressors, we repair heating and cooling systems of every type. You get an honest assessment, a clear price, and a repair that lasts.',
    bullets: ['All makes & models', 'Honest assessments', 'Quality parts', 'Residential & commercial'],
    icon: 'Settings2',
  },
]

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug)
