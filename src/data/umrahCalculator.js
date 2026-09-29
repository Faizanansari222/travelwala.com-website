// Rates for the home-page Umrah package calculator (all PKR).
// ⚠ Every price in this file is a PLACEHOLDER, not a real quote — replace with your supplier/GDS
// fares and current hotel rates before going live. The calculator reads everything from here.

export const UMRAH_ORIGINS = [
  { value: 'KHI', badge: 'KHI', label: 'Karachi', description: 'Jinnah International Airport' },
  { value: 'LHE', badge: 'LHE', label: 'Lahore', description: 'Allama Iqbal International Airport' },
  { value: 'ISB', badge: 'ISB', label: 'Islamabad', description: 'Islamabad International Airport' },
  { value: 'PEW', badge: 'PEW', label: 'Peshawar', description: 'Bacha Khan International Airport' },
  { value: 'MUX', badge: 'MUX', label: 'Multan', description: 'Multan International Airport' },
]

export const UMRAH_ARRIVALS = [
  { value: 'JED', badge: 'JED', label: 'Jeddah', description: 'Makkah first, then Madinah' },
  { value: 'MED', badge: 'MED', label: 'Madinah', description: 'Madinah first, then Makkah' },
]

/** Return economy fare per adult, by origin → arrival airport. */
export const FLIGHT_FARES = {
  KHI: { JED: 165000, MED: 172000 },
  LHE: { JED: 175000, MED: 182000 },
  ISB: { JED: 180000, MED: 186000 },
  PEW: { JED: 185000, MED: 192000 },
  MUX: { JED: 178000, MED: 185000 },
}

export const CABIN_MULTIPLIER = { Economy: 1, 'Premium Economy': 1.5, Business: 2.6, First: 4 }

/** Share of the adult fare charged for children (2–11) and lap infants (under 2). */
export const CHILD_FARE = 0.75
export const INFANT_FARE = 0.15

/** Umrah visa, insurance and Nusuk registration, per traveller (infants included). */
export const VISA_PER_PERSON = 62000

/** Exchange rate used to turn SAR hotel rates into the PKR package total. Keep it current. */
export const SAR_TO_PKR = 75

/** Hotel access filter: walk to the Haram, or ride the hotel shuttle. */
export const ACCESS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'walking', label: 'Walking distance' },
  { id: 'shuttle', label: 'Shuttle service' },
]

/** Package levels used to group and filter hotels. */
export const HOTEL_TIERS = [
  { id: 'economy', label: 'Economy' },
  { id: 'standard', label: 'Standard' },
  { id: 'premium', label: 'Premium' },
]

/** Booking sites whose prices are compared for every hotel. */
export const RATE_SOURCES = [
  { id: 'booking', label: 'Booking.com' },
  { id: 'agoda', label: 'Agoda' },
  { id: 'expedia', label: 'Expedia' },
]

/*
 * Hotels offered in the calculator.
 * rates: SAR per double room, per night, as listed on each site (null = not listed there).
 *        The calculator uses the lowest listed rate.
 * tier: which package level the hotel belongs to (see HOTEL_TIERS).
 * distance: walking distance to the Haram in metres. shuttle: hotel runs a shuttle to the Haram.
 *
 * ⚠ SAMPLE DATA — the rates below are placeholders, and star ratings, distances and shuttle
 * details must be checked against each hotel before publishing. Refresh rates regularly.
 */
export const HOTELS = {
  makkah: [
    { id: 'fairmont-makkah', name: 'Fairmont Makkah Clock Royal Tower', tier: 'premium', stars: 5, distance: 50, shuttle: false, rates: { booking: 1310, agoda: 1270, expedia: 1350 } },
    { id: 'swissotel-maqam', name: 'Swissôtel Al Maqam Makkah', tier: 'premium', stars: 5, distance: 50, shuttle: false, rates: { booking: 1090, agoda: 1060, expedia: 1120 } },
    { id: 'pullman-zamzam-makkah', name: 'Pullman ZamZam Makkah', tier: 'premium', stars: 5, distance: 100, shuttle: false, rates: { booking: 850, agoda: 830, expedia: 880 } },
    { id: 'anjum-makkah', name: 'Anjum Hotel Makkah', tier: 'standard', stars: 5, distance: 200, shuttle: false, rates: { booking: 610, agoda: 590, expedia: 630 } },
    { id: 'elaf-ajyad', name: 'Elaf Ajyad Hotel', tier: 'standard', stars: 4, distance: 400, shuttle: false, rates: { booking: 390, agoda: 370, expedia: null } },
    { id: 'emaar-grand', name: 'Emaar Grand Hotel', tier: 'standard', stars: 4, distance: 600, shuttle: false, rates: { booking: 320, agoda: 310, expedia: 340 } },
    { id: 'le-meridien-towers', name: 'Le Méridien Towers Makkah', tier: 'economy', stars: 4, distance: 3000, shuttle: true, rates: { booking: 280, agoda: 260, expedia: 290 } },
    { id: 'kiswah-towers', name: 'Al Kiswah Towers Hotel', tier: 'economy', stars: 4, distance: 2500, shuttle: true, rates: { booking: 230, agoda: 230, expedia: 240 } },
  ],
  madinah: [
    { id: 'oberoi-madinah', name: 'The Oberoi Madinah', tier: 'premium', stars: 5, distance: 50, shuttle: false, rates: { booking: 1170, agoda: 1150, expedia: 1210 } },
    { id: 'dar-al-taqwa', name: 'Dar Al Taqwa Hotel', tier: 'premium', stars: 5, distance: 50, shuttle: false, rates: { booking: 690, agoda: 670, expedia: 710 } },
    { id: 'anwar-movenpick', name: 'Anwar Al Madinah Mövenpick', tier: 'premium', stars: 5, distance: 100, shuttle: false, rates: { booking: 560, agoda: 540, expedia: 570 } },
    { id: 'madinah-hilton', name: 'Madinah Hilton', tier: 'premium', stars: 5, distance: 100, shuttle: false, rates: { booking: 600, agoda: 590, expedia: 620 } },
    { id: 'pullman-zamzam-madinah', name: 'Pullman ZamZam Madinah', tier: 'standard', stars: 5, distance: 300, shuttle: false, rates: { booking: 440, agoda: 420, expedia: 450 } },
    { id: 'al-aqeeq-madinah', name: 'Al Aqeeq Madinah Hotel', tier: 'standard', stars: 4, distance: 250, shuttle: false, rates: { booking: 310, agoda: 300, expedia: 320 } },
    { id: 'leader-al-muna', name: 'Leader Al Muna Kareem', tier: 'economy', stars: 4, distance: 300, shuttle: false, rates: { booking: 260, agoda: 250, expedia: null } },
    { id: 'zowar-international', name: 'Zowar International Hotel', tier: 'economy', stars: 3, distance: 500, shuttle: false, rates: { booking: 170, agoda: 160, expedia: 170 } },
  ],
}

/** Rooms are priced from the double-room rate; bigger rooms cost more per room, less per person. */
export const ROOM_TYPES = [
  { id: 'quad', label: 'Quad', capacity: 4, factor: 1.3 },
  { id: 'triple', label: 'Triple', capacity: 3, factor: 1.15 },
  { id: 'double', label: 'Double', capacity: 2, factor: 1 },
]

/**
 * Travel Wala commission, added on top of the subtotal.
 * showInBreakdown: false folds it into the total without a separate line.
 */
export const COMMISSION = { rate: 0.2, label: 'Service charges', showInBreakdown: true }

/** perPerson: whole-trip seat price. perVehicle: whole-trip price per vehicle of `capacity` seats. */
export const TRANSPORT = [
  { id: 'bus', label: 'Shared AC bus', perPerson: 12000 },
  { id: 'car', label: 'Private car', perVehicle: 55000, capacity: 4 },
  { id: 'gmc', label: 'Private GMC', perVehicle: 85000, capacity: 7 },
]

export const ZIYARAT = [
  { id: 'none', label: 'Not needed', perPerson: 0 },
  { id: 'group', label: 'Group ziyarat', perPerson: 6000 },
  { id: 'private', label: 'Private ziyarat', perVehicle: 25000, capacity: 7 },
]

/** Per traveller (infants free), per night. */
export const MEALS = [
  { id: 'none', label: 'Room only', perNight: 0 },
  { id: 'breakfast', label: 'Breakfast', perNight: 2500 },
  { id: 'full', label: 'Full board', perNight: 7000 },
]

/** Quick presets that mirror the tiers on the Umrah page. */
export const PRESETS = [
  { id: 'economy', label: 'Economy', makkahHotel: 'kiswah-towers', madinahHotel: 'zowar-international', room: 'quad', transport: 'bus', ziyarat: 'group', meals: 'none' },
  { id: 'standard', label: 'Standard', makkahHotel: 'elaf-ajyad', madinahHotel: 'al-aqeeq-madinah', room: 'triple', transport: 'bus', ziyarat: 'group', meals: 'breakfast' },
  { id: 'premium', label: 'Premium', makkahHotel: 'swissotel-maqam', madinahHotel: 'anwar-movenpick', room: 'double', transport: 'gmc', ziyarat: 'private', meals: 'full' },
]

/**
 * Peak periods raise flight and hotel rates. Ramadan dates depend on moon sighting,
 * so these are approximate — review them every year.
 */
export const PEAK_PERIODS = [
  { label: 'Ramadan', from: '2026-02-18', to: '2026-03-19', factor: 1.4 },
  { label: 'Winter holidays', from: '2026-12-15', to: '2027-01-05', factor: 1.15 },
  { label: 'Ramadan', from: '2027-02-08', to: '2027-03-09', factor: 1.4 },
  { label: 'Winter holidays', from: '2027-12-15', to: '2028-01-05', factor: 1.15 },
  { label: 'Ramadan', from: '2028-01-28', to: '2028-02-26', factor: 1.4 },
]

export const NIGHT_LIMITS = { makkah: { min: 2, max: 21 }, madinah: { min: 0, max: 14 } }

export const DEFAULT_TRIP = {
  from: 'KHI',
  to: 'JED',
  date: '',
  travellers: { adults: 2, children: 0, infants: 0, cabin: 'Economy' },
  makkahNights: 7,
  madinahNights: 5,
  makkahHotel: 'elaf-ajyad',
  madinahHotel: 'al-aqeeq-madinah',
  room: 'triple',
  transport: 'bus',
  ziyarat: 'group',
  meals: 'breakfast',
}
