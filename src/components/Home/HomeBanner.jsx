import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'
import { useState } from 'react';

const HomeBanner = (props) => {
    // console.log('banner');

    // [ not using anymore]
    // const [title, setTitle] = useState('Find Your Perfect Tutor');

    return (
        <div className="relative min-h-[80vh] bg-teal-600 overflow-hidden">
            <div className='relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[80vh]' style={{ minHeight: '80vh', paddingBottom: '30px' }}>
                <motion.div className="text-center max-w-3xl"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>
                    <span className='inline-block px-4 py-2 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium mb-6'>
                        Trusted by 1000+ Students & Tutors
                    </span>

                    {/* version commented] 
                    <h1>Best Tutors in Bangladesh</h1>
                    */}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Find Your Perfect
                        <span className="text-teal-400"> Tutor</span>
                    </h1>

                    {/* desc */}
                    <p className='text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed' style={{ marginBottom: '40px' }}>
                        Connect with qualified tutors for personalized home tuition. Quality education at your doorstep across Bangladesh.
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to='/tutors'
                            className="btn btn-lg bg-teal-500 hover:bg-teal-600 text-white border-none font-semibold px-8 shadow-lg shadow-teal-500/30">
                            Find a Tutor
                        </Link>
                        <Link to="/tuitions" className='btn btn-lg bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8'>
                            Browse Tuitions
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomeBanner;
