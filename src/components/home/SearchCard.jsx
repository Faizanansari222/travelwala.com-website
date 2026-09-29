import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, CalendarDays, MapPin, Palmtree, PlaneLanding, PlaneTakeoff, Search, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { destinations } from '../../data/destinations'
import { UMRAH_ARRIVALS, UMRAH_ORIGINS } from '../../data/umrahCalculator'
import { useLenis } from '../../hooks/useLenis'
import { cn } from '../../lib/utils'
import DatePicker from '../ui/DatePicker'
import DestinationCombobox from '../ui/DestinationCombobox'
import Select from '../ui/Select'
import TravellersPicker from '../ui/TravellersPicker'
import { UMRAH_CALCULATOR_ID, useUmrahTrip } from './UmrahTripContext'

const MODES = [
  { id: 'holidays', label: 'Holidays', icon: Palmtree },
  { id: 'umrah', label: 'Umrah Calculator', icon: Calculator },
]

export default function SearchCard() {
  const navigate = useNavigate()
  const lenis = useLenis()
  const { trip, set: setTrip } = useUmrahTrip()
  const [mode, setMode] = useState('holidays')
  const [form, setForm] = useState({
    from: 'KHI',
    to: '',
    date: '',
    travellers: { adults: 2, children: 0, infants: 0, cabin: 'Economy' },
  })
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const umrah = mode === 'umrah'

  const onSubmit = (event) => {
    event.preventDefault()
    if (!umrah) {
      navigate('/packages')
      return
    }
    const target = document.getElementById(UMRAH_CALCULATOR_ID)
    if (!target) return
    if (lenis) lenis.scrollTo(target, { offset: -80 })
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 md:mt-14"
    >
      <div role="tablist" aria-label="Search type" className="mb-3 inline-flex gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/20">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`search-tab-${id}`}
            aria-selected={mode === id}
            aria-controls="search-panel"
            onClick={() => setMode(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
              mode === id ? 'bg-white text-brand shadow-md' : 'text-white/85 hover:bg-white/10',
            )}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <form
        id="search-panel"
        role="search"
        aria-labelledby={`search-tab-${mode}`}
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl bg-white p-3 shadow-lift md:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1fr_1.1fr_auto] lg:p-4"
      >
        {umrah ? (
          <>
            <Select id="umrah-from" label="From" icon={PlaneTakeoff} options={UMRAH_ORIGINS} value={trip.from} onChange={setTrip('from')} />
            <Select id="umrah-to" label="To" icon={PlaneLanding} options={UMRAH_ARRIVALS} value={trip.to} onChange={setTrip('to')} />
            <DatePicker id="umrah-date" label="Departure" icon={CalendarDays} value={trip.date} onChange={setTrip('date')} />
            <TravellersPicker id="umrah-travellers" label="Travellers" icon={Users} value={trip.travellers} onChange={setTrip('travellers')} />
          </>
        ) : (
          <>
            <Select id="search-from" label="From" icon={PlaneTakeoff} options={UMRAH_ORIGINS} value={form.from} onChange={set('from')} />
            <DestinationCombobox id="search-to" label="To" icon={MapPin} options={destinations} value={form.to} onChange={set('to')} />
            <DatePicker id="search-date" label="Departure" icon={CalendarDays} value={form.date} onChange={set('date')} />
            <TravellersPicker id="search-travellers" label="Travellers" icon={Users} value={form.travellers} onChange={set('travellers')} />
          </>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 font-bold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-[#e67e17] md:col-span-2 lg:col-span-1"
        >
          {umrah ? <Calculator size={20} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
          {umrah ? 'Calculate' : 'Search'}
        </motion.button>
      </form>
    </motion.div>
  )
}
