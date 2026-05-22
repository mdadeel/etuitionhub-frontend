import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Search, ShieldCheck, CheckCircle, MessageCircle, Users, GraduationCap, Star, Clock, Heart } from "lucide-react";
import { Badge, Button, Card, Avatar, SectionHeader } from '@/components/ui';

const tutorPreview = {
    name: "Rahim Ahmed",
    subjects: "Mathematics, Physics",
    rating: 4.9,
    reviews: 128,
    fee: "৳5,000",
    location: "Dhaka, Mirpur",
    verified: true,
    responseTime: "Usually replies in 15 min",
    completedSessions: "12+ Students taught",
    style: "Explains concepts visually",
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
        <section className="bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT - Emotional Content & Search */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Trust Badge */}
                        <Badge variant="primary">
                            <ShieldCheck className="w-4 h-4" />
                            2,500+ verified tutors across Bangladesh
                        </Badge>

                        {/* Editorial Headline */}
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-6xl font-heading text-foreground tracking-tight leading-[0.95]">
                                Your child is in
                                <span className="block text-[#2563EB]">safe hands.</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-body">
                                Real tutors. Verified credentials. Direct connection. We help you find teachers who genuinely care about your child's academic journey.
                            </p>
                        </div>

                        {/* Search Interface */}
                        <Card variant="elevated" className="p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-5">
                                <div className="md:col-span-3">
                                    <label className="text-xs font-medium text-foreground mb-1.5 block">Subject</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-11 pl-3 pr-8 border border-border rounded-lg text-sm font-medium bg-card text-foreground appearance-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-300"
                                            value={searchData.subject}
                                            onChange={(e) => setSearchData({ ...searchData, subject: e.target.value })}
                                        >
                                            <option value="">Select subject</option>
                                            <option value="math">Mathematics</option>
                                            <option value="english">English</option>
                                            <option value="physics">Physics</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Search className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-xs font-medium text-foreground mb-1.5 block">Class Level</label>
                                    <select
                                        className="w-full h-11 px-3 border border-border rounded-lg text-sm font-medium bg-card text-foreground appearance-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-300"
                                        value={searchData.classLevel}
                                        onChange={(e) => setSearchData({ ...searchData, classLevel: e.target.value })}
                                    >
                                        <option value="">Select class</option>
                                        <option value="ssc">SSC</option>
                                        <option value="hsc">HSC</option>
                                        <option value="university">University</option>
                                    </select>
                                </div>
                                <div className="md:col-span-4 flex items-end gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-foreground mb-1.5 block">Location</label>
                                        <input
                                            type="text"
                                            placeholder="Enter area or city"
                                            className="w-full h-11 px-3 border border-border rounded-lg text-sm font-medium bg-card text-foreground outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-300 placeholder:text-muted-foreground"
                                            value={searchData.location}
                                            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit">
                                        <Search className="w-4 h-4" />
                                        <span>Search</span>
                                    </Button>
                                </div>
                            </form>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                                    <span>Verified credentials</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MessageCircle className="w-4 h-4 text-[#2563EB]" />
                                    <span>Direct messaging</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Users className="w-4 h-4 text-[#2563EB]" />
                                    <span>No platform fees</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT - Tutor Preview & Trust Signals */}
                    <div className="lg:col-span-5 space-y-6 lg:translate-y-4">
                        {/* Featured Tutor Card */}
                        <Card variant="elevated" hover className="p-6 relative">
                            <Badge variant="primary" className="absolute -top-2 -right-2">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                            </Badge>

                            <div className="flex items-start gap-4">
                                <Avatar size="lg" verified={tutorPreview.verified} alt={tutorPreview.name} />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-heading text-foreground tracking-tight mb-1">{tutorPreview.name}</h3>
                                    <p className="text-sm font-medium text-muted-foreground">{tutorPreview.subjects}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{tutorPreview.location}</p>
                                </div>
                            </div>

                            <p className="text-sm italic text-muted-foreground mt-4 px-1">"{tutorPreview.style}"</p>

                            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-[#2563EB] mb-1">
                                        <Star size={14} className="fill-current" />
                                        <span className="font-heading text-lg text-foreground">{tutorPreview.rating}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">({tutorPreview.reviews})</p>
                                </div>
                                <div className="text-center border-x border-border">
                                    <div className="font-heading text-lg text-foreground mb-1">{tutorPreview.fee}</div>
                                    <p className="text-xs text-muted-foreground">per month</p>
                                </div>
                                <div className="text-center">
                                    <div className="font-heading text-lg text-foreground mb-1">12+</div>
                                    <p className="text-xs text-muted-foreground">students taught</p>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-6">
                                View Full Profile
                            </Button>
                        </Card>

                        {/* Platform Stats */}
                        <Card variant="subtle" className="p-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center mx-auto mb-3 border border-border shadow-sm">
                                        <Users className="w-5 h-5 text-[#2563EB]" />
                                    </div>
                                    <div className="text-xl font-heading text-foreground leading-none mb-1">47</div>
                                    <p className="text-xs text-muted-foreground">matched today</p>
                                </div>
                                <div className="text-center border-x border-border">
                                    <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center mx-auto mb-3 border border-border shadow-sm">
                                        <GraduationCap className="w-5 h-5 text-[#2563EB]" />
                                    </div>
                                    <div className="text-xl font-heading text-foreground leading-none mb-1">23</div>
                                    <p className="text-xs text-muted-foreground">new this week</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center mx-auto mb-3 border border-border shadow-sm">
                                        <Clock className="w-5 h-5 text-[#2563EB]" />
                                    </div>
                                    <div className="text-xl font-heading text-foreground leading-none mb-1">18m</div>
                                    <p className="text-xs text-muted-foreground">response time</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Bottom Trust Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-10 border-t border-border">
                    {[
                        { icon: CheckCircle, title: "Verified", desc: "Credential-checked tutors you can trust." },
                        { icon: MessageCircle, title: "Direct", desc: "Message and connect directly." },
                        { icon: Users, title: "No Fees", desc: "Direct payment to tutors." },
                        { icon: Heart, title: "Proven", desc: "Delivering real academic results." }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-border">
                                <feature.icon className="w-4 h-4 text-[#2563EB]" />
                            </div>
                            <div>
                                <h4 className="font-heading text-sm text-foreground mb-1">{feature.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;
