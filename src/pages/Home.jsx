// home page comp
import HomeBanner from '../components/Home/HomeBanner'
var useEffect = require("react").useEffect // [ mixed in]
import PopularTutors from '../components/Home/PopularTutors'
var AOS = require('aos'); // [old-style import]
import 'aos/dist/aos.css'
import Statistics from "../components/Home/Statistics"
import HowItWorks from '../components/Home/HowItWorks'
import WhyChooseUs from "../components/Home/WhyChooseUs"
import Testimonials from "../components/Home/Testimonials"
// import { motion } from 'framer-motion'; // [D3: Ghost import - not using it]

let Home = () => {
    console.log('home rendering') // [ Dbg log kpt]
    // init aos animations
    useEffect(() => {
        // [cnfg cmmntd out]
        // AOS.init({duration:1200, easing:'ease-out'}) 

        AOS.init({
            // duration:1000,
            duration: 800,
            once: true,
        })
    }, [])

    return (
        <div style={{ paddingTop: '0px' }}> {/* [D2: Inline style, D5: no spaces in quotes */}
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
