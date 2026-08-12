import type { ServiceDef } from '../lib/types'

export const SERVICES: ServiceDef[] = [
  {
    slug: 'residential-commercial-hvac',
    title: 'Residential & Commercial HVAC',
    short: 'Complete comfort systems for homes and businesses.',
    headline: 'ONE TEAM. EVERY SYSTEM.',
    description:
      "From single-family homes to commercial properties across Baton Rouge, Burton's Reliable services, installs and maintains complete heating and cooling systems, sized correctly, installed cleanly, and backed by 13+ years of hands-on experience.",
    bullets: ['Residential systems', 'Commercial systems', 'System sizing & consultation', 'Free estimates'],
    icon: 'Building2',
  },
  {
    slug: 'hvac-installation',
    title: 'HVAC Installation',
    short: 'Precision installs for full comfort systems.',
    headline: 'INSTALLED RIGHT. FROM DAY ONE.',
    description:
      'A comfort system is only as good as its installation. From furnace installations to package unit replacements, we do it all: equipment selection, sizing, placement, and clean professional workmanship. Get a free estimate on your air purifier, mini-split or furnace installation when you contact us today.',
    bullets: ['Furnaces & evaporator coils', 'Mini-splits & package units', 'Humidifiers, dehumidifiers & air purifiers', 'Water heaters'],
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
      'When cold fronts move through Baton Rouge, your heating system needs to respond. We work with all types of HVAC units, including furnaces, heat pumps, straight cool systems and mini-splits, for homes and businesses alike.',
    bullets: ['Furnaces & heat pumps', 'Straight cool systems & mini-splits', 'Repairs & tune-ups', 'Residential & commercial'],
    icon: 'Flame',
  },
  {
    slug: 'furnace-installation',
    title: 'Furnace Installation',
    short: 'Modern, efficient furnace systems.',
    headline: 'MODERN HEAT. PROFESSIONALLY INSTALLED.',
    description:
      'Whether you are replacing an aging furnace or installing new equipment, we handle furnace installation from selection through commissioning, done right the first time.',
    bullets: ['Furnace replacement', 'New installation', 'Equipment guidance', 'Free estimates'],
    icon: 'ThermometerSun',
  },
  {
    slug: 'preventive-maintenance',
    title: 'Preventive Maintenance',
    short: 'Stop breakdowns before they start.',
    headline: 'SMALL CHECKUPS. BIG SAVINGS.',
    description:
      'Regular maintenance keeps your system efficient, extends equipment life, and catches small issues before they become expensive failures. We thoroughly clean the inside and outside of your system and check that every component is in good working order.',
    bullets: ['Complete unit cleaning', 'Seasonal tune-ups', 'Filter & coil care', 'Extends system life'],
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
      "HVAC failures never wait for a convenient time. Burton's Reliable offers emergency HVAC service for Baton Rouge homes and businesses, call (225) 603-2253 and we'll get your system moving again.",
    bullets: ['Emergency response', 'Rapid diagnostics', 'Honest assessment', 'Call (225) 603-2253'],
    icon: 'Siren',
  },
  {
    slug: 'hvac-diagnostics',
    title: 'HVAC Diagnostics',
    short: 'Find the real problem, fast.',
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
      'From worn components to failed compressors, we repair heating and cooling systems of every type. Consultations and diagnostic estimates are almost always free; if any extra charges apply, we let you know first.',
    bullets: ['All makes & models', 'Free consultations & estimates', 'Quality parts', 'Residential & commercial'],
    icon: 'Settings2',
  },
  {
    slug: 'ductwork',
    title: 'Ductwork Cleaning & Repair',
    short: 'Clean, sealed ducts for healthy airflow.',
    headline: 'BETTER AIR STARTS IN THE DUCTS.',
    description:
      'Leaky or dirty ducts waste energy and spread dust through your home. We clean and repair ductwork so conditioned air gets exactly where it should, efficiently and cleanly.',
    bullets: ['Duct cleaning', 'Duct repair & sealing', 'Improved airflow', 'Healthier indoor air'],
    icon: 'Wind',
  },
  {
    slug: 'indoor-air-quality',
    title: 'Indoor Air Quality',
    short: 'Humidifiers, dehumidifiers and air purifiers.',
    headline: 'BREATHE EASIER AT HOME.',
    description:
      'Louisiana humidity is hard on homes and lungs. We install, clean and maintain air quality systems, including humidifiers, dehumidifiers and air purifiers, matched to your home and your needs.',
    bullets: ['Air purifiers', 'Humidifiers & dehumidifiers', 'Cleaning & maintenance', 'Free estimates'],
    icon: 'Leaf',
  },
  {
    slug: 'drain-cleaning',
    title: 'Drain Cleaning & Plumbing Repairs',
    short: 'Twice-a-year drain care and dependable fixes.',
    headline: 'CLEAR DRAINS. NO SURPRISES.',
    description:
      'Beyond HVAC, we keep water moving too. Routine drain cleaning twice a year prevents clogs, protects your pipes and property, reduces odors and keeps slow drains flowing. We also handle the repairs that come with them.',
    bullets: ['Clogged drains & leaky fixtures', 'Gas, water & sewer lines', 'Water heaters & sump pumps', 'Preventive drain cleaning'],
    icon: 'Droplets',
  },
]

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug)
