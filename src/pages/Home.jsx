import HomeBanner from '../components/Home/HomeBanner'
import PopularTutors from '../components/Home/PopularTutors'
import Statistics from "../components/Home/Statistics"
import HowItWorks from '../components/Home/HowItWorks'
import WhyChooseUs from "../components/Home/WhyChooseUs"
import Testimonials from "../components/Home/Testimonials"
import FeaturedCategories from '../components/Home/FeaturedCategories';
import CallToAction from '../components/Home/CallToAction';
import Newsletter from '../components/Home/Newsletter';
import FAQ from '../components/Home/FAQ';
import MissionStatement from '../components/Home/MissionStatement';
import FeatureSpotlight from '../components/Home/FeatureSpotlight';

/**
 * Home Page - Main Entry Point
 * Refactored to "Apple Design System" with Storytelling additions
 */
const Home = () => {
    return (
        <div className="bg-background selection:bg-primary/20 selection:text-primary">
            <HomeBanner />

            <div data-aos="fade-up">
                <MissionStatement />
            </div>

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
                <FeatureSpotlight />
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
