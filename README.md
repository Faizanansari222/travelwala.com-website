# Travel Wala — Beyond Journeys, Crafting Memories

An animated, multi-page travel agency website built with **React 18 + Vite**, **Tailwind CSS v4**,
**Framer Motion**, **React Router v6**, **Lenis** smooth scrolling and **lucide-react** icons.
There is no backend: every piece of content comes from local data files in `src/data`.

## Getting started

Requires **Node.js 20.19+ or 22.12+**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build into /dist
npm run preview  # serve the production build locally
```

> The intro loader plays only on a visitor's **first** visit (stored in `localStorage`).
> To see it again, run `localStorage.removeItem('travelwala-intro-seen')` in the browser console.

When deploying as a single-page app, configure your host to serve `index.html` for all routes
(e.g. a Netlify `_redirects` file with `/* /index.html 200`, or a Vercel rewrite).

## Folder structure

```
public/
  logo.svg            ← logo for light backgrounds
  logo-light.svg      ← logo for dark backgrounds (navbar, footer, loader)
  favicon.svg
src/
  App.jsx             ← routes + AnimatePresence page transitions
  main.jsx            ← providers (Router, Helmet)
  index.css           ← Tailwind v4 theme tokens (brand colours, shadows, keyframes)
  components/
    Plane.jsx         ← inline SVG plane (<Plane/>, <PlaneGlyph/>) — recolour with text-*
    PathFlight.jsx    ← plane that flies along any SVG path with a drawn contrail
    FlightPath.jsx    ← scroll-linked route + plane + destination pins (Home)
    Loader.jsx, PageTransition.jsx, Navbar.jsx, MobileMenu.jsx, Footer.jsx,
    BookNowButton.jsx, WhatsAppButton.jsx, ScrollToTopButton.jsx, Clouds.jsx,
    PageHero.jsx, SectionTitle.jsx, Reveal.jsx, StatsCounter.jsx, Testimonials.jsx,
    DestinationCard.jsx, PackageCard.jsx, PackageModal.jsx, Accordion.jsx,
    CtaBanner.jsx, SmartImage.jsx, Seo.jsx, SocialIcons.jsx, SmoothScroll.jsx, Logo.jsx
    home/  about/  packages/  umrah/  contact/   ← page-specific sections
  pages/              ← Home, About, Packages, Umrah, Contact, NotFound
  data/               ← all dummy content (see below)
  hooks/              ← usePathFollower, useScrollProgress, useLenis, useFocusTrap, …
  lib/                ← shared motion variants and small utilities
```

## Animation highlights

| Feature | Where |
| --- | --- |
| Intro loader: plane takes off drawing its path, logo fades in, curtain slides up | `components/Loader.jsx` |
| Hero plane with dashed contrail on a bezier curve, 3 parallax cloud layers | `components/home/Hero.jsx`, `components/Clouds.jsx` |
| Scroll-linked flight route with rotating plane and pop-in destination pins | `components/FlightPath.jsx` |
| Route change: teal wipe + plane swoosh | `components/PageTransition.jsx` |
| "Book Now" plane flies out right and back in from the left | `components/BookNowButton.jsx` |
| Contact success: paper plane folds, flies away, message appears | `components/contact/PaperPlaneSuccess.jsx` |
| Timeline line draws on scroll with a plane at its tip | `components/about/Timeline.jsx` |
| Lost plane circling a figure-eight on the 404 page | `pages/NotFound.jsx` |

All planes follow their paths via `hooks/usePathFollower.js`, which writes SVG transforms directly
(no React re-renders). Animations use transforms and opacity. With **prefers-reduced-motion**,
Framer Motion's `MotionConfig reducedMotion="user"` turns movement into simple fades, Lenis is
turned off, and flying planes, parallax and loops are replaced by static routes.

## Replacing the dummy content

| What | Where to change it |
| --- | --- |
| **Logo** | Replace `public/logo.svg` (light backgrounds) and `public/logo-light.svg` (dark backgrounds). Keep a wide aspect ratio (about 4:1) or adjust the height in `components/Logo.jsx`. Update `public/favicon.svg` as well. |
| **Images** | All photos are stored locally in `public/images/` (WebP) and `public/images/avatars/` (testimonial and team faces), and their paths are listed in `src/data/images.js`. To replace a photo, overwrite the file with the same name. To add one, drop the file in and add its path there. Placeholder photos come from Unsplash (Unsplash License) and randomuser.me. |
| **Phone, email, address, hours, WhatsApp, socials, map** | `src/data/site.js` (`SITE` object). `whatsapp` is the number in international format without `+`. `mapEmbed` is any Google Maps embed URL. |
| **Stats and home route stops** | `STATS` and `ROUTE_STOPS` in `src/data/site.js` |
| **Destinations** (home cards) | `src/data/destinations.js` |
| **Tour packages** (cards, filters, itineraries, inclusions) | `src/data/packages.js` |
| **Services and "Why choose us"** | `src/data/services.js` |
| **Testimonials** | `src/data/testimonials.js` |
| **Team** | `src/data/team.js` |
| **Mission/vision, timeline, partners** | `src/data/about.js` |
| **Umrah tiers, details, steps** | `src/data/umrah.js` |
| **Umrah FAQs** | `src/data/faqs.js` |
| **Brand colours and fonts** | the `@theme` block in `src/index.css` |
| **Page titles and meta descriptions** | the `<Seo>` element at the top of each file in `src/pages/`, and `SITE.url` for canonical links |
| **Contact form sending** | `fakeSend` in `src/components/contact/ContactForm.jsx`. Replace it with a real API call (e.g. Formspree, EmailJS or your own endpoint). |
| **Newsletter** | `Newsletter` in `src/components/Footer.jsx` only validates locally. Connect it to your mailing provider. |
