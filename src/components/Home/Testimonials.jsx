import { User, MapPin, Star } from 'lucide-react';

const testimonials = [
    {
        text: "We tried three different coaching centers before finding a tutor here. The difference was night and day — my daughter went from failing physics to scoring 85 in her HSC. The direct contact with the tutor helped us track her progress ourselves.",
        role: "Parent",
        location: "Dhaka, Mirpur",
        child: "HSC Candidate",
        rating: 5
    },
    {
        text: "Needed a tutor for my younger brother urgently before finals. Got connected within a day. The tutor was verified, which made us feel comfortable letting him teach online.",
        role: "Student",
        location: "Chittagong",
        child: "SSC Student",
        rating: 5
    },
    {
        text: "Better than traditional tutoring agencies — no hidden fees, you talk directly to the tutor before committing. Found someone who actually matched my learning style.",
        role: "Student",
        location: "Sylhet",
        child: "University",
        rating: 4
    }
];

const Testimonials = () => {
    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
                    Stories from real families
                </h2>

                {/* Varied layout - different widths */}
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-xl p-6 border border-slate-200 ${
                                idx === 1 ? 'md:mt-8' : ''
                            }`}
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Quote - varied length */}
                            <p className="text-slate-700 leading-relaxed mb-5">"{t.text}"</p>

                            {/* Author - more detail */}
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">{t.role}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <MapPin size={10} />
                                        {t.location} · {t.child}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;