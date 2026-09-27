import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { destinations } from '../../data/destinations'
import DestinationCard from '../DestinationCard'
import { Reveal, RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

export default function Destinations() {
  return (
    <section className="section-y" aria-labelledby="destinations-title">
      <div className="wrap">
        <SectionTitle
          id="destinations-title"
          eyebrow="Popular Destinations"
          title="Where will your passport take you next?"
          subtitle="Our most-loved getaways this season — each one hand-tested by our team and ready to book."
        />
        <RevealGroup as="ul" stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <RevealItem as="li" key={destination.id}>
              <DestinationCard destination={destination} />
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12 text-center">
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:scale-[1.03] hover:bg-brand hover:text-white"
          >
            View all packages
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
