const Newsletter = () => {
    return (
        <section className="py-20 bg-[var(--color-surface)]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-indigo-900 dark:bg-indigo-950/50 border border-indigo-500/10 rounded-2xl p-8 md:p-16 text-center relative overflow-hidden transition-colors duration-300">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                            Stay Updated with Opportunities
                        </h2>
                        <p className="text-indigo-200 mb-10 text-lg">
                            Get the latest tuition jobs, tutor tips, and platform updates delivered directly to your inbox. No spam, we promise.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
                                required
                            />
                            <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
