// Home page component
// landing page e-tuitionBD er
// sob sections ekhane import kore dekhacchi
// TODO: maybe add a loading spinner?
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomeBanner from '../components/Home/HomeBanner';
import PopularTutors from '../components/Home/PopularTutors';
import Statistics from '../components/Home/Statistics';
import HowItWorks from '../components/Home/HowItWorks';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import Testimonials from '../components/Home/Testimonials';

// home component define kortesi
const Home = () => {
    // AOS library use kortesi animations er jonno
    // useEffect e initialize kortesi
    // page load hoile chalaibo
    useEffect(() => {
        // AOS initialize kortesi with options
        // duration 800ms set korechi
        AOS.init({
            // animation duration
            duration: 800,
            // only once animate hobe
            once: true,
        });
        // debug log - ekhane console log rakhtesi
        console.log('AOS initialized')
        // NOTE: cleanup function add korbo maybe?
    }, []); // empty dependency array - only once run hobe

    // return kortesi home page structure
    return (
        // main container div
        <div>
            {/* Hero banner section - top e thakbe */}
            <HomeBanner />

            {/* Popular tutors section */}
            <PopularTutors />

            {/* How it works process section */}
            <HowItWorks />


            {/* Statistics counter section */}
            <Statistics />

            {/* Why choose us features section */}
            <WhyChooseUs />

            {/* Testimonials review section */}
            <Testimonials />
        </div>
    );
};

// home component export kortesi
export default Home;
