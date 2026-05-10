import { Target, Bell, Headphones } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: "Track Progress",
        description: "Monitor performance and improvements over time"
    },
    {
        icon: Bell,
        title: "Real-time Updates",
        description: "Get instant notifications on applications and messages"
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description: "Our team is here to help you succeed"
    }
];

const FeatureSpotlight = () => {
    return (
        <section className="py-12 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className="hidden lg:block p-5 bg-slate-100 rounded-xl">
                        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                            <div className="text-xs text-slate-500 mb-3">Dashboard Preview</div>
                            <div className="space-y-3">
                                <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-5">
                            Managed Progress
                        </h2>

                        <div className="space-y-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg">
                                        <feature.icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900 text-sm">{feature.title}</h3>
                                        <p className="text-xs text-slate-600">{feature.description}</p>
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