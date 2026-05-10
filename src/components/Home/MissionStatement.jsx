import { GraduationCap } from "lucide-react";

const MissionStatement = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
                            Education that actually works
                        </h2>
                        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                            We're not another tutoring marketplace. We built this because finding a good teacher in Bangladesh shouldn't feel like gambling. Every profile is verified, every fee is transparent, and every parent can speak directly to the tutor.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;