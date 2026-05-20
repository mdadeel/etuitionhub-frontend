import { Target, Bell, Headphones } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: "Track Progress",
        description: "Monitor performance and improvements over time with our progress tracking tools.",
        color: "text-blue-600",
        bg: "bg-blue-600/5"
    },
    {
        icon: Bell,
        title: "Real-time Updates",
        description: "Get instant notifications on your tuition applications, messages, and updates.",
        color: "text-indigo-600",
        bg: "bg-indigo-600/5"
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description: "Our support team is available 24/7 to help you with any questions or issues.",
        color: "text-emerald-600",
        bg: "bg-emerald-600/5"
    }
];

const FeatureSpotlight = () => {
    return (
        <section className="py-16 bg-white overflow-hidden relative border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Visual Mockup Area */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative bg-white rounded-none border border-slate-200 shadow-none overflow-hidden transition-all duration-700">
                            {/* Browser/Window Header */}
                            <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 rounded-none bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-none bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-none bg-slate-300"></div>
                                <div className="ml-4 h-4 bg-white border border-slate-200 rounded-none w-48"></div>
                            </div>

                            {/* Mockup Content */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-100 rounded-none w-32"></div>
                                        <div className="h-2 bg-slate-50 rounded-none w-48"></div>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-none"></div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded-none p-3 space-y-2">
                                            <div className="h-1.5 bg-slate-200 rounded-none w-3/4"></div>
                                            <div className="h-4 bg-slate-200 rounded-none w-full"></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-40 bg-slate-50 border border-slate-100 rounded-none p-6 relative overflow-hidden">
                                    <div className="flex items-end justify-between h-full gap-1">
                                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                            <div 
                                                key={i} 
                                                className="w-full bg-blue-600/30 rounded-none transition-all duration-1000" 
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-none"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Learning Progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Notification - Static Sharp */}
                        <div className="absolute -top-6 -right-4 bg-slate-900 p-4 rounded-none border border-slate-800 flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-none flex items-center justify-center">
                                <Bell size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">New Message</p>
                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">Tutor connected successfully</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-900 rounded-none border border-slate-200">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Our Features</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                Track Your <br />
                                <span className="text-blue-600">Learning</span>
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-bold">
                                Take control of your educational journey with our comprehensive dashboard. Keep track of tutor interactions and lessons in one simple interface.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-5">
                                    <div className={`shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 border border-slate-200 ${feature.color} rounded-none`}>
                                        <feature.icon size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">{feature.title}</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSpotlight;