// home page comp
import HomeBanner from '../components/Home/HomeBanner'
import { useEffect } from "react"
import PopularTutors from '../components/Home/PopularTutors'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Statistics from "../components/Home/Statistics"
import HowItWorks from '../components/Home/HowItWorks'
import WhyChooseUs from "../components/Home/WhyChooseUs"
import Testimonials from "../components/Home/Testimonials"
// import { motion } from 'framer-motion';
import FeaturedCategories from '../components/Home/FeaturedCategories';
import CallToAction from '../components/Home/CallToAction';
import Newsletter from '../components/Home/Newsletter';
import FAQ from '../components/Home/FAQ';


const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        })
    }, [])

    return (
        <div className="bg-white">
            <HomeBanner />

            <div className="fade-up">
                <Statistics />
            </div>

            <div className="fade-up">
                <FeaturedCategories />
            </div>

            <div className="fade-up">
                <PopularTutors />
            </div>

            <div className="fade-up">
                <WhyChooseUs />
            </div>

            <div className="fade-up">
                <HowItWorks />
            </div>

            <div className="fade-up">
                <CallToAction />
            </div>

            <div className="fade-up">
                <Testimonials />
            </div>

            <div className="fade-up">
                <FAQ />
            </div>

            <div className="fade-up">
                <Newsletter />
            </div>
        </div>
    )
}

export default Home
