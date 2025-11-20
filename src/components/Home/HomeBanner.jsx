// Home Banner - hero section dekhabe
// users jei first jinish dekhbe
// Removed gradient - solid colors use kortesi now
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// not using gradient - project requirement onujayi
// const animationVariants={
//     hidden:{opacity:0,y:50},
//     visible:{opacity:1,y:0}
// };  // maybe use this later?

const HomeBanner = () => {
    return (
        <div className="hero min-h-[70vh] bg-teal-600 text-white">
            <div className="hero-content text-center">
                {/* <motion.div variants={animationVariants} initial="hidden" animate="visible"> */}
                <motion.div
                    className="max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">
                        Find Your Perfect Tutor
                    </h1>
                    {/* Changed this text a few times - hope its good now */}
                    <p className="text-xl mb-8 opacity-90">
                        Connect with qualified tutors for personalized home tuition.
                        Quality education at your doorstep across Bangladesh.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/tutors" className="btn btn-lg bg-white text-teal-600 hover:bg-gray-100 border-none">
                            Find a Tutor
                        </Link>
                        <Link to="/register" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-teal-600">
                            Become a Tutor
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomeBanner;
