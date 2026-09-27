import MissionVision from '../components/about/MissionVision'
import OurStory from '../components/about/OurStory'
import Partners from '../components/about/Partners'
import Team from '../components/about/Team'
import Timeline from '../components/about/Timeline'
import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import { IMAGES } from '../data/images'

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Meet Travel Wala — a licensed Karachi travel agency crafting honest, memorable journeys since 2010. Our story, mission, milestones and team."
        path="/about"
      />
      <PageHero
        title="We don’t just book trips, we craft memories"
        subtitle="Fifteen years of honest advice, careful planning and happy travellers — this is the story of Travel Wala."
        eyebrow="About Travel Wala"
        crumb="About Us"
        image={IMAGES.heroAbout}
      />
      <OurStory />
      <MissionVision />
      <Timeline />
      <Team />
      <Partners />
      <CtaBanner title="Let’s write your travel story together" />
    </>
  )
}
