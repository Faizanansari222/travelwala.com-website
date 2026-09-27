import Accordion from '../components/Accordion'
import CtaBanner from '../components/CtaBanner'
import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { Reveal } from '../components/Reveal'
import HowItWorks from '../components/umrah/HowItWorks'
import PackageDetails from '../components/umrah/PackageDetails'
import PricingTiers from '../components/umrah/PricingTiers'
import UmrahHero from '../components/umrah/UmrahHero'
import { umrahFaqs } from '../data/faqs'

export default function Umrah() {
  return (
    <>
      <Seo
        title="Umrah & Hajj Packages"
        description="Economy, Standard and Premium Umrah packages from Pakistan with flights, visa, hotels near the Haram, transport and guided ziyarat. Hajj instalment plans available."
        path="/umrah"
      />
      <UmrahHero />
      <PricingTiers />
      <PackageDetails />
      <HowItWorks />

      <section className="section-y pt-0 md:pt-0" aria-labelledby="faq-title">
        <div className="wrap max-w-4xl">
          <SectionTitle
            id="faq-title"
            eyebrow="Questions"
            title="Frequently asked questions"
            subtitle="Everything families usually ask us before their Umrah. Still curious? We’re one WhatsApp away."
          />
          <Reveal>
            <Accordion items={umrahFaqs.map((f) => ({ title: f.q, content: f.a }))} />
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Begin your sacred journey"
        text="Seats for the coming season fill quickly. Speak to our Umrah specialist today and secure your family’s place."
      />
    </>
  )
}
