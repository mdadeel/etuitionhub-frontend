import { Calculator, Languages, Palette, Code, BookOpen, GraduationCap, Award, ArrowRight, Flame, TrendingUp, Star } from "lucide-react";
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const tagConfig = {
    "Most popular": { icon: Flame, variant: "success" },
    "Trending": { icon: TrendingUp, variant: "warning" },
    "High demand": { icon: Star, variant: "primary" },
};

const categories = [
    { icon: GraduationCap, label: "SSC", count: "850+", rating: "4.8", slug: "ssc", tag: "Most popular", context: "Class 9-10 Preparation", accent: "emerald" },
    { icon: BookOpen, label: "HSC", count: "620+", rating: "4.7", slug: "hsc", tag: "Trending", context: "Higher Secondary Preparation", accent: "blue" },
    { icon: Languages, label: "IELTS", count: "340+", rating: "4.6", slug: "ielts", tag: null, context: "International Exam Prep", accent: "orange" },
    { icon: Languages, label: "English", count: "480+", rating: "4.7", slug: "english-medium", tag: null, context: "Language & Literature", accent: "cyan" },
    { icon: Calculator, label: "University", count: "480+", rating: "4.6", slug: "university", tag: "High demand", context: "Admission Preparation", accent: "indigo" },
    { icon: Code, label: "Programming", count: "290+", rating: "4.9", slug: "programming", tag: null, context: "Coding & Web Development", accent: "teal" },
    { icon: Award, label: "Admission", count: "310+", rating: "4.5", slug: "admission", tag: null, context: "University Admission", accent: "pink" },
    { icon: Palette, label: "Arts", count: "180+", rating: "4.6", slug: "arts", tag: null, context: "Creative Studies", accent: "rose" },
];

const accentStyles = {
    emerald: { iconColor: 'text-emerald-500', borderColor: 'border-emerald-500/20', hoverShadow: 'shadow-emerald-500/10' },
    blue: { iconColor: 'text-blue-500', borderColor: 'border-blue-500/20', hoverShadow: 'shadow-blue-500/10' },
    orange: { iconColor: 'text-orange-500', borderColor: 'border-orange-500/20', hoverShadow: 'shadow-orange-500/10' },
    cyan: { iconColor: 'text-cyan-500', borderColor: 'border-cyan-500/20', hoverShadow: 'shadow-cyan-500/10' },
    indigo: { iconColor: 'text-indigo-500', borderColor: 'border-indigo-500/20', hoverShadow: 'shadow-indigo-500/10' },
    teal: { iconColor: 'text-teal-500', borderColor: 'border-teal-500/20', hoverShadow: 'shadow-teal-500/10' },
    pink: { iconColor: 'text-pink-500', borderColor: 'border-pink-500/20', hoverShadow: 'shadow-pink-500/10' },
    rose: { iconColor: 'text-rose-500', borderColor: 'border-rose-500/20', hoverShadow: 'shadow-rose-500/10' },
};

const glowStyles = {
    emerald: 'bg-emerald-500/10 dark:bg-emerald-500/5',
    blue: 'bg-blue-500/10 dark:bg-blue-500/5',
    orange: 'bg-orange-500/10 dark:bg-orange-500/5',
    cyan: 'bg-cyan-500/10 dark:bg-cyan-500/5',
    indigo: 'bg-indigo-500/10 dark:bg-indigo-500/5',
    teal: 'bg-teal-500/10 dark:bg-teal-500/5',
    pink: 'bg-pink-500/10 dark:bg-pink-500/5',
    rose: 'bg-rose-500/10 dark:bg-rose-500/5',
};

const FeaturedCategories = () => {
    return (
        <section className="py-16 md:py-20 bg-card relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-12 md:mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-3xl md:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mb-4">Find your <span className="text-primary">subject</span></h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-body">From school preparation to university-level coaching</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((cat, idx) => {
                        const a = accentStyles[cat.accent] || accentStyles.emerald;
                        const tag = cat.tag ? tagConfig[cat.tag] : null;
                        const TagIcon = tag?.icon;
                        const glowBg = glowStyles[cat.accent] || glowStyles.emerald;

                        return (
                            <Link
                                key={cat.slug}
                                to={`/tutors?subjects=${cat.slug}`}
                                className="block group opacity-0 animate-scale-in"
                                style={{ animationDelay: `${150 + idx * 50}ms` }}
                            >
                                <Card variant="elevated" className="p-5 relative h-full transition-all duration-500 hover:border-primary/30 hover:shadow-xl overflow-hidden">
                                    {/* Ambient Hover Glow Bubble */}
                                    <div className={`absolute -top-12 -left-12 size-24 rounded-full ${glowBg} blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}></div>

                                    {tag && TagIcon && (
                                        <Badge variant={tag.variant} size="xs" className="absolute top-3 right-3 z-10 gap-1 shadow-sm">
                                            <TagIcon className="size-3" /> {cat.tag}
                                        </Badge>
                                    )}

                                    <div className="flex items-center gap-3 mb-4 relative z-10">
                                        <div className={`size-12 flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-muted to-background border ${a.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <cat.icon className={`size-6 ${a.iconColor}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-heading text-base text-foreground tracking-tight leading-tight mb-1">{cat.label}</div>
                                            <div className="text-xs text-muted-foreground leading-tight">{cat.context}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border/50 relative z-10">
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">{cat.count}</div>
                                            <div className="text-[10px] text-muted-foreground">Tutors</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-semibold text-amber-500">{cat.rating}★</div>
                                            <div className="text-[10px] text-muted-foreground">Rating</div>
                                        </div>
                                        <div className="p-1.5 rounded-full bg-muted/80 dark:bg-slate-900 group-hover:bg-primary group-hover:text-white text-muted-foreground transition-all duration-300 group-hover:translate-x-1">
                                            <ArrowRight className="size-3.5" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
