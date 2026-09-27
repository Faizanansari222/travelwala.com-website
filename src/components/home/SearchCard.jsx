import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, PlaneTakeoff, Search, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { destinations } from '../../data/destinations'

const ORIGINS = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Multan']

function Field({ id, label, icon: Icon, children }) {
  return (
    <div className="group relative rounded-xl bg-surface px-4 pt-2.5 pb-2 ring-1 ring-brand/10 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-accent">
      <label htmlFor={id} className="flex items-center gap-1.5 text-[0.7rem] font-bold tracking-wider text-ink/55 uppercase">
        <Icon size={13} className="text-brand" aria-hidden="true" /> {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'mt-0.5 w-full bg-transparent text-[0.95rem] font-semibold text-ink focus:outline-none'

export default function SearchCard() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({ from: 'Karachi', to: '', date: '', travellers: '2' })
  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

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
      className="mt-12 grid gap-3 rounded-2xl bg-white/95 p-3 shadow-lift backdrop-blur md:mt-14 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.8fr_auto] lg:p-4"
    >
      <Field id="search-from" label="From" icon={PlaneTakeoff}>
        <select id="search-from" value={form.from} onChange={update('from')} className={inputClass}>
          {ORIGINS.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </Field>
      <Field id="search-to" label="To" icon={MapPin}>
        <input
          id="search-to"
          list="search-destinations"
          value={form.to}
          onChange={update('to')}
          placeholder="Where to?"
          className={`${inputClass} placeholder:font-medium placeholder:text-ink/40`}
        />
        <datalist id="search-destinations">
          {destinations.map((d) => (
            <option key={d.id} value={d.name} />
          ))}
        </datalist>
      </Field>
      <Field id="search-date" label="Date" icon={CalendarDays}>
        <input id="search-date" type="date" min={today} value={form.date} onChange={update('date')} className={inputClass} />
      </Field>
      <Field id="search-travellers" label="Travellers" icon={Users}>
        <select id="search-travellers" value={form.travellers} onChange={update('travellers')} className={inputClass}>
          {Array.from({ length: 9 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'Adult' : 'Adults'}
            </option>
          ))}
        </select>
      </Field>
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
