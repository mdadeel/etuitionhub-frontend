/**
 * About Page - Platform information and mission statement
 */
import React from 'react';

const About = () => {
    return (
        <div className="fade-up container mx-auto px-8 py-20 lg:px-12 max-w-4xl">
            <header className="mb-16 border-b border-gray-200 pb-12 text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4 block">Institutional Profile</span>
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter">Educational Infrastructure</h1>
                <p className="mt-6 text-lg text-gray-600 font-medium leading-relaxed max-w-2xl italic">
                    Bangladesh's premier neural network connecting academic potential with specialized expertise.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <section>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-8 pb-4 border-b border-gray-50">Operational Mission</h2>
                    <p className="text-gray-600 leading-loose">
                        We are engineering a future where quality academic guidance is no longer a geographical privilege.
                        By standardizing the discovery and engagement of educational talent, we ensure every student has access to the specialized intelligence they require.
                    </p>
                </section>

                <section>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-8 pb-4 border-b border-gray-500/10">Value Architecture</h2>
                    <ul className="space-y-4">
                        {[
                            'Verified professional credentials',
                            'Comprehensive subject indexing',
                            'Dynamic scheduling protocols',
                            'Nationwide jurisdictional coverage'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-900 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <footer className="mt-20 pt-12 border-t border-gray-200">
                <div className="bg-gray-50 p-12 rounded-sm border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Established MMXXIV</p>
                    <p className="text-xs font-medium text-gray-600 italic">"Standardizing Excellence in National Education"</p>
                </div>
            </footer>
        </div>
    );
};

export default About;
