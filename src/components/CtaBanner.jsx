import { IMAGES } from '../data/images'
import { whatsappLink } from '../data/site'
import BookNowButton from './BookNowButton'
import PathFlight from './PathFlight'
import { Reveal } from './Reveal'
import SmartImage from './SmartImage'
import { WhatsAppIcon } from './SocialIcons'

const CTA_ROUTE = 'M-60 250 C 180 250, 300 60, 600 110 S 1000 40, 1260 20'

export default function CtaBanner({
  title = 'Ready for your next journey?',
  text = 'Tell us where your heart wants to go we will handle the flights, hotels, visas and every little detail in between.',
}) {
  return (
    <section className="wrap pb-20 md:pb-28" aria-labelledby="cta-title">
      <Reveal className="relative isolate overflow-hidden rounded-3xl bg-brand-dark px-6 py-14 text-center shadow-lift sm:px-10 md:py-20">
        <SmartImage src={IMAGES.ctaBanner} alt="" className="absolute inset-0 -z-20 h-full w-full" imgClassName="opacity-35" />
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/95 via-brand-dark/90 to-brand-light/80" />
        <PathFlight
          d={CTA_ROUTE}
          viewBox="0 0 1200 300"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          duration={4.5}
          repeatDelay={2.5}
          planeSize={44}
          trailColor="rgba(255,181,71,0.8)"
          planeColor="#ffffff"
        />

        <p className="text-xs font-bold tracking-[0.25em] text-accent-light uppercase">Let’s go somewhere</p>
        <h2 id="cta-title" className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold text-white md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80 md:text-lg">{text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BookNowButton size="lg">Plan My Trip</BookNowButton>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:scale-[1.03] hover:bg-white/10"
          >
            <WhatsAppIcon size={20} /> Chat on WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  )
}
