import HomeBanner from '../components/Home/HomeBanner'
import { useEffect } from "react"
import PopularTutors from '../components/Home/PopularTutors'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Statistics from "../components/Home/Statistics"
import HowItWorks from '../components/Home/HowItWorks'
import WhyChooseUs from "../components/Home/WhyChooseUs"
import Testimonials from "../components/Home/Testimonials"
import FeaturedCategories from '../components/Home/FeaturedCategories';
import CallToAction from '../components/Home/CallToAction';
import Newsletter from '../components/Home/Newsletter';
import FAQ from '../components/Home/FAQ';

/**
 * Home Page - Main Entry Point
 * Refactored to "Apple Design System"
 */
const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quart'
        })
    }, [])

    return (
        <div className="bg-white dark:bg-apple-gray-950 selection:bg-apple-blue/20 selection:text-apple-blue">
            <HomeBanner />

            <div data-aos="fade-up">
                <Statistics />
            </div>

            <div data-aos="fade-up">
                <FeaturedCategories />
            </div>

            <div data-aos="fade-up">
                <PopularTutors />
            </div>

            <div data-aos="fade-up">
                <WhyChooseUs />
            </div>

            <div data-aos="fade-up">
                <HowItWorks />
            </div>

            <div data-aos="fade-up">
                <CallToAction />
            </div>

            {/* Testimonials refactor pending, using standard for now */}
            <div data-aos="fade-up">
                <Testimonials />
            </div>

            <div data-aos="fade-up">
                <FAQ />
            </div>

            <div data-aos="fade-up">
                <Newsletter />
            </div>
        </div>
    )
}

export default Home
