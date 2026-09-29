import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { BedDouble, Bus, BusFront, CalendarDays, FileDown, Footprints, Loader2, MapPin, SlidersHorizontal, Info, MapPinned, Minus, Moon, PlaneLanding, PlaneTakeoff, Plus, Users, Utensils } from 'lucide-react'
import { formatPrice, whatsappLink } from '../../data/site'
import {
  ACCESS_FILTERS,
  COMMISSION,
  HOTEL_TIERS,
  MEALS,
  NIGHT_LIMITS,
  RATE_SOURCES,
  ROOM_TYPES,
  SAR_TO_PKR,
  TRANSPORT,
  UMRAH_ARRIVALS,
  UMRAH_ORIGINS,
  ZIYARAT,
} from '../../data/umrahCalculator'
import { formatShort, fromISODate } from '../../lib/date'
import { hotelMapUrl } from '../../lib/hotelSheet'
import { bestRate, priceUmrahTrip, tripItinerary } from '../../lib/umrahPrice'
import { cn } from '../../lib/utils'
import { Reveal } from '../Reveal'
import SectionTitle from '../SectionTitle'
import DatePicker from '../ui/DatePicker'
import Select from '../ui/Select'
import TravellersPicker, { travellersSummary } from '../ui/TravellersPicker'
import { UMRAH_CALCULATOR_ID, useUmrahTrip } from './UmrahTripContext'

/** Radio group styled as pill buttons. options: [{ id, label, hint? }] */
function Segmented({ name, legend, options, value, onChange, columns = 3 }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-bold tracking-wider text-ink/55 uppercase">{legend}</legend>
      <div className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {options.map((option) => (
          <label key={option.id} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="peer sr-only"
            />
            <span className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-brand/15 px-2 py-2 text-center text-sm font-semibold text-ink/75 transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-brand/40">
              {option.label}
              {option.hint && <span className="mt-0.5 text-[0.7rem] font-medium opacity-70">{option.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function NightsStepper({ id, city, value, min, max, onChange }) {
  const button =
    'grid h-9 w-9 place-items-center rounded-full border-2 border-brand/20 text-brand transition hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/25 disabled:hover:bg-transparent'
  return (
    <div className="flex items-center justify-between gap-4">
      <p id={id} className="flex items-center gap-2 font-bold text-ink">
        <Moon size={17} className="text-brand" aria-hidden="true" />
        Nights in {city}
      </p>
      <div className="flex items-center gap-3" role="group" aria-labelledby={id}>
        <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Fewer nights in ${city}`} className={button}>
          <Minus size={16} aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-6 text-center text-lg font-bold text-ink tabular-nums">
          {value}
        </output>
        <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`More nights in ${city}`} className={button}>
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

const TIER_FILTERS = [{ id: 'all', label: 'All' }, ...HOTEL_TIERS]
const tierLabel = (id) => HOTEL_TIERS.find((t) => t.id === id)?.label

const formatMetres = (metres) => `${metres.toLocaleString('en-US')} m`
const formatSAR = (value) => `SAR ${Math.round(value).toLocaleString('en-US')}`
/** Hotel rates are stored in SAR; customers see PKR first. */
const sarToPkr = (sar) => formatPrice(Math.round(sar * SAR_TO_PKR))

function HotelOption({ name, city, hotel, checked, onChange }) {
  const best = bestRate(hotel)
  return (
    <li>
      <label className="block cursor-pointer">
        <input type="radio" name={name} value={hotel.id} checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="block rounded-xl border-2 border-brand/10 bg-white p-3.5 transition peer-checked:border-brand peer-checked:bg-brand/[0.04] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-brand/35">
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-bold text-ink">{hotel.name}</span>
              <a
                href={hotelMapUrl(hotel, city)}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-light underline-offset-2 hover:underline"
              >
                <MapPin size={12} aria-hidden="true" /> View on Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink/60">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-bold text-brand">{tierLabel(hotel.tier)}</span>
                <span className="font-bold text-gold" aria-label={`${hotel.stars} star`}>
                  {'★'.repeat(hotel.stars)}
                </span>
                {hotel.shuttle ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-accent">
                    <BusFront size={12} aria-hidden="true" /> Shuttle service · {formatMetres(hotel.distance)} from Haram
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-light/10 px-2 py-0.5 font-semibold text-brand-light">
                    <Footprints size={12} aria-hidden="true" /> Walking distance · {formatMetres(hotel.distance)} to Haram
                  </span>
                )}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-extrabold text-brand tabular-nums">{sarToPkr(best.price)}</span>
              <span className="block text-[0.7rem] font-semibold text-ink/55 tabular-nums">{formatSAR(best.price)} / night</span>
              <span className="block text-[0.7rem] text-ink/45">best on {best.source.label}</span>
            </span>
          </span>
          <span className="mt-2.5 flex flex-wrap gap-1.5">
            {RATE_SOURCES.map((source) => {
              const price = hotel.rates[source.id]
              const isBest = source.id === best.source.id
              return (
                <span
                  key={source.id}
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[0.7rem] tabular-nums',
                    price == null ? 'bg-ink/5 text-ink/35' : isBest ? 'bg-brand-light/15 font-bold text-brand-light' : 'bg-surface text-ink/60',
                  )}
                >
                  {source.label}: {price == null ? (
                    'not listed'
                  ) : (
                    <>
                      {sarToPkr(price)} <span className="font-normal opacity-75">({formatSAR(price)})</span>
                    </>
                  )}
                </span>
              )
            })}
          </span>
        </span>
      </label>
    </li>
  )
}

function HotelPicker({ cityKey, city, list, value, onChange }) {
  const [tier, setTier] = useState('all')
  const [access, setAccess] = useState('all')
  const selected = list.find((h) => h.id === value) ?? list[0]
  // Picking a package level also selects that level's cheapest hotel in this city,
  // unless the current hotel already belongs to it.
  const chooseTier = (id) => {
    setTier(id)
    if (id === 'all' || selected.tier === id) return
    const cheapest = list.filter((h) => h.tier === id).sort((a, b) => bestRate(a).price - bestRate(b).price)[0]
    if (cheapest) onChange(cheapest.id)
  }
  const hotels = list.filter(
    (h) =>
      (tier === 'all' || h.tier === tier) &&
      (access === 'all' || (access === 'shuttle' ? h.shuttle : !h.shuttle)),
  )
  // Keep the chosen hotel visible even when the filter would hide it.
  const shown = hotels.some((h) => h.id === selected.id) ? hotels : [selected, ...hotels]

  return (
    <fieldset>
      <legend className="mb-2 text-xs font-bold tracking-wider text-ink/55 uppercase">{city} hotel</legend>
      <div className="mb-3 space-y-2.5 rounded-2xl bg-white p-3 ring-1 ring-brand/10">
        <p className="flex items-center gap-1.5 text-sm font-bold text-brand">
          <SlidersHorizontal size={15} aria-hidden="true" /> {city} hotels filter
        </p>
        <FilterGroup label="Package" name={`${city} package`} options={TIER_FILTERS} value={tier} onChange={chooseTier} />
        <FilterGroup
          label="Access"
          name={`${city} access`}
          options={ACCESS_FILTERS}
          value={access}
          onChange={setAccess}
          icons={{ walking: Footprints, shuttle: BusFront }}
        />
      </div>
      {hotels.length === 0 && (
        <p className="mb-2 text-xs text-ink/55">No hotels match these filters — your current choice is shown below.</p>
      )}
      <ul data-lenis-prevent className="max-h-[25rem] space-y-2 overflow-y-auto pr-1">
        {shown.map((hotel) => (
          <HotelOption
            key={hotel.id}
            name={`calc-${cityKey}-hotel`}
            city={city}
            hotel={hotel}
            checked={hotel.id === selected.id}
            onChange={() => onChange(hotel.id)}
          />
        ))}
      </ul>
    </fieldset>
  )
}

function FilterGroup({ label, name, options, value, onChange, icons = {} }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-xs font-bold tracking-wider text-ink/55 uppercase">{label}</span>
      <div className="inline-flex flex-wrap gap-1 rounded-full bg-surface p-1 ring-1 ring-brand/15" role="group" aria-label={name ?? label}>
        {options.map((option) => {
          const Icon = icons[option.id]
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={value === option.id}
              onClick={() => onChange(option.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
                value === option.id ? 'bg-brand text-white shadow-sm' : 'text-ink/65 hover:text-brand',
              )}
            >
              {Icon && <Icon size={14} aria-hidden="true" />}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CityCard({ city, nights, hotel, hotels, loading, limits, onNights, onHotel }) {
  const key = city.toLowerCase()
  return (
    <div className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-brand/10">
      <NightsStepper id={`calc-${key}-nights`} city={city} value={nights} min={limits.min} max={limits.max} onChange={onNights} />
      {nights > 0 &&
        (loading ? (
          <p className="flex items-center gap-2 py-6 text-sm font-medium text-ink/60">
            <Loader2 size={16} className="animate-spin text-brand" aria-hidden="true" /> Loading latest {city} hotel rates…
          </p>
        ) : (
          <HotelPicker cityKey={key} city={city} list={hotels[key]} value={hotel} onChange={onHotel} />
        ))}
    </div>
  )
}

/** Tweens the displayed total instead of jumping when options change. */
function AnimatedPrice({ value, className }) {
  const ref = useRef(null)
  const previous = useRef(value)
  const reduce = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduce) {
      node.textContent = formatPrice(value)
      previous.current = value
      return
    }
    const controls = animate(previous.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => (node.textContent = formatPrice(Math.round(latest))),
    })
    previous.current = value
    return () => controls.stop()
  }, [value, reduce])

  return (
    <span ref={ref} className={className}>
      {formatPrice(value)}
    </span>
  )
}

function Summary({ trip, quote, hotels, loading }) {
  const { origin, arrival, stops: visited, homeAirport } = tripItinerary(trip, hotels)
  const departure = fromISODate(trip.date)
  const [pdfState, setPdfState] = useState('idle')

  // jsPDF is loaded only when someone asks for a PDF.
  const downloadPdf = async () => {
    setPdfState('busy')
    try {
      const { downloadUmrahQuotePdf } = await import('../../lib/umrahQuotePdf')
      downloadUmrahQuotePdf(trip, quote, hotels)
      setPdfState('idle')
    } catch (error) {
      console.error(error)
      setPdfState('error')
    }
  }

  const message = [
    'Assalam o Alaikum! I would like to book a custom Umrah package:',
    `• ${origin.label} → ${arrival.label}${departure ? `, departing ${formatShort(departure)}` : ''}`,
    `• ${travellersSummary(trip.travellers)} (${trip.travellers.adults} adults, ${trip.travellers.children} children, ${trip.travellers.infants} infants), ${trip.travellers.cabin}`,
    ...visited.map((s) => `• ${s.city}: ${s.nights} nights at ${s.hotel.name} (${s.hotel.stars}★)`),
    `• ${ROOM_TYPES.find((r) => r.id === trip.room).label} room, ${TRANSPORT.find((t) => t.id === trip.transport).label}, ${ZIYARAT.find((z) => z.id === trip.ziyarat).label}, ${MEALS.find((m) => m.id === trip.meals).label}`,
    `Estimated total: ${formatPrice(quote.total)}`,
  ].join('\n')

  return (
    <div className="rounded-3xl bg-brand-deep p-6 text-white shadow-lift md:p-8">
      <p className="text-xs font-bold tracking-[0.2em] text-accent-light uppercase">Estimated package</p>
      <p className="mt-3" aria-live="polite">
        {loading ? (
          <span className="flex items-center gap-2 py-2 text-lg font-bold text-white/70">
            <Loader2 size={20} className="animate-spin" aria-hidden="true" /> Loading latest rates…
          </span>
        ) : (
          <AnimatedPrice value={quote.total} className="text-4xl font-extrabold text-gold-light tabular-nums md:text-[2.6rem]" />
        )}
      </p>
      <p className="text-sm font-semibold text-white/60 tabular-nums">≈ {formatSAR(quote.total / SAR_TO_PKR)}</p>
      <p className="mt-1 text-sm text-white/65">
        ≈ {formatPrice(quote.perTraveller)} per traveller · {quote.nights} nights · {quote.rooms} {quote.rooms === 1 ? 'room' : 'rooms'}
      </p>

      {quote.peak && (
        <p className="mt-4 flex gap-2 rounded-xl bg-accent/15 px-3 py-2 text-xs font-medium text-accent-light">
          <Info size={15} className="mt-px shrink-0" aria-hidden="true" />
          Departure falls in {quote.peak.label} — peak-season rates applied.
        </p>
      )}

      <ol className="mt-6 space-y-3 border-l-2 border-dashed border-white/20 pl-5 text-sm">
        <li className="relative">
          <span className="absolute top-1 -left-[1.66rem] h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
          <span className="flex items-center gap-1.5 font-semibold">
            <PlaneTakeoff size={15} aria-hidden="true" /> {origin.label} → {arrival.label}
          </span>
          <span className="text-white/60">{departure ? formatShort(departure) : 'Pick a departure date'}</span>
        </li>
        {visited.map((stop) => (
          <li key={stop.city} className="relative">
            <span className="absolute top-1 -left-[1.66rem] h-3 w-3 rounded-full bg-gold" aria-hidden="true" />
            <span className="font-semibold">{stop.city}</span>
            <span className="text-white/60"> · {stop.nights} nights</span>
            <span className="block text-white/60">
              {stop.hotel.name} · {stop.hotel.shuttle ? 'Shuttle service' : 'Walking distance'} · {formatMetres(stop.hotel.distance)}
            </span>
            <a
              href={hotelMapUrl(stop.hotel, stop.city)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-light underline-offset-2 hover:underline"
            >
              <MapPin size={12} aria-hidden="true" /> Map
              <span className="sr-only"> of {stop.hotel.name} (opens in a new tab)</span>
            </a>
          </li>
        ))}
        <li className="relative">
          <span className="absolute top-1 -left-[1.66rem] h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
          <span className="flex items-center gap-1.5 font-semibold">
            <PlaneLanding size={15} aria-hidden="true" /> {homeAirport} → {origin.label}
          </span>
          <span className="text-white/60">{quote.returnDate ? formatShort(quote.returnDate) : `${quote.nights} nights later`}</span>
        </li>
      </ol>

      <dl className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm">
        {quote.lines.map((line) => (
          <div key={line.id} className="flex justify-between gap-4">
            <dt className="text-white/70">{line.label}</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(line.amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5">
          <dt className="text-white/70">Subtotal</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(quote.subtotal)}</dd>
        </div>
        {COMMISSION.showInBreakdown && (
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">
              {COMMISSION.label} ({Math.round(COMMISSION.rate * 100)}%)
            </dt>
            <dd className="font-semibold tabular-nums">{formatPrice(quote.commission)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5 text-base">
          <dt className="font-bold">Total</dt>
          <dd className="font-extrabold text-gold-light tabular-nums">{formatPrice(quote.total)}</dd>
        </div>
      </dl>

      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 font-bold text-brand-deep transition hover:scale-[1.02] hover:bg-gold-light"
      >
        Get exact quote on WhatsApp
      </a>
      <button
        type="button"
        onClick={downloadPdf}
        disabled={pdfState === 'busy' || loading}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold text-white ring-2 ring-white/30 transition hover:bg-white/10 hover:ring-white/60 disabled:cursor-wait disabled:opacity-70"
      >
        {pdfState === 'busy' ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <FileDown size={18} aria-hidden="true" />}
        {pdfState === 'busy' ? 'Preparing PDF…' : 'Download PDF quote'}
      </button>
      {pdfState === 'error' && (
        <p role="alert" className="mt-2 text-center text-xs font-medium text-accent-light">
          Couldn’t create the PDF. Please try again or ask us on WhatsApp.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-white/50">This is a tentative rate. Final price depends on availability on your dates.</p>
    </div>
  )
}

export default function UmrahCalculator() {
  const { trip, set, hotels, ratesStatus } = useUmrahTrip()
  const loading = ratesStatus === 'loading'
  const quote = priceUmrahTrip(trip, hotels)

  const cities = [
    <CityCard
      hotels={hotels}
      loading={loading}
      key="makkah"
      city="Makkah"
      nights={trip.makkahNights}
      hotel={trip.makkahHotel}
      limits={NIGHT_LIMITS.makkah}
      onNights={set('makkahNights')}
      onHotel={set('makkahHotel')}
    />,
    <CityCard
      hotels={hotels}
      loading={loading}
      key="madinah"
      city="Madinah"
      nights={trip.madinahNights}
      hotel={trip.madinahHotel}
      limits={NIGHT_LIMITS.madinah}
      onNights={set('madinahNights')}
      onHotel={set('madinahHotel')}
    />,
  ]
  if (trip.to === 'MED') cities.reverse()

  return (
    <section id={UMRAH_CALCULATOR_ID} aria-labelledby="umrah-calc-title" className="section-y scroll-mt-20">
      <div className="wrap">
        <SectionTitle
          id="umrah-calc-title"
          eyebrow="Umrah Calculator"
          title="Customize your Umrah package"
          subtitle="Start with where you fly from, when, and who is travelling — then pick hotels, nights and extras. The price updates as you go."
        />

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
          <Reveal className="space-y-6 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-brand/10 md:p-8">
            <div>
              <h3 className="mb-3 text-lg font-bold text-ink">1. Your trip</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select id="calc-from" label="From" icon={PlaneTakeoff} options={UMRAH_ORIGINS} value={trip.from} onChange={set('from')} />
                <Select id="calc-to" label="To" icon={PlaneLanding} options={UMRAH_ARRIVALS} value={trip.to} onChange={set('to')} />
                <DatePicker id="calc-date" label="Departure" icon={CalendarDays} value={trip.date} onChange={set('date')} />
                <TravellersPicker id="calc-travellers" label="Travellers" icon={Users} value={trip.travellers} onChange={set('travellers')} />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-ink">2. Stay</h3>
              <div className="grid gap-4">{cities}</div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-ink">3. Extras</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex gap-3">
                  <BedDouble size={20} className="mt-6 shrink-0 text-brand" aria-hidden="true" />
                  <div className="flex-1">
                    <Segmented
                      name="calc-room"
                      legend="Room sharing"
                      options={ROOM_TYPES.map((r) => ({ ...r, hint: `${r.capacity} per room` }))}
                      value={trip.room}
                      onChange={set('room')}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Bus size={20} className="mt-6 shrink-0 text-brand" aria-hidden="true" />
                  <div className="flex-1">
                    <Segmented name="calc-transport" legend="Transport" options={TRANSPORT} value={trip.transport} onChange={set('transport')} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPinned size={20} className="mt-6 shrink-0 text-brand" aria-hidden="true" />
                  <div className="flex-1">
                    <Segmented name="calc-ziyarat" legend="Ziyarat" options={ZIYARAT} value={trip.ziyarat} onChange={set('ziyarat')} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Utensils size={20} className="mt-6 shrink-0 text-brand" aria-hidden="true" />
                  <div className="flex-1">
                    <Segmented name="calc-meals" legend="Meals" options={MEALS} value={trip.meals} onChange={set('meals')} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:sticky lg:top-24">
            <Summary trip={trip} quote={quote} hotels={hotels} loading={loading} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
