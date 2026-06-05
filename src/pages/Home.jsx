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
import SEO from '../components/shared/SEO';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="bg-background">
            <SEO 
                title="Find Private Tutors in Bangladesh | Home Tuition – eTuitionBD" 
                description="Book verified private tutors in Dhaka, Chattogram & across Bangladesh. No agent fees. Direct contact. Browse 2,500+ tutors by subject & area — free to join."
                keywords="tutor, online tutor, home tutor, bangladesh tuition, e-tuitionBD, find tutors, home tuition dhaka"
            />
            <HomeBanner />
            <FeaturedCategories />
            <PopularTutors />
            <MissionStatement />
            <Statistics />
            <WhyChooseUs />
            <FeatureSpotlight />
            <HowItWorks />
            {!user && <CallToAction />}
            <Testimonials />
            <FAQ />
            <Newsletter />
        </div>
    )
}


export default Home
