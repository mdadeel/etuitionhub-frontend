// home banner - hero section
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero-banner.png';

const HomeBanner = () => {
    return (
        <section className="bg-white px-6 pt-4 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-7">


                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                            The standard for <br />
                            <span className="text-indigo-600">private education</span> <br />
                            in Bangladesh.
                        </h1>

                        <p className="text-lg text-gray-500 mb-12 max-w-lg leading-relaxed">
                            Connect with the top 1% of specialized tutors. We focus on clarity of instruction and proven results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/tutors" className="btn-quiet-primary h-14 px-8 text-base">
                                Find a Tutor
                            </Link>
                            <Link to="/tuitions" className="btn-quiet-secondary h-14 px-8 text-base">
                                Browse Open Positions
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">1.2k+</p>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Verified Tutors</p>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">850+</p>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Active Tuitions</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-5 relative">
                        <div className="aspect-[16/10] lg:aspect-[4/3] bg-gray-50 rounded-sm overflow-hidden border border-gray-100 relative group shadow-2xl">
                            <img
                                src={heroImage}
                                alt="Elite Tuition"
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-60"></div>
                            <div className="absolute inset-x-8 bottom-8 p-6 bg-white/90 backdrop-blur-md border border-white/20 rounded-sm shadow-xl transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Elite Pedagogy</p>
                                <p className="text-gray-900 font-bold text-xl tracking-tight">Structured Growth.</p>
                                <p className="text-gray-500 text-xs mt-2 uppercase tracking-wide font-medium">Curated Expert Matchmaking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;
