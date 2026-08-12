import PageHeader from '../components/layout/PageHeader'
import ServiceAreaSection from '../components/home/ServiceAreaSection'
import { useSEO } from '../lib/useSEO'

export default function ServiceAreaPage() {
  useSEO({
    title: "Service Area | HVAC Services in Baton Rouge, LA | Burton's Reliable",
    description:
      "Burton's Reliable Heating and Air Conditioning serves Baton Rouge, Louisiana and surrounding areas with residential and commercial HVAC services.",
  })
  return (
    <div>
      <PageHeader
        eyebrow="Coverage"
        title={'Our service\narea.'}
        description="Local, responsive HVAC service across Baton Rouge and the surrounding area."
      />
      <ServiceAreaSection />
    </div>
  )
}
