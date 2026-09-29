import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_TRIP, HOTELS } from '../../data/umrahCalculator'
import { fetchHotelsFromSheet, HOTEL_SHEET_URL } from '../../lib/hotelSheet'

const UmrahTripContext = createContext(null)

/**
 * Shares the Umrah trip between the hero search card and the calculator section,
 * and loads hotel rates from the Google Sheet (bundled HOTELS when no sheet is set or it fails).
 */
export function UmrahTripProvider({ children }) {
  const [trip, setTrip] = useState(DEFAULT_TRIP)
  const [hotels, setHotels] = useState(HOTELS)
  const [ratesStatus, setRatesStatus] = useState(HOTEL_SHEET_URL ? 'loading' : 'bundled')

  useEffect(() => {
    if (!HOTEL_SHEET_URL) return
    let cancelled = false
    fetchHotelsFromSheet()
      .then((sheetHotels) => {
        if (cancelled) return
        setHotels(sheetHotels)
        setRatesStatus('live')
      })
      .catch((error) => {
        console.error('Could not load hotel rates from Google Sheet; using bundled rates.', error)
        if (!cancelled) setRatesStatus('fallback')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <UmrahTripContext.Provider value={{ trip, setTrip, hotels, ratesStatus }}>{children}</UmrahTripContext.Provider>
}

export function useUmrahTrip() {
  const context = useContext(UmrahTripContext)
  if (!context) throw new Error('useUmrahTrip must be used inside <UmrahTripProvider>')
  const { trip, setTrip, hotels, ratesStatus } = context
  /** set('makkahNights')(9) → updates one field. */
  const set = (key) => (value) => setTrip((t) => ({ ...t, [key]: value }))
  return { trip, setTrip, set, hotels, ratesStatus }
}

export const UMRAH_CALCULATOR_ID = 'umrah-calculator'
