import Footer from './Footer'
import Navbar from './Navbar'
import ScrollToTopButton from './ScrollToTopButton'
import WhatsAppButton from './WhatsAppButton'

export default function Layout({ children }) {
  return (
    <>
      <a
        href="#main"
        onClick={() => document.getElementById('main')?.focus({ preventScroll: true })}
        className="sr-only z-[110] rounded-full bg-accent px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="overflow-x-clip focus:outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </>
  )
}
