import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import TrustMetrics from '../components/home/TrustMetrics'
import AboutSection from '../components/home/AboutSection'
import ServicesShowcase from '../components/home/ServicesShowcase'
import ServiceCardsRow from '../components/home/ServiceCardsRow'
import SystemSection from '../components/home/SystemSection'
import WhySection from '../components/home/WhySection'
import BeforeAfter from '../components/home/BeforeAfter'
import ServiceAreaSection from '../components/home/ServiceAreaSection'
import FinancingSection from '../components/home/FinancingSection'
import ReviewsSection from '../components/home/ReviewsSection'
import FAQSection from '../components/home/FAQSection'
import { useSEO } from '../lib/useSEO'
import { LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA } from '../lib/schema'
import { getSiteContent, subscribe } from '../lib/db'
import type { SiteContent } from '../lib/types'

const FALLBACK: SiteContent = {
  hero_headline: "BURTON'S RELIABLE",
  hero_subheadline: 'Engineered for comfort. Built for reliability.',
  hero_description:
    'Premium heating, cooling, installation and HVAC repair services for homes and businesses throughout Baton Rouge.',
  cta_text: 'Request Service',
}

export default function Home() {
  const [content, setContent] = useState<SiteContent>(FALLBACK)

  useSEO({
    title: "HVAC Company Baton Rouge | Burton's Reliable Heating and Air Conditioning LLC",
    description:
      "AC repair, heating repair, HVAC installation and maintenance in Baton Rouge, LA. 13+ years of experience, free estimates, transparent pricing. Call (225) 603-2253.",
    jsonLd: [LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA],
  })

  useEffect(() => {
    getSiteContent().then(setContent).catch(() => {})
    return subscribe('site_content', () => {
      getSiteContent().then(setContent).catch(() => {})
    })
  }, [])

  return (
    <>
      <Hero content={content} />
      <AboutSection />
      <TrustMetrics />
      <ServicesShowcase />
      <ServiceCardsRow />
      <SystemSection />
      <WhySection />
      <BeforeAfter />
      <ServiceAreaSection />
      <FinancingSection />
      <ReviewsSection />
      <FAQSection />
    </>
  )
}
