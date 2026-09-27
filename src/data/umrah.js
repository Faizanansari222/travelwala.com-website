export const umrahTiers = [
  {
    id: 'economy',
    name: 'Economy',
    price: 285000,
    duration: '21 Days',
    popular: false,
    hotel: '3★ hotels',
    makkahDistance: '900 m',
    madinahDistance: '700 m',
    features: ['Return economy flights', 'Umrah visa & insurance', 'Shared AC bus transport', 'Group ziyarat in both cities', 'Quad-sharing rooms'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 365000,
    duration: '15 Days',
    popular: true,
    hotel: '4★ hotels',
    makkahDistance: '450 m',
    madinahDistance: '300 m',
    features: ['Return flights with 40 kg baggage', 'Umrah visa & insurance', 'Private AC bus transfers', 'Guided ziyarat with scholar', 'Triple-sharing rooms + breakfast'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 595000,
    duration: '14 Days',
    popular: false,
    hotel: '5★ Haram-view hotels',
    makkahDistance: '100 m',
    madinahDistance: '50 m',
    features: ['Direct flights, flexible dates', 'Fast-track visa & insurance', 'Private GMC with driver', 'Private ziyarat & Taif trip', 'Double rooms, full board'],
  },
]

// Hotel distance from the Haram (metres) for the animated bars.
export const hotelDistances = [
  { tier: 'Economy', metres: 900 },
  { tier: 'Standard', metres: 450 },
  { tier: 'Premium', metres: 100 },
]

export const umrahDetails = [
  { key: 'flights', title: 'Flights', text: 'Return flights from Karachi, Lahore and Islamabad on Saudia, PIA and other trusted carriers, with Zamzam allowance.' },
  { key: 'hotels', title: 'Hotels near Haram', text: 'Carefully inspected hotels in Makkah and Madinah — the closer the tier, the shorter your walk to prayer.' },
  { key: 'transport', title: 'Transport', text: 'Airport pickups, Makkah ⇄ Madinah intercity travel and hotel transfers in air-conditioned vehicles.' },
  { key: 'ziyarat', title: 'Ziyarat', text: 'Guided visits to Masjid Quba, Mount Uhud, Jabal al-Noor, Mina, Arafat and other historic sites.' },
  { key: 'visa', title: 'Visa', text: 'Complete Umrah visa processing, travel insurance and Nusuk registration handled by our specialists.' },
]

export const umrahSteps = [
  { title: 'Choose Your Package', text: 'Pick Economy, Standard or Premium — or ask us to tailor one for your family.' },
  { title: 'Share Documents', text: 'Send your passport, photos and CNIC on WhatsApp. We check everything for you.' },
  { title: 'Visa & Booking', text: 'We secure your visa, flights and hotels and share a detailed travel guide.' },
  { title: 'Fly & Perform Umrah', text: 'Our coordinator meets you on arrival and supports you until you are home.' },
]
