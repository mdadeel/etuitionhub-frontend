import HomeBanner from '../components/Home/HomeBanner'
import PopularTutors from '../components/Home/PopularTutors'
import HowItWorks from '../components/Home/HowItWorks'
import Testimonials from "../components/Home/Testimonials"
import FeaturedCategories from '../components/Home/FeaturedCategories';
import FAQ from '../components/Home/FAQ';
import SEO from '../components/shared/SEO';

const Home = () => {
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
            <HowItWorks />
            <Testimonials />
            <FAQ />
        </div>
    )
}

export default Home
