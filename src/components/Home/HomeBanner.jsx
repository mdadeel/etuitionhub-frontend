// home banner - hero section
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero-banner.png';

const HomeBanner = () => {
    return (
        <section className="bg-[var(--color-surface)] px-6 pt-12 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-7">


                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-8 leading-[1.1]">
                            The standard for <br />
                            <span className="text-teal-600">private education</span> <br />
                            in Bangladesh.
                        </h1>

                        <p className="text-lg text-[var(--color-text-secondary)] mb-12 max-w-lg leading-relaxed">
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

                        <div className="mt-12 flex items-center gap-8 border-t border-[var(--color-border)] pt-8">
                            <div>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">1.2k+</p>
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-medium">Verified Tutors</p>
                            </div>
                            <div className="w-px h-8 bg-[var(--color-border)]"></div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">850+</p>
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-medium">Active Tuitions</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-5 relative">
                        <div className="aspect-[16/10] lg:aspect-[4/3] bg-[var(--color-surface-muted)] rounded-sm overflow-hidden border border-[var(--color-border)] relative group shadow-2xl">
                            <img
                                src={heroImage}
                                alt="Elite Tuition"
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-60"></div>
                            <div className="absolute inset-x-10 bottom-4 p-5 bg-[var(--color-surface)]/90 backdrop-blur-md border border-white/20 rounded-sm shadow-xl transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Elite Pedagogy</p>
                                <p className="text-[var(--color-text-primary)] font-bold text-xl tracking-tight">Structured Growth.</p>
                                <p className="text-[var(--color-text-secondary)] text-xs mt-2 uppercase tracking-wide font-medium">Curated Expert Matchmaking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;
