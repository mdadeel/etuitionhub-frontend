import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { trackEvent } from '../../services/analytics';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle, 
  MessageCircle, 
  Users, 
  GraduationCap, 
  Heart, 
  BookOpen, 
  MapPin,
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FilterSelect from '@/components/shared/FilterSelect';
import LocationFilter from '@/components/shared/LocationFilter';
import TutorCard from '@/components/shared/TutorCard';
import { cn } from "@/lib/utils";


const HomeBanner = () => {
    const navigate = useNavigate();

    const { data: tutorsData } = useQuery({
        queryKey: ['tutors', 'hero'],
        queryFn: async () => {
            const res = await api.get('/api/tutors?page=1&limit=3&sort=ratings');
            const raw = res.data?.data || res.data?.tutors || res.data;
            return Array.isArray(raw) ? raw.slice(0, 3) : [];
        },
        staleTime: 120_000,
    });

    const tutors = tutorsData || [];

    const [searchData, setSearchData] = useState({
        subject: '',
        classLevel: '',
        location: ''
    });

    const { data: availability } = useQuery({
        queryKey: ['tutors', 'availability', searchData.location],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchData.location) params.append('city', searchData.location);
            const res = await api.get(`/api/tutors/availability?${params.toString()}`);
            return res.data;
        },
        staleTime: 60_000,
        refetchInterval: 60_000,
    });
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (tutors.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tutors.length);
        }, 5000); 
        return () => clearInterval(interval);
    }, [tutors.length]);

    const subjects = [
        "Mathematics", "English", "Physics", "Chemistry", "Biology", "ICT", "Accounting"
    ];

    const classes = [
        "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
        "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
        "SSC", "HSC", "Admission", "English Medium"
    ];

const handleSearch = (e) => {
        if (e) e.preventDefault();
        trackEvent('home_search', `subject:${searchData.subject || 'any'}`, 1);
        const params = new URLSearchParams();
        if (searchData.subject) params.set('subject', searchData.subject);
        if (searchData.classLevel) params.set('class', searchData.classLevel);
        if (searchData.location) params.set('area', searchData.location);
        navigate(`/tutors?${params.toString()}`);
    };

    return (
        <section className="relative min-h-[85vh] flex items-center bg-background overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/herobackground.png)' }}>
            {/* Soft overlay for readability */}
            <div className="absolute inset-0 bg-background/85 backdrop-blur-[4px] z-0" />
            {/* Soft radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 py-8 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* LEFT - Content & Search */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-6">
                            <div>
                                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground/90 font-bold tracking-tight">
                                    🇧🇩 Bangladesh's #1 Tutor Marketplace
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
                                    Find Verified <br/>
                                    <span className="text-primary relative inline-block">
                                        Private Tutors
                                        <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9C118.957 4.46788 239.113 1.10912 355 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                                        </svg>
                                    </span> <br/>
                                    Across Bangladesh.
                                </h1>
                                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl font-body font-medium">
                                    Connect with 2,500+ verified expert tutors for personalized home and online lessons. Academic excellence, built on trust.
                                </p>
                            </div>
                        </div>

                        {/* Search Block */}
                        <div>
                            <Card className="p-6 bg-card/90 backdrop-blur-md border-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-xl overflow-visible">
                                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                                    </span>
                                    <span>
                                        {availability ? (
                                            <>
                                                Live: <span className="text-foreground font-bold">{availability.count}</span> expert tutors available{" "}
                                                <span className="text-primary font-bold">
                                                    {availability.scope === "nationwide" ? "nationwide" : `in ${availability.scope}`}
                                                </span>{" "}
                                                right now
                                            </>
                                        ) : (
                                            "Checking live tutor availability..."
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-6 mb-4">
                                    <div className="flex-1 w-full">
                                        <FilterSelect 
                                            label="Subject"
                                            placeholder="Select subject"
                                            icon={BookOpen}
                                            options={subjects}
                                            value={searchData.subject}
                                            onValueChange={(val) => setSearchData({ ...searchData, subject: val })}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FilterSelect 
                                            label="Class Level"
                                            placeholder="Select class"
                                            icon={GraduationCap}
                                            options={classes}
                                            value={searchData.classLevel}
                                            onValueChange={(val) => setSearchData({ ...searchData, classLevel: val })}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <LocationFilter
                                            value={searchData.location}
                                            onChange={(val) => setSearchData({ ...searchData, location: val || '' })}
                                        />
                                    </div>
                                    <div className="w-full md:w-auto mt-2 md:mt-0">
                                        <Button 
                                            type="button"
                                            onClick={handleSearch}
                                            className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 rounded-xl"
                                        >
                                            <Search className="size-4 mr-2" />
                                            <span>Search</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-border/60">
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <CheckCircle className="size-4 text-primary" />
                                        <span>Verified Credentials</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <MessageCircle className="size-4 text-primary" />
                                        <span>Direct Messaging</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <Users className="size-4 text-primary" />
                                        <span>No Platform Fees</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT - Layered tutor card stack */}
                    <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0">
                        <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] h-[260px] sm:h-[310px] md:h-[330px] select-none">
                            {/* Decorative Background Elements for Depth */}
                            <div className="absolute -top-10 -right-10 size-48 bg-primary/10 rounded-full blur-[100px] -z-10" />
                            <div className="absolute -bottom-10 -left-10 size-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
                            
                            {tutors.map((tutor, idx) => {
                                const relativeIndex = (idx - currentIndex + tutors.length) % tutors.length;
                                
                                // Only show the top cards
                                if (relativeIndex > 2) return null;
                                
                                const zIndex = 30 - relativeIndex;
                                const scale = 1 - relativeIndex * 0.05;
                                const translateY = relativeIndex * 16; 
                                const translateX = relativeIndex * 16; 
                                const opacity = 1 - relativeIndex * 0.35;
                                
                                return (
                                    <div
                                        key={tutor._id}
                                        className={cn(
                                            "absolute inset-0 rounded-2xl overflow-hidden bg-card shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-border/80 transition-all duration-500",
                                        )}
                                        style={{
                                            zIndex,
                                            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                                            opacity: opacity
                                        }}
                                    >
                                        <TutorCard tutor={tutor} isBannerPreview={true} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Banner */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/60">
                    {[
                        { label: "Active Tutors", value: "2,500+", icon: Users },
                        { label: "Lessons Taught", value: "45k+", icon: BookOpen },
                        { label: "Happy Parents", value: "15k+", icon: Heart },
                        { label: "Cities Covered", value: "64", icon: MapPin }
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center md:items-start space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center">
                                    <stat.icon size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground leading-none">{stat.value}</p>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeBanner;