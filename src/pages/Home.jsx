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
let Home = () => {
    console.log('home rendering')
    // init aos animations
    useEffect(() => {
        AOS.init({
            // duration:1000,
            duration: 800,
            once: true,
        })
    }, [])

    return (
        <div>
            <HomeBanner />
            <PopularTutors />
            <HowItWorks />


            <Statistics />
            <WhyChooseUs />
            <Testimonials />
        </div>
    )
}

export default Home
