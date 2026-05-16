import { ShieldCheck, MessageCircle, Wallet, Monitor, Star, CheckCircle, Zap } from 'lucide-react';

const features = [
    { icon: ShieldCheck, title: "Verified Profiles", desc: "Academic documents checked", color: "text-emerald-600", bg: "bg-emerald-600/5" },
    { icon: Star, title: "Parent Reviews", desc: "Real feedback from families", color: "text-amber-600", bg: "bg-amber-600/5" },
    { icon: Wallet, title: "Flexible Budget", desc: "৳2,000 to ৳15,000/mo", color: "text-blue-600", bg: "bg-blue-600/5" },
    { icon: MessageCircle, title: "Direct Contact", desc: "No middleman fees", color: "text-blue-600", bg: "bg-blue-600/5" },
    { icon: Monitor, title: "Online & Offline", desc: "Your preference", color: "text-teal-600", bg: "bg-teal-600/5" },
    { icon: CheckCircle, title: "Progress Tracking", desc: "Regular updates", color: "text-emerald-600", bg: "bg-emerald-600/5" }
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left - The Narrative */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                Why parents <br />
                                trust <span className="text-blue-600">e-tuitionBD</span>
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-bold">
                                We've heard the stories — tutors who don't show up, fake credentials, and hidden fees that exploit families. 
                            </p>
                        </div>

                        <div className="p-8 bg-slate-950 rounded-none text-white border-l-4 border-blue-600 relative overflow-hidden">
                             <p className="text-lg font-bold leading-relaxed italic relative z-10">
                                "That's why we built a platform where every tutor is verified, every fee is transparent, and every parent can communicate directly. No agents, no guesswork, just teaching."
                             </p>
                             <div className="mt-6 flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-none bg-slate-800 border border-slate-700 flex items-center justify-center">
                                    <Zap size={18} className="text-blue-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Our Founding Mission</span>
                             </div>
                        </div>
                    </div>

                    {/* Right - Feature Integration */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 bg-white rounded-none transition-all hover:bg-slate-50"
                            >
                                <div className={`w-12 h-12 flex items-center justify-center bg-slate-100 border border-slate-200 ${feature.color} rounded-none mb-6`}>
                                    <feature.icon size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight uppercase">{feature.title}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;