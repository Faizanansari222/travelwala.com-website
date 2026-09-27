import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Loader from './components/Loader'
import PageTransition from './components/PageTransition'
import SmoothScroll from './components/SmoothScroll'
import { scrollToTop, useLenis } from './hooks/useLenis'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Packages from './pages/Packages'
import Umrah from './pages/Umrah'

const ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/packages', element: <Packages /> },
  { path: '/umrah', element: <Umrah /> },
  { path: '/contact', element: <Contact /> },
  { path: '*', element: <NotFound /> },
]

function AnimatedRoutes() {
  const location = useLocation()
  const lenis = useLenis()

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollToTop(lenis, { immediate: true })}>
      <Routes location={location} key={location.pathname}>
        {ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={<PageTransition>{element}</PageTransition>} />
        ))}
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Loader />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </SmoothScroll>
    </MotionConfig>
  )
}
