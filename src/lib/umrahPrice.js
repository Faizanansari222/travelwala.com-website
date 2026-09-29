import {
  CABIN_MULTIPLIER,
  CHILD_FARE,
  COMMISSION,
  FLIGHT_FARES,
  INFANT_FARE,
  MEALS,
  PEAK_PERIODS,
  RATE_SOURCES,
  ROOM_TYPES,
  SAR_TO_PKR,
  TRANSPORT,
  UMRAH_ARRIVALS,
  UMRAH_ORIGINS,
  VISA_PER_PERSON,
  ZIYARAT,
} from '../data/umrahCalculator'
import { addDays, fromISODate } from './date'

const byId = (list, id) => list.find((item) => item.id === id) ?? list[0]

/** hotels: { makkah: [...], madinah: [...] } from the Google Sheet or the bundled HOTELS. */
export const findHotel = (hotels, city, id) => byId(hotels[city], id)

/** Cheapest listed rate for a hotel (SAR), with the site it came from. */
export function bestRate(hotel) {
  let best = null
  for (const source of RATE_SOURCES) {
    const price = hotel.rates[source.id]
    if (price != null && (!best || price < best.price)) best = { price, source }
  }
  return best
}

/**
 * The trip's route: where it starts, the cities in visiting order (by arrival airport)
 * with their hotels, and the airport the travellers fly home from.
 */
export function tripItinerary(trip, hotels) {
  const stops = [
    { city: 'Makkah', nights: trip.makkahNights, hotel: findHotel(hotels, 'makkah', trip.makkahHotel) },
    { city: 'Madinah', nights: trip.madinahNights, hotel: findHotel(hotels, 'madinah', trip.madinahHotel) },
  ]
  if (trip.to === 'MED') stops.reverse()
  const visited = stops.filter((s) => s.nights > 0)
  return {
    origin: UMRAH_ORIGINS.find((o) => o.value === trip.from),
    arrival: UMRAH_ARRIVALS.find((a) => a.value === trip.to),
    stops: visited,
    // Fly home from whichever city the trip ends in.
    homeAirport: visited.at(-1)?.city === 'Madinah' ? 'Madinah' : 'Jeddah',
  }
}

/** Whole-trip cost of an option priced either per person or per vehicle. */
const perHeadOrVehicle = (option, seats) =>
  option.perVehicle ? Math.ceil(seats / option.capacity) * option.perVehicle : (option.perPerson ?? 0) * seats

/** ISO dates compare correctly as strings. */
export const peakPeriodFor = (isoDate) =>
  (isoDate && PEAK_PERIODS.find((p) => isoDate >= p.from && isoDate <= p.to)) || null

/**
 * Prices a custom Umrah trip. Children take a bed and a seat; infants share with an adult,
 * so they only pay a reduced fare and the visa. Commission is added on the subtotal.
 */
export function priceUmrahTrip(trip, hotels) {
  const { adults, children, infants, cabin } = trip.travellers
  const seats = adults + children
  const travellers = seats + infants
  const peak = peakPeriodFor(trip.date)
  const season = peak?.factor ?? 1
  const nights = trip.makkahNights + trip.madinahNights

  const adultFare = Math.round((FLIGHT_FARES[trip.from]?.[trip.to] ?? 0) * (CABIN_MULTIPLIER[cabin] ?? 1) * season)
  const flights = Math.round(adultFare * (adults + children * CHILD_FARE + infants * INFANT_FARE))

  const room = byId(ROOM_TYPES, trip.room)
  const rooms = Math.ceil(seats / room.capacity)
  const hotelLine = (city, label, hotelId, n) => {
    const hotel = findHotel(hotels, city, hotelId)
    return {
      id: city,
      label: `${label} · ${hotel.name} · ${n} nights`,
      amount: Math.round(rooms * bestRate(hotel).price * SAR_TO_PKR * room.factor * n * season),
    }
  }

  const transport = byId(TRANSPORT, trip.transport)
  const ziyarat = byId(ZIYARAT, trip.ziyarat)
  const meals = byId(MEALS, trip.meals)

  const lines = [
    { id: 'flights', label: `Return flights · ${cabin}`, amount: flights },
    { id: 'visa', label: 'Visa, insurance & Nusuk', amount: VISA_PER_PERSON * travellers },
    hotelLine('makkah', 'Makkah', trip.makkahHotel, trip.makkahNights),
    hotelLine('madinah', 'Madinah', trip.madinahHotel, trip.madinahNights),
    { id: 'transport', label: transport.label, amount: perHeadOrVehicle(transport, seats) },
    { id: 'ziyarat', label: ziyarat.label, amount: perHeadOrVehicle(ziyarat, seats) },
    { id: 'meals', label: `Meals · ${meals.label}`, amount: meals.perNight * seats * nights },
  ].filter((line) => line.amount > 0)

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)
  const commission = Math.round(subtotal * COMMISSION.rate)
  const total = subtotal + commission
  const departure = fromISODate(trip.date)

  return {
    lines,
    subtotal,
    commission,
    total,
    perTraveller: Math.round(total / travellers),
    travellers,
    rooms,
    nights,
    peak,
    returnDate: departure ? addDays(departure, nights) : null,
  }
}
