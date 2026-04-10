import '../styles/Home.css'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Problems from '../components/Problems'
import Features from '../components/Features'
import Solution from '../components/Solution'
import Impact from '../components/Impact'
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
        <Impact />
      </main>
      <Footer />
    </>
  )
}

export default Home
