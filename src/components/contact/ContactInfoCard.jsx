import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { SITE, whatsappLink } from '../../data/site'
import Plane from '../Plane'
import { RevealGroup, RevealItem } from '../Reveal'
import { SocialLinks, WhatsAppIcon } from '../SocialIcons'

const DETAILS = [
  { icon: MapPin, label: 'Visit us', value: SITE.address },
  { icon: Phone, label: 'Call us', value: SITE.phone, href: SITE.phoneHref },
  { icon: Mail, label: 'Email us', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Clock, label: 'Office hours', value: SITE.hours },
]

export default function ContactInfoCard() {
  return (
    <aside
      aria-labelledby="contact-info-title"
      className="relative h-full overflow-hidden rounded-3xl bg-linear-to-br from-brand via-brand-dark to-brand-deep p-8 text-white shadow-lift sm:p-10"
    >
      <Plane size={220} className="pointer-events-none absolute -right-16 -bottom-10 -rotate-[25deg] text-white/5" />
      <h2 id="contact-info-title" className="text-2xl font-extrabold">
        Contact information
      </h2>
      <p className="mt-2 text-white/70">Drop by for a cup of chai and a chat about your next trip.</p>

      <RevealGroup as="ul" stagger={0.1} className="mt-8 space-y-6">
        {DETAILS.map(({ icon: Icon, label, value, href }) => (
          <RevealItem as="li" key={label} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-light">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-white/60">{label}</p>
              {href ? (
                <a href={href} className="font-semibold break-all hover:text-accent-light">
                  {value}
                </a>
              ) : (
                <p className="font-semibold">{value}</p>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-white transition hover:scale-[1.03]"
      >
        <WhatsAppIcon size={20} /> Chat on WhatsApp
      </a>
      <SocialLinks links={SITE.socials} className="mt-8" itemClassName="bg-white/10 text-white hover:bg-accent" />
    </aside>
  )
}
