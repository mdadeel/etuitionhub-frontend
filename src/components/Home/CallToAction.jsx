import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-16 bg-slate-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-slate-900 border border-white/5 rounded-none p-12 md:p-16 text-center space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                            Ready to get <span className="text-blue-600">started?</span>
                        </h2>
                        <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] max-w-xl mx-auto">
                            Find the right tutor and start learning today.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-12 h-14 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-none hover:bg-blue-700 transition-all flex items-center justify-center"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/tutors"
                            className="w-full sm:w-auto px-12 h-14 bg-transparent text-white border border-white/20 font-black uppercase tracking-[0.2em] text-[10px] rounded-none hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                            Browse Tutors
                        </Link>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-none"></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Instant Matching</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-none"></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Tutors</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-none"></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Direct Contact</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;