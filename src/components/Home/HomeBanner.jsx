// home banner - hero section
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// console.log('banner loaded'); // debug

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
                        <div className="aspect-square bg-gray-50 rounded-sm overflow-hidden border border-gray-100 relative group">
                            <div className="absolute inset-x-8 bottom-8 p-6 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform duration-300 group-hover:-translate-y-2">
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Featured Expert</p>
                                <p className="text-gray-900 font-semibold text-lg">Mathematics & Physics</p>
                                <p className="text-gray-500 text-sm mt-1">Specializing in O/A Levels & Engineering Admission.</p>
                            </div>
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center p-20 opacity-20">
                                <span className="text-8xl font-black text-slate-900 italic">ET</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;
