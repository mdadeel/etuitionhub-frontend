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

const Home = () => {
    return (
        <div className="bg-background">
            <HomeBanner />
            <FeaturedCategories />
            <PopularTutors />
            <MissionStatement />
            <WhyChooseUs />
            <FeatureSpotlight />
            <HowItWorks />
            <CallToAction />
            <Testimonials />
            <FAQ />
            <Newsletter />
        </div>
    )
}

export default Home
