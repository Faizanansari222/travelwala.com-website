export const SITE = {
  name: 'Travel Wala',
  tagline: 'Beyond Journeys, Crafting Memories',
  url: 'https://travelwala.example',
  phone: '+92 300 0000000',
  phoneHref: 'tel:+923000000000',
  whatsapp: '923000000000',
  email: 'info@travelwala.example',
  address: 'Office 101, Example Plaza, Main Boulevard, Karachi',
  hours: 'Mon–Sat, 10am–7pm',
  mapEmbed: 'https://www.google.com/maps?q=Karachi%2C%20Pakistan&z=13&output=embed',
  socials: [
    { name: 'Facebook', href: 'https://facebook.com/' },
    { name: 'Instagram', href: 'https://instagram.com/' },
    { name: 'YouTube', href: 'https://youtube.com/' },
    { name: 'X', href: 'https://x.com/' },
  ],
}

export const whatsappLink = (text = 'Assalam o Alaikum! I would like to plan a trip with Travel Wala.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/packages', label: 'Packages' },
  { to: '/umrah', label: 'Umrah & Hajj' },
  { to: '/contact', label: 'Contact' },
]

export const STATS = [
  { value: 10000, suffix: '+', label: 'Happy Travellers', icon: 'users' },
  { value: 50, suffix: '+', label: 'Destinations', icon: 'globe' },
  { value: 15, suffix: '+', label: 'Years of Trust', icon: 'award' },
  { value: 4.9, decimals: 1, suffix: '★', label: 'Average Rating', icon: 'star' },
]

// Stops the scroll-linked plane visits on the Home page (top → bottom).
export const ROUTE_STOPS = ['Karachi', 'Dubai', 'Istanbul', 'Kuala Lumpur', 'Bangkok', 'Baku', 'Malé']

export const formatPrice = (value) => `PKR ${value.toLocaleString('en-US')}`
