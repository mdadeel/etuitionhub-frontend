import { User, MapPin, Star, MessageCircle } from 'lucide-react';

const testimonials = [
    {
        text: "We tried three different coaching centers before finding a tutor here. The difference was night and day — my daughter went from failing physics to scoring 85 in her HSC. The direct contact with the tutor helped us track her progress ourselves.",
        role: "Parent",
        location: "Dhaka, Mirpur",
        child: "HSC Candidate",
        rating: 5,
        color: "bg-blue-600/5",
        accent: "bg-blue-600"
    },
    {
        text: "Needed a tutor for my younger brother urgently before finals. Got connected within a day. The tutor was verified, which made us feel comfortable letting him teach online.",
        role: "Student",
        location: "Chittagong",
        child: "SSC Student",
        rating: 5,
        color: "bg-emerald-600/5",
        accent: "bg-emerald-600"
    },
    {
        text: "Better than traditional tutoring agencies — no hidden fees, you talk directly to the tutor before committing. Found someone who actually matched my learning style.",
        role: "Student",
        location: "Sylhet",
        child: "University",
        rating: 5,
        color: "bg-indigo-600/5",
        accent: "bg-indigo-600"
    }
];

const Testimonials = () => {
    return (
        <section className="py-16 bg-white overflow-hidden relative border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-3xl mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-900 rounded-none border border-slate-200">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Proof</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        Stories from <br />
                        <span className="text-blue-600">real families</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">Authentic experiences from our community.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className={`group relative p-10 bg-white rounded-none transition-all hover:bg-slate-50`}
                        >
                            {/* Quote Icon */}
                            <div className="mb-6 opacity-10">
                                <MessageCircle size={32} className="text-slate-900" />
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={12} className="fill-blue-600 text-blue-600" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-base text-slate-700 font-bold leading-relaxed mb-10 tracking-tight">
                                "{t.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
                                <div className="w-10 h-10 bg-slate-100 rounded-none flex items-center justify-center border border-slate-200">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t.role}</div>
                                    <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                                        <MapPin size={10} className="text-blue-600" />
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