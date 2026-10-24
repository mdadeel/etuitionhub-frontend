import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { trackEvent } from '../../services/analytics';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle, 
  MessageCircle, 
  Users, 
  GraduationCap, 
  BookOpen, 
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FilterSelect from '@/components/shared/FilterSelect';
import LocationFilter from '@/components/shared/LocationFilter';
import TutorCard from '@/components/shared/TutorCard';
import ParentGuaranteeModal from '@/components/shared/ParentGuaranteeModal';
import { cn } from "@/lib/utils";
import { MOCK_TUTORS, MOCK_AVAILABILITY } from '@/data/mockData';


const HomeBanner = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [guaranteeOpen, setGuaranteeOpen] = useState(false);

    const { data: tutorsData } = useQuery({
        queryKey: ['tutors', 'featured'],
        queryFn: async () => {
            const res = await api.get('/api/tutors?page=1&limit=4&sort=ratings');
            const raw = res.data?.data || res.data?.tutors || res.data;
            return Array.isArray(raw) ? raw.slice(0, 4) : [];
        },
        initialData: MOCK_TUTORS.slice(0, 4),
        select: (data) => data.slice(0, 3),
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
        initialData: MOCK_AVAILABILITY,
        staleTime: 300_000,
        refetchInterval: false,
    });
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextTutor = () => {
        if (tutors.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % tutors.length);
    };

    const handlePrevTutor = () => {
        if (tutors.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + tutors.length) % tutors.length);
    };

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
        <section className="relative min-h-[85vh] flex items-center bg-background overflow-hidden">
            {/* LCP-optimized decorative hero background with WebP + PNG fallback */}
            <picture className="pointer-events-none select-none absolute inset-0 z-0" aria-hidden="true">
                <source srcSet="/images/herobackground.webp" type="image/webp" />
                <img
                    src="/images/herobackground.png"
                    alt=""
                    width={1600}
                    height={1067}
                    fetchPriority="high"
                    decoding="async"
                    className="size-full object-cover object-center"
                />
            </picture>
            {/* Soft overlay for readability */}
            <div className="absolute inset-0 bg-background/85 backdrop-blur-[4px] z-0" />

            <div className="w-full px-4 md:px-6 lg:px-8 relative z-10 py-8 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* LEFT - Content & Search */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground/90 font-bold tracking-tight">
                                    {t('homeBanner.badge')}
                                </Badge>
                                <button
                                    type="button"
                                    onClick={() => setGuaranteeOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer active:scale-95"
                                >
                                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    <span>100% Parent Guarantee · Free Demo · Escrow Safe</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
                                    {t('homeBanner.title_1')} <br/>
                                    <span className="text-primary relative inline-block">
                                        {t('homeBanner.title_2')}
                                        <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9C118.957 4.46788 239.113 1.10912 355 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                                        </svg>
                                    </span> <br/>
                                    {t('homeBanner.title_3')}
                                </h1>
                                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl font-body font-medium">
                                    {availability?.count
                                        ? t('homeBanner.subtitle', { count: availability.count })
                                        : t('homeBanner.subtitle_default')}
                                </p>
                            </div>
                        </div>

                        {/* Search Block */}
                        <div>
                            <Card className="p-6 bg-card/90 backdrop-blur-md border-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-xl overflow-visible">
                                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-success" />
                                    </span>
                                    <span>
                                        {availability ? (
                                            <>
                                                {t('homeBanner.live_prefix')} <span className="text-foreground font-bold">{availability.count}</span> {t('homeBanner.live_suffix')}{" "}
                                                <span className="text-primary font-bold">
                                                    {availability.scope === "nationwide" ? t('homeBanner.live_nationwide') : t('homeBanner.live_in_scope', { scope: availability.scope })}
                                                </span>{" "}
                                                {t('homeBanner.live_right_now')}
                                            </>
                                        ) : (
                                            t('homeBanner.live_checking')
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-6 mb-4">
                                    <div className="flex-1 w-full">
                                        <FilterSelect 
                                            label={t('homeBanner.subject_label')}
                                            placeholder={t('homeBanner.subject_placeholder')}
                                            icon={BookOpen}
                                            options={subjects}
                                            value={searchData.subject}
                                            onValueChange={(val) => setSearchData({ ...searchData, subject: val })}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FilterSelect 
                                            label={t('homeBanner.class_label')}
                                            placeholder={t('homeBanner.class_placeholder')}
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
                                            <span>{t('homeBanner.search_btn')}</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <CheckCircle className="size-4 text-primary" />
                                            <span>{t('tutors.vetted')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <MessageCircle className="size-4 text-primary" />
                                            <span>{t('homeBanner.stat_students')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Users className="size-4 text-primary" />
                                            <span>{t('homeBanner.trusted_by')}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setGuaranteeOpen(true)}
                                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <ShieldCheck size={14} />
                                        <span>Parent Guarantee Policy &rarr;</span>
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT - Featured Verified Tutor Spotlight */}
                    <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center mt-8 lg:mt-0">
                        {tutors.length > 0 && (
                            <div className="w-full max-w-[340px] sm:max-w-[380px] space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
                                    <span className="flex items-center gap-1.5 text-primary">
                                        <ShieldCheck size={14} />
                                        <span>{t('tutors.verified_badge', 'Verified Educator Spotlight')}</span>
                                    </span>
                                    <span className="font-mono text-[11px]">
                                        {currentIndex + 1} / {tutors.length}
                                    </span>
                                </div>

                                <div className="rounded-xl overflow-hidden bg-card border border-border shadow-md">
                                    <TutorCard tutor={tutors[currentIndex]} isBannerPreview={true} />
                                </div>

                                {/* Manual Carousel Controls */}
                                <div className="flex items-center justify-between px-1 pt-1 text-xs">
                                    <div className="flex items-center gap-1">
                                        {tutors.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setCurrentIndex(i)}
                                                aria-label={`View featured tutor ${i + 1}`}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-300",
                                                    currentIndex === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="size-7 rounded-lg"
                                            onClick={handlePrevTutor}
                                            aria-label="Previous tutor"
                                        >
                                            <ChevronLeft size={14} />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="size-7 rounded-lg"
                                            onClick={handleNextTutor}
                                            aria-label="Next tutor"
                                        >
                                            <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ParentGuaranteeModal open={guaranteeOpen} onOpenChange={setGuaranteeOpen} />
        </section>
    );
};

export default HomeBanner;
