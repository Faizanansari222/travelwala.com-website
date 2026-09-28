import ContactForm from '../components/contact/ContactForm'
import ContactInfoCard from '../components/contact/ContactInfoCard'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import Seo from '../components/Seo'
import { IMAGES } from '../data/images'
import { SITE } from '../data/site'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description={`Plan your next trip with Travel Wala. Call ${SITE.phone}, email ${SITE.email} or visit us at ${SITE.address}.`}
        path="/contact"
      />
      <PageHero
        title="Let’s plan your next journey"
        subtitle="Questions, quotes or just travel dreaming our team replies within hours, and on WhatsApp even faster."
        eyebrow="Contact Us"
        crumb="Contact"
        image={IMAGES.heroContact}
      />

      <section className="section-y">
        <div className="wrap grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>
          <Reveal className="lg:col-span-2" delay={0.15}>
            <ContactInfoCard />
          </Reveal>
        </div>

        <Reveal className="wrap mt-10">
          <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-brand/10">
            <iframe
              title="Map showing the Travel Wala office in Karachi"
              src={SITE.mapEmbed}
              className="block h-[380px] w-full md:h-[440px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>
    </>
  )
}
