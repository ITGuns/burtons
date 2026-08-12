import PageHeader from '../components/layout/PageHeader'
import FinancingSection from '../components/home/FinancingSection'
import Reveal from '../components/ui/Reveal'
import { BUSINESS } from '../lib/constants'
import { useSEO } from '../lib/useSEO'

export default function Financing() {
  useSEO({
    title: "HVAC Financing Options | Burton's Reliable Heating and Air Conditioning | Baton Rouge",
    description:
      'Financing options are available for HVAC installations and major repairs in Baton Rouge. Call (225) 603-2253 for current terms and a free estimate.',
  })
  return (
    <div>
      <PageHeader
        eyebrow="Financing"
        title={'Comfort now.\nPay over time.'}
        description="Financing options are available for qualifying projects. Contact us for current terms. We never quote financing details we can't stand behind."
      />
      <FinancingSection />
      <Reveal className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <p className="text-sm text-navy-900/50 leading-relaxed">
          Financing availability and terms vary by project and provider. For accurate, current information about
          financing your installation or repair, call {BUSINESS.phone}, we&apos;ll walk you through the options
          during your free estimate.
        </p>
      </Reveal>
    </div>
  )
}
