import CtaBanner from '../components/CtaBanner'
import FlightPath from '../components/FlightPath'
import Destinations from '../components/home/Destinations'
import Hero from '../components/home/Hero'
import Services from '../components/home/Services'
import WhyChooseUs from '../components/home/WhyChooseUs'
import Seo from '../components/Seo'
import StatsCounter from '../components/StatsCounter'
import Testimonials from '../components/Testimonials'
import { ROUTE_STOPS } from '../data/site'

export default function Home() {
  return (
    <>
      <Seo
        description="Travel Wala crafts holidays, international tours, Umrah & Hajj packages, air tickets and visa assistance from Karachi. Explore the world and travel with trust."
        path="/"
      />
      <Hero />
      <StatsCounter />
      <FlightPath stops={ROUTE_STOPS}>
        <Destinations />
        <Services />
        <WhyChooseUs />
        <Testimonials />
      </FlightPath>
      <CtaBanner />
    </>
  )
}
