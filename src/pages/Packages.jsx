import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import PackageCard from '../components/PackageCard'
import PackageModal from '../components/PackageModal'
import FilterBar from '../components/packages/FilterBar'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import Seo from '../components/Seo'
import { IMAGES } from '../data/images'
import { PACKAGE_FILTERS, packages } from '../data/packages'

const FILTER_IDS = PACKAGE_FILTERS.map((f) => f.id)

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('category')
  const active = FILTER_IDS.includes(requested) ? requested : 'all'
  const [selected, setSelected] = useState(null)

  const visible = useMemo(
    () => (active === 'all' ? packages : packages.filter((p) => p.categories.includes(active))),
    [active],
  )

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTER_IDS.map((id) => [id, id === 'all' ? packages.length : packages.filter((p) => p.categories.includes(id)).length]),
      ),
    [],
  )

  const onFilter = (id) => {
    setSearchParams(id === 'all' ? {} : { category: id }, { replace: true, preventScrollReset: true })
  }
  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <>
      <Seo
        title="Holiday & International Tour Packages"
        description="Browse Travel Wala holiday packages — Dubai, Turkey, Malaysia, Thailand, Baku, Maldives and Pakistan’s northern valleys. Family, honeymoon and group tours."
        path="/packages"
      />
      <PageHero
        title="Holidays & international tours"
        subtitle="Hand-crafted itineraries with flights, hotels, visas and guided experiences — all in one transparent price."
        eyebrow="Tour Packages"
        crumb="Packages"
        image={IMAGES.heroPackages}
      />

      <section className="section-y" aria-labelledby="packages-title">
        <div className="wrap">
          <SectionTitle
            id="packages-title"
            eyebrow="Find Your Trip"
            title="Pick a package, pack your bags"
            subtitle="Filter by the kind of trip you’re dreaming of, then open any package for the full day-by-day plan."
          />
          <Reveal className="mb-10">
            <FilterBar filters={PACKAGE_FILTERS} active={active} onChange={onFilter} counts={counts} />
          </Reveal>

          <p className="sr-only" aria-live="polite">
            Showing {visible.length} packages
          </p>

          <LayoutGroup>
            <motion.ul layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} onOpen={setSelected} />
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </div>
      </section>

      <CtaBanner title="Can’t find the perfect trip?" text="Tell us your dates, budget and dream destination — we’ll design a custom itinerary just for you." />
      <PackageModal pkg={selected} onClose={closeModal} />
    </>
  )
}
