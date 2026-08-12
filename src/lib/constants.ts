/**
 * Verified business facts for Burton's Reliable Heating and Air Conditioning LLC.
 * Source: burtonsreliablellc.com + public listings. Do not invent facts here.
 */
export const BUSINESS = {
  name: "Burton's Reliable Heating and Air Conditioning LLC",
  shortName: "Burton's Reliable",
  phone: '(225) 603-2253',
  phoneHref: 'tel:+12256032253',
  address: '10023 Mammoth Avenue, Baton Rouge, LA 70814',
  city: 'Baton Rouge',
  state: 'Louisiana',
  stateAbbr: 'LA',
  zip: '70814',
  yearsExperience: '13+',
  website: 'https://burtonsreliablellc.com',
  facebook: 'https://www.facebook.com/burtonsreliableheatandair/',
  hours: [
    { days: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
    { days: 'Saturday', hours: '7:00 AM – 12:00 PM' },
    { days: 'Sunday', hours: 'Closed' },
  ],
  tagline: 'Engineered for comfort. Built for reliability.',
  geo: { lat: 30.4515, lng: -91.0796 },
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Service Area', href: '/service-area' },
  { label: 'Financing', href: '/financing' },
  { label: 'Contact', href: '/contact' },
] as const

export const BOOKING_SERVICES = [
  'AC Repair',
  'Heating Repair',
  'HVAC Installation',
  'Maintenance',
  'Emergency Service',
  'Diagnostics',
  'Other',
] as const
