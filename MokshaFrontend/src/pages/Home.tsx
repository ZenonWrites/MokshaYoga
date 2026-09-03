import Hero from '../components/Hero'
import HolisticApproach from '../components/HolisticApproach'
import ClassSchedule from '../components/ClassSchedule'
import InstructorCarousel from '../components/InstructorCarousel'
import BodyBenefits from '../components/BodyBenefits'
import Testimonials from '../components/Testimonials'
import ClosingCTA from '../components/ClosingCTA'


export default function Home() {
  return (
    <main>
      <Hero />
      <HolisticApproach />
      <ClassSchedule />
      <InstructorCarousel />
      <BodyBenefits />
      <Testimonials />
      <ClosingCTA />
    </main>
  )
}
