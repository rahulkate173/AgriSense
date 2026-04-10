import '../styles/Home.css'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Problems from '../components/Problems'
import Solution from '../components/Solution'
import Features from '../components/Features'
import Technology from '../components/Technology'
import Impact from '../components/Impact'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <Features />
        <Technology />
        <Impact />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

export default Home
