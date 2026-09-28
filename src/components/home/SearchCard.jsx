import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, PlaneTakeoff, Search, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { destinations } from '../../data/destinations'
import DatePicker from '../ui/DatePicker'
import DestinationCombobox from '../ui/DestinationCombobox'
import Select from '../ui/Select'
import TravellersPicker from '../ui/TravellersPicker'

const ORIGINS = [
  { value: 'KHI', badge: 'KHI', label: 'Karachi', description: 'Jinnah International Airport' },
  { value: 'LHE', badge: 'LHE', label: 'Lahore', description: 'Allama Iqbal International Airport' },
  { value: 'ISB', badge: 'ISB', label: 'Islamabad', description: 'Islamabad International Airport' },
  { value: 'PEW', badge: 'PEW', label: 'Peshawar', description: 'Bacha Khan International Airport' },
  { value: 'MUX', badge: 'MUX', label: 'Multan', description: 'Multan International Airport' },
]

export default function SearchCard() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    from: 'KHI',
    to: '',
    date: '',
    travellers: { adults: 2, children: 0, infants: 0, cabin: 'Economy' },
  })
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const onSubmit = (event) => {
    event.preventDefault()
    navigate('/packages')
  }

  return (
    <motion.form
      role="search"
      aria-label="Search trips"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 grid gap-3 rounded-2xl bg-white p-3 shadow-lift md:mt-14 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1fr_1.1fr_auto] lg:p-4"
    >
      <Select id="search-from" label="From" icon={PlaneTakeoff} options={ORIGINS} value={form.from} onChange={set('from')} />
      <DestinationCombobox id="search-to" label="To" icon={MapPin} options={destinations} value={form.to} onChange={set('to')} />
      <DatePicker id="search-date" label="Departure" icon={CalendarDays} value={form.date} onChange={set('date')} />
      <TravellersPicker id="search-travellers" label="Travellers" icon={Users} value={form.travellers} onChange={set('travellers')} />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 font-bold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-[#e67e17] md:col-span-2 lg:col-span-1"
      >
        <Search size={20} aria-hidden="true" /> Search
      </motion.button>
    </motion.form>
  )
}
