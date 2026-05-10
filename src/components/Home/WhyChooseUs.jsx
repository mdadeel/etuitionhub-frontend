import { ShieldCheck, MessageCircle, Wallet, Monitor, Star, CheckCircle } from 'lucide-react';

const features = [
    { icon: ShieldCheck, title: "Verified Profiles", desc: "Academic documents checked" },
    { icon: Star, title: "Parent Reviews", desc: "Real feedback from families" },
    { icon: Wallet, title: "Flexible Budget", desc: "৳2,000 to ৳15,000/mo" },
    { icon: MessageCircle, title: "Direct Contact", desc: "No middleman fees" },
    { icon: Monitor, title: "Online & Offline", desc: "Your preference" },
    { icon: CheckCircle, title: "Progress Tracking", desc: "Regular updates" }
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Editorial layout - left heavy, right grid */}
                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left - stronger heading + paragraph */}
                    <div className="lg:col-span-5">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                            Why parents trust e-tuitionBD
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We've heard the stories — tutors who don't show up, fake credentials, hidden fees. That's why we built a platform where every tutor is verified, every fee is transparent, and every parent can communicate directly. No agents, no guesswork, just teaching.
                        </p>
                    </div>

                    {/* Right - compact feature grid */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                                >
                                    <div className="w-9 h-9 flex items-center justify-center bg-white text-blue-600 rounded-lg mb-3 border border-slate-200">
                                        <feature.icon size={16} />
                                    </div>
                                    <h3 className="font-medium text-slate-900 text-sm mb-1">{feature.title}</h3>
                                    <p className="text-xs text-slate-500">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;