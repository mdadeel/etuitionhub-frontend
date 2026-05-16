const MissionStatement = () => {
    return (
        <section className="py-16 bg-slate-950 overflow-hidden relative border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-10">
                        We're not another tutoring marketplace. 
                        <span className="block text-blue-600 mt-2">We're a trust infrastructure.</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <p className="text-lg text-slate-300 leading-relaxed font-bold">
                            We built this because finding a good teacher in Bangladesh shouldn't feel like gambling. 
                            The current system is broken — filled with fake credentials and middleman fees.
                        </p>
                        <p className="text-lg text-slate-500 leading-relaxed font-bold">
                            Every profile on our platform is verified, every fee is transparent, and every parent can speak directly to the tutor. 
                            No agents, no guesswork.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-12 items-center border-t border-white/10 pt-10">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white tracking-tighter">100%</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Verification Rate</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white tracking-tighter">0৳</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Agent Commission</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white tracking-tighter">Direct</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Parent-Tutor Link</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;