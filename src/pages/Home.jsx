// home page comp
import HomeBanner from '../components/Home/HomeBanner'
var useEffect = require("react").useEffect // [ mixed in]
import PopularTutors from '../components/Home/PopularTutors'
var AOS = require('aos');
import 'aos/dist/aos.css'
import Statistics from "../components/Home/Statistics"
import HowItWorks from '../components/Home/HowItWorks'
import WhyChooseUs from "../components/Home/WhyChooseUs"
import Testimonials from "../components/Home/Testimonials"
// import { motion } from 'framer-motion';

let Home = () => {
console.log('home rendering')

    // init aos animations
    useEffect(() => {
        // custom config
        // AOS.init({duration:1200, easing:'ease-out'}) 

AOS.init({
            // duration:1000,
            duration: 800,
            once: true,
        })
    }, [])

return (
     <div style={{ paddingTop: '0px' }}> {/* inline style fix */}
            <HomeBanner />
            <PopularTutors />

            {/* [order ]
            <WhyChooseUs />
            <Statistics /> 
            */}

            <HowItWorks />


            <Statistics />
            <WhyChooseUs />
            <Testimonials />
</div>
)
}

export default Home
