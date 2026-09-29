import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { formatPrice, SITE } from '../data/site'
import { COMMISSION, HOTEL_TIERS, MEALS, ROOM_TYPES, SAR_TO_PKR, TRANSPORT, ZIYARAT } from '../data/umrahCalculator'
import { formatLong, fromISODate } from './date'
import { hotelMapUrl } from './hotelSheet'
import { bestRate, tripItinerary } from './umrahPrice'

// Brand colours (RGB) from index.css.
const BRAND = [27, 110, 115]
const BRAND_DEEP = [11, 51, 57]
const ACCENT = [242, 140, 40]
const INK = [24, 73, 77]
const MUTED = [110, 130, 132]

export const TENTATIVE_NOTE =
  'This is a tentative rate, not a confirmed booking. Flight fares, hotel rates and exchange rates change daily and are subject to availability at the time of booking.'

const labelOf = (list, id) => list.find((item) => item.id === id)?.label ?? ''
const sar = (value) => `SAR ${Math.round(value).toLocaleString('en-US')}`
const metres = (value) => `${value.toLocaleString('en-US')} m`
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

/** Builds the quote as a PDF. The standard PDF fonts are Latin-1 only, so no ★ or → here. */
export function buildUmrahQuotePdf(trip, quote, hotels, now = new Date()) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2

  const pad = (n) => String(n).padStart(2, '0')
  const reference = `TW-UMR-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  const { origin, arrival, stops, homeAirport } = tripItinerary(trip, hotels)
  const departure = fromISODate(trip.date)
  const { adults, children, infants, cabin } = trip.travellers

  // Header band
  doc.setFillColor(...BRAND_DEEP)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text(SITE.name, margin, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(SITE.tagline, margin, 21)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Custom Umrah Package Quote', pageWidth - margin, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Quote ref: ${reference}`, pageWidth - margin, 19.5, { align: 'right' })
  doc.text(`Issued: ${formatLong(now)}`, pageWidth - margin, 24.5, { align: 'right' })

  // Tentative-rate notice
  let y = 37
  doc.setFillColor(255, 243, 230)
  doc.setDrawColor(...ACCENT)
  doc.setLineWidth(0.6)
  const noteLines = doc.splitTextToSize(TENTATIVE_NOTE, contentWidth - 10)
  const noteHeight = 11 + noteLines.length * 4.4
  doc.roundedRect(margin, y, contentWidth, noteHeight, 2, 2, 'FD')
  doc.setTextColor(...ACCENT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TENTATIVE RATE', margin + 5, y + 7)
  doc.setTextColor(...INK)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(noteLines, margin + 5, y + 12.5)
  y += noteHeight + 7

  const heading = (text) => {
    doc.setTextColor(...BRAND)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(text, margin, y)
    y += 3
  }
  const facts = (pairs) => {
    const rows = []
    for (let i = 0; i < pairs.length; i += 2) rows.push([...pairs[i], ...(pairs[i + 1] ?? ['', ''])])
    const label = { fontStyle: 'bold', cellWidth: 26, textColor: MUTED }
    table({ theme: 'grid', body: rows, columnStyles: { 0: label, 2: label } })
  }
  const table = (options) => {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin, bottom: 24 },
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 9, textColor: INK, cellPadding: { top: 1.5, bottom: 1.5, left: 2.2, right: 2.2 }, lineColor: [215, 228, 228], lineWidth: 0.2 },
      headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold' },
      ...options,
    })
    y = doc.lastAutoTable.finalY + 7
  }

  heading('Trip details')
  facts([
    ['Route', `${origin.label} to ${arrival.label}, home from ${homeAirport}`],
    ['Departure', departure ? formatLong(departure) : 'Date not selected'],
    ['Return', quote.returnDate ? formatLong(quote.returnDate) : `${plural(quote.nights, 'night')} after departure`],
    ['Duration', `${plural(quote.nights, 'night')} in Saudi Arabia`],
    ['Travellers', `${plural(adults, 'adult')}, ${plural(children, 'child', 'children')}, ${plural(infants, 'infant')}`],
    ['Cabin class', cabin],
  ])

  heading('Accommodation')
  table({
    head: [['City', 'Hotel', 'Package', 'Distance to Haram', 'Nights', 'Rate / night', 'Map']],
    body: stops.map(({ city, nights, hotel }) => {
      const rate = bestRate(hotel).price
      return [
        city,
        `${hotel.name}\n${hotel.stars}-star`,
        labelOf(HOTEL_TIERS, hotel.tier),
        `${hotel.shuttle ? 'Shuttle service' : 'Walking distance'}\n${metres(hotel.distance)}`,
        String(nights),
        `${formatPrice(Math.round(rate * SAR_TO_PKR))}\n${sar(rate)}`,
        'Open map',
      ]
    }),
    columnStyles: {
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { textColor: BRAND, fontStyle: 'bold', cellWidth: 20 },
    },
    // Make the "Open map" cell a clickable Google Maps link.
    didDrawCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 6) return
      const { city, hotel } = stops[data.row.index]
      doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: hotelMapUrl(hotel, city) })
    },
  })

  heading('Services')
  facts([
    ['Room sharing', `${labelOf(ROOM_TYPES, trip.room)} (${plural(quote.rooms, 'room')})`],
    ['Transport', labelOf(TRANSPORT, trip.transport)],
    ['Ziyarat', labelOf(ZIYARAT, trip.ziyarat)],
    ['Meals', labelOf(MEALS, trip.meals)],
    ['Visa', 'Umrah visa, insurance & Nusuk'],
    ['Season', quote.peak ? `${quote.peak.label} (peak rates)` : 'Regular season'],
  ])

  heading('Price breakdown')
  const totals = [
    ['Subtotal', formatPrice(quote.subtotal)],
    ...(COMMISSION.showInBreakdown ? [[`${COMMISSION.label} (${Math.round(COMMISSION.rate * 100)}%)`, formatPrice(quote.commission)]] : []),
    ['Total (tentative)', formatPrice(quote.total)],
  ]
  const totalRow = totals.length - 1
  totals.push([
    `Approx. per traveller  |  total in SAR at SAR 1 = PKR ${SAR_TO_PKR}`,
    `${formatPrice(quote.perTraveller)}  |  ${sar(quote.total / SAR_TO_PKR)}`,
  ])
  table({
    head: [['Item', 'Amount']],
    body: quote.lines.map((line) => [line.label.replaceAll('·', '-'), formatPrice(line.amount)]),
    foot: totals,
    showFoot: 'lastPage',
    columnStyles: { 1: { halign: 'right', cellWidth: 62 } },
    footStyles: { fillColor: [240, 246, 246], textColor: INK, fontStyle: 'bold', halign: 'right' },
    didParseCell: (data) => {
      if (data.section === 'foot' && data.column.index === 0) data.cell.styles.halign = 'left'
      if (data.section === 'foot' && data.row.index > totalRow) {
        data.cell.styles.fillColor = 255
        data.cell.styles.textColor = MUTED
        data.cell.styles.fontStyle = 'normal'
      }
      if (data.section === 'foot' && data.row.index === totalRow) {
        data.cell.styles.fillColor = BRAND_DEEP
        data.cell.styles.textColor = 255
        data.cell.styles.fontSize = 11
      }
    },
  })

  // Watermark and footer on every page
  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page)
    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity: 0.06 }))
    doc.setTextColor(...ACCENT)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(80)
    doc.text('TENTATIVE', pageWidth / 2, pageHeight / 2 + 20, { align: 'center', angle: 35 })
    doc.restoreGraphicsState()

    doc.setDrawColor(215, 228, 228)
    doc.setLineWidth(0.3)
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20)
    doc.setTextColor(...ACCENT)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('This is a tentative rate. Final price is confirmed only at the time of booking.', margin, pageHeight - 15)
    doc.setTextColor(...MUTED)
    doc.setFont('helvetica', 'normal')
    doc.text(`${SITE.phone}  |  WhatsApp +${SITE.whatsapp}  |  ${SITE.email}`, margin, pageHeight - 10.5)
    doc.text(`Page ${page} of ${pages}`, pageWidth - margin, pageHeight - 10.5, { align: 'right' })
  }

  return { doc, filename: `Travel-Wala-Umrah-Quote-${reference}.pdf` }
}

/** Builds the quote PDF and downloads it in the browser. */
export function downloadUmrahQuotePdf(trip, quote, hotels) {
  const { doc, filename } = buildUmrahQuotePdf(trip, quote, hotels)
  doc.save(filename)
}
