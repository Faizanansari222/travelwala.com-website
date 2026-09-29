import { HOTEL_TIERS, RATE_SOURCES } from '../data/umrahCalculator'

/**
 * Hotel rates from a Google Sheet published as CSV (File → Share → Publish to web → CSV).
 * Set the link in .env as VITE_HOTEL_SHEET_CSV_URL. Without it, the bundled HOTELS data is used.
 *
 * Expected columns (header row, any order, case-insensitive):
 *   city | name | tier | stars | distance_m | shuttle | booking_sar | agoda_sar | expedia_sar | map_url | active | id
 * city: Makkah or Madinah. shuttle / active: yes or no (active blank = yes).
 * map_url and id are optional. Rows with no name or no rate are skipped.
 */
export const HOTEL_SHEET_URL = import.meta.env?.VITE_HOTEL_SHEET_CSV_URL?.trim() || ''

/** Minimal RFC 4180 CSV parser: quoted fields, escaped quotes, commas/newlines inside quotes. */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') quoted = false
      else field += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += char
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((cell) => cell.trim()))
}

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const toNumber = (value) => {
  const n = Number(String(value ?? '').replace(/[^\d.]/g, ''))
  return String(value ?? '').trim() && Number.isFinite(n) && n > 0 ? n : null
}
const toBool = (value, fallback) => {
  const v = String(value ?? '').trim().toLowerCase()
  if (!v) return fallback
  return ['yes', 'y', 'true', '1'].includes(v)
}

/** Turns sheet rows into { makkah: [...], madinah: [...] } in the same shape as the bundled HOTELS. */
export function rowsToHotels(rows) {
  const [header, ...body] = rows
  const col = Object.fromEntries(header.map((name, i) => [name.trim().toLowerCase(), i]))
  const cell = (row, name) => (col[name] == null ? '' : (row[col[name]] ?? '').trim())
  const hotels = { makkah: [], madinah: [] }
  const tierIds = HOTEL_TIERS.map((t) => t.id)

  for (const row of body) {
    const city = cell(row, 'city').toLowerCase()
    const name = cell(row, 'name')
    if (!hotels[city] || !name || !toBool(cell(row, 'active'), true)) continue
    const rates = Object.fromEntries(RATE_SOURCES.map((s) => [s.id, toNumber(cell(row, `${s.id}_sar`))]))
    if (Object.values(rates).every((r) => r == null)) continue
    const tier = cell(row, 'tier').toLowerCase()
    hotels[city].push({
      id: cell(row, 'id') || slug(name),
      name,
      tier: tierIds.includes(tier) ? tier : 'standard',
      stars: Math.min(5, Math.max(1, Math.round(toNumber(cell(row, 'stars')) ?? 3))),
      distance: Math.round(toNumber(cell(row, 'distance_m')) ?? 0),
      shuttle: toBool(cell(row, 'shuttle'), false),
      map: cell(row, 'map_url') || null,
      rates,
    })
  }
  if (!hotels.makkah.length || !hotels.madinah.length) throw new Error('Hotel sheet needs at least one Makkah and one Madinah hotel')
  return hotels
}

export async function fetchHotelsFromSheet(url = HOTEL_SHEET_URL) {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Hotel sheet request failed (${response.status})`)
  return rowsToHotels(parseCsv(await response.text()))
}

/** The hotel's own map link from the sheet, or a Google Maps search for it. */
export const hotelMapUrl = (hotel, city) =>
  hotel.map || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${city}, Saudi Arabia`)}`
