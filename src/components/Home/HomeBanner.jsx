import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Search, MapPin, GraduationCap, CheckCircle, Clock, Users, Star, MessageCircle, TrendingUp, Zap, ShieldCheck, UserPlus, GraduationCap as TutorIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tutorPreview = {
    name: "Rahim Ahmed",
    subjects: "Math, Physics",
    rating: 4.9,
    reviews: 128,
    fee: "৳5,000",
    location: "Dhaka, Mirpur",
    verified: true,
    responseTime: "Usually replies in 15 min",
    completedSessions: "12+ Students taught",
    style: "Explains concepts visually",
    inquiriesToday: 12
};

const HomeBanner = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        subject: '',
        classLevel: '',
        location: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchData.subject) params.set('subject', searchData.subject);
        if (searchData.classLevel) params.set('class', searchData.classLevel);
        if (searchData.location) params.set('location', searchData.location);
        navigate(`/tutors?${params.toString()}`);
    };

    return (
        <section className="bg-[#F8FAFC] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
                <div className="grid lg:grid-cols-12 gap-8 items-center">

                    {/* LEFT - Content & Search */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-none mb-4 border border-[#2E7D32]/10">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-wider">2,500+ verified tutors</span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tighter leading-[1.1] mb-4">
                                Find the right tutor <br />
                                without the <span className="text-primary relative inline-block">
                                    guesswork
                                    <svg className="absolute -bottom-1.5 left-0 w-full h-1.5" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-sm text-[#64748B] max-w-lg leading-relaxed font-medium">
                                Real tutors. Verified credentials. Direct contact. Connect with teachers who actually deliver results.
                            </p>
                        </div>

                        {/* Search Card - Compact */}
                        <div className="bg-white rounded-none shadow-none border border-slate-200 p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-10 gap-3 mb-4">
                                <div className="md:col-span-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Subject</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-none text-xs font-bold bg-slate-50/50 appearance-none focus:border-primary outline-none transition-all"
                                            value={searchData.subject}
                                            onChange={(e) => setSearchData({ ...searchData, subject: e.target.value })}
                                        >
                                            <option value="">Select subject</option>
                                            <option value="math">Mathematics</option>
                                            <option value="english">English</option>
                                            <option value="physics">Physics</option>
                                        </select>
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Search className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Class</label>
                                    <select
                                        className="w-full h-10 px-3 border border-slate-200 rounded-none text-xs font-bold bg-slate-50/50 appearance-none focus:border-primary outline-none transition-all"
                                        value={searchData.classLevel}
                                        onChange={(e) => setSearchData({ ...searchData, classLevel: e.target.value })}
                                    >
                                        <option value="">Select class</option>
                                        <option value="ssc">SSC</option>
                                        <option value="hsc">HSC</option>
                                        <option value="university">University</option>
                                    </select>
                                </div>
                                <div className="md:col-span-4 flex items-end gap-2">
                                    <div className="flex-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Area</label>
                                        <input
                                            type="text"
                                            placeholder="Enter area or city"
                                            className="w-full h-10 px-3 border border-slate-200 rounded-none text-xs font-bold bg-slate-50/50 outline-none focus:border-primary transition-all"
                                            value={searchData.location}
                                            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="h-10 px-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-slate-900 transition-all flex items-center gap-2 shrink-0"
                                    >
                                        <Search className="w-3.5 h-3.5" />
                                        <span>Find</span>
                                    </button>
                                </div>
                            </form>

                            <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span>Verified</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                    <MessageCircle className="w-3 h-3 text-blue-600" />
                                    <span>Direct</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                    <Users className="w-3 h-3 text-teal-600" />
                                    <span>No Fees</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Compact Tutor Card & Stats */}
                    <div className="lg:col-span-5 space-y-4 lg:translate-y-[60px]">
                        {/* Featured Tutor Card - Slimmer */}
                        <div className="bg-white rounded-none shadow-none border border-slate-200 p-6 relative">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-slate-100 text-slate-900 flex items-center justify-center rounded-none shrink-0 border border-slate-200">
                                    <TutorIcon className="w-7 h-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{tutorPreview.name}</h3>
                                        <div className="flex items-center gap-1 text-slate-900 font-bold text-[9px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-none border border-slate-200">
                                            <CheckCircle className="w-2.5 h-2.5" />
                                            <span>Verified</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500">{tutorPreview.subjects} • {tutorPreview.location}</p>
                                    <p className="text-xs italic text-slate-400 mt-1.5">"{tutorPreview.style}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1 mt-6 pt-4 border-t border-slate-50 text-center">
                                <div>
                                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                                        <Star size={12} className="fill-current" />
                                        <span className="font-black text-slate-900 text-sm">{tutorPreview.rating}</span>
                                    </div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">({tutorPreview.reviews})</p>
                                </div>
                                <div>
                                    <div className="font-black text-primary text-sm mb-0.5">{tutorPreview.fee}/mo</div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Starting</p>
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 text-sm mb-0.5">12+</div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Taught</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/tutors')}
                                className="w-full mt-6 h-10 border border-slate-900 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-slate-900 hover:text-white transition-all group"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    View Profile
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </span>
                            </button>
                        </div>

                        {/* Platform Stats Grid - More Compact */}
                        <div className="bg-slate-100/50 border border-slate-200 rounded-none p-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-slate-200 rounded-none flex items-center justify-center mx-auto mb-2 border border-slate-300">
                                        <Users className="w-4 h-4 text-slate-900" />
                                    </div>
                                    <div className="text-lg font-black text-slate-900 leading-none mb-0.5">47</div>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">Matched Today</p>
                                </div>
                                <div className="text-center border-x border-slate-200 px-2">
                                    <div className="w-8 h-8 bg-slate-200 rounded-none flex items-center justify-center mx-auto mb-2 border border-slate-300">
                                        <TutorIcon className="w-4 h-4 text-slate-900" />
                                    </div>
                                    <div className="text-lg font-black text-slate-900 leading-none mb-0.5">23</div>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">New Weekly</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-slate-200 rounded-none flex items-center justify-center mx-auto mb-2 border border-slate-300">
                                        <Zap className="w-4 h-4 text-slate-900" />
                                    </div>
                                    <div className="text-lg font-black text-slate-900 leading-none mb-0.5">18m</div>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">Response Time</p>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Indicators - Small */}

                    </div>
                </div>

                {/* Bottom Features Row - Reduced Spacing */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-0.5">Verified</h4>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Credential checked tutors.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-0.5">Direct</h4>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Message and connect.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-0.5">No Fees</h4>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Direct pay to tutors.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-0.5">Proven</h4>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Delivering real results.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;