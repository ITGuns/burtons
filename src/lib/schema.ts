import { BUSINESS } from './constants'
import { FAQS } from '../data/faqs'

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: BUSINESS.name,
  telephone: '+1-225-603-2253',
  url: BUSINESS.website,
  logo: `${BUSINESS.website}/logo.png`,
  image: `${BUSINESS.website}/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '10023 Mammoth Avenue',
    addressLocality: 'Baton Rouge',
    addressRegion: 'LA',
    postalCode: '70814',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
  areaServed: { '@type': 'City', name: 'Baton Rouge' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:00', closes: '12:00' },
  ],
  sameAs: [BUSINESS.facebook],
}

export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export const serviceSchema = (name: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: name,
  description,
  provider: { '@type': 'HVACBusiness', name: BUSINESS.name, telephone: '+1-225-603-2253' },
  areaServed: { '@type': 'City', name: 'Baton Rouge' },
})
