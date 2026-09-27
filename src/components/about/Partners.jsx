import { BadgeCheck } from 'lucide-react'
import { partners } from '../../data/about'
import { Reveal } from '../Reveal'

/** Infinite, pause-on-hover marquee of partner and certification names. */
export default function Partners() {
  const row = [...partners, ...partners]
  return (
    <section className="pb-20 md:pb-28" aria-labelledby="partners-title">
      <Reveal className="wrap">
        <h2 id="partners-title" className="mb-8 text-center text-sm font-bold tracking-[0.25em] text-ink/50 uppercase">
          Certified, licensed & trusted by our partners
        </h2>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {row.map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= partners.length}
                className="flex items-center gap-2.5 rounded-2xl bg-white px-6 py-4 font-bold whitespace-nowrap text-ink/70 shadow-soft transition hover:text-brand"
              >
                <BadgeCheck size={22} className="text-brand-light" aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
