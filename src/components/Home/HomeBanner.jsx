import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Search, MapPin, GraduationCap, CheckCircle, Clock, Users, Star, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const tutorPreview = {
    name: "Rahim Ahmed",
    subjects: "Math, Physics",
    rating: 4.9,
    fee: "৳5,000",
    location: "Dhaka, Mirpur",
    verified: true,
    responseTime: "Usually replies in 15 min",
    completedSessions: "120+ classes",
    style: "Explains concepts visually"
};

const stats = [
    { label: "Students matched today", value: "47" },
    { label: "New tutors this week", value: "23" },
    { label: "Avg response time", value: "18 min" }
];

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
        <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT - Larger, stronger */}
                    <div className="lg:col-span-7 space-y-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-sm font-medium text-green-700">2,500+ verified tutors available</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                            Find the right tutor without the <span className="text-blue-600">guesswork</span>
                        </h1>

                        <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                            Real tutors, verified credentials, direct contact. Whether it's SSC, HSC, or University preparation — connect with teachers who actually deliver results.
                        </p>

                        {/* Search - slightly bigger */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="md:col-span-1">
                                    <select
                                        className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                        value={searchData.subject}
                                        onChange={(e) => setSearchData({...searchData, subject: e.target.value})}
                                    >
                                        <option value="">Subject</option>
                                        <option value="math">Mathematics</option>
                                        <option value="english">English</option>
                                        <option value="physics">Physics</option>
                                        <option value="chemistry">Chemistry</option>
                                        <option value="biology">Biology</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <select
                                        className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                        value={searchData.classLevel}
                                        onChange={(e) => setSearchData({...searchData, classLevel: e.target.value})}
                                    >
                                        <option value="">Class</option>
                                        <option value="ssc">SSC</option>
                                        <option value="hsc">HSC</option>
                                        <option value="university">University</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <Input
                                        type="text"
                                        placeholder="Area"
                                        className="h-[46px] px-4 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                        value={searchData.location}
                                        onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <button
                                        type="submit"
                                        className="w-full h-[46px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                    >
                                        Find Tutor
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Trust indicators - cleaner */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Verified tutors</span>
                            </span>
                            <span className="text-slate-300">·</span>
                            <span>Direct contact</span>
                            <span className="text-slate-300">·</span>
                            <span>No middleman</span>
                        </div>
                    </div>

                    {/* RIGHT - Realistic stacked content */}
                    <div className="lg:col-span-5 space-y-4 hidden lg:block">
                        {/* Featured tutor preview - more detailed */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-slate-900">{tutorPreview.name}</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Verified</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">{tutorPreview.subjects} · {tutorPreview.location}</p>
                                    <p className="text-xs text-slate-600 italic">"{tutorPreview.style}"</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="font-semibold text-slate-900">{tutorPreview.rating}</span>
                                    </div>
                                    <span className="text-blue-600 font-semibold">{tutorPreview.fee}/mo</span>
                                </div>
                                <button
                                    onClick={() => navigate('/tutors')}
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    View profile →
                                </button>
                            </div>
                        </div>

                        {/* Activity stats - alive feeling */}
                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-xs text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick trust snippets */}
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{tutorPreview.responseTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span>{tutorPreview.completedSessions}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <MessageCircle className="w-4 h-4 text-slate-400" />
                                <span>12 inquiries today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;