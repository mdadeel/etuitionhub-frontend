import { Search, Star, Users } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "Find",
        description: "Search tutors by subject, class, and location with our simple search filters.",
        color: "text-blue-600",
        bg: "bg-blue-600/5"
    },
    {
        icon: Star,
        title: "Compare",
        description: "Review profiles, ratings, and teaching experience to find the perfect teacher.",
        color: "text-blue-600",
        bg: "bg-blue-600/5"
    },
    {
        icon: Users,
        title: "Connect",
        description: "Contact tutors directly through our platform and start learning immediately.",
        color: "text-emerald-600",
        bg: "bg-emerald-600/5"
    }
];

const HowItWorks = () => {
    return (
        <section className="py-16 bg-slate-950 relative overflow-hidden border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        How It <span className="text-blue-600">Works</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em]">Three simple steps to find your tutor.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 md:gap-px relative bg-white/5 border border-white/10">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center p-12 bg-slate-950 transition-all hover:bg-slate-900">
                            {/* Step Number Badge */}
                            <div className="absolute top-0 left-0 w-10 h-10 bg-blue-600 flex items-center justify-center text-white font-black text-xs z-20">
                                0{idx + 1}
                            </div>

                            <div className={`w-16 h-16 rounded-none bg-slate-900 border border-slate-800 ${step.color} flex items-center justify-center mb-8 relative z-10 transition-transform duration-700`}>
                                <step.icon size={32} strokeWidth={2.5} />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase">{step.title}</h3>
                                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-tight leading-relaxed max-w-xs mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;