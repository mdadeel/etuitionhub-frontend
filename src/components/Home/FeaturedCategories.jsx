import {
    Calculator,
    Languages,
    Palette,
    Code,
    BookOpen,
    GraduationCap,
    Award,
    ArrowUpRight,
    Flame,
    TrendingUp,
    Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/* ---------- data ---------- */

const categories = [
    {
        icon: GraduationCap,
        label: "SSC",
        slug: "ssc",
        tag: "Most popular",
        context: "Class 9–10 Preparation",
        accent: "emerald",
    },
    {
        icon: BookOpen,
        label: "HSC",
        slug: "hsc",
        tag: "Trending",
        context: "Higher Secondary Preparation",
        accent: "blue",
    },
    {
        icon: Languages,
        label: "IELTS",
        slug: "ielts",
        tag: null,
        context: "International Exam Prep",
        accent: "orange",
    },
    {
        icon: Languages,
        label: "English",
        slug: "english-medium",
        tag: null,
        context: "Language & Literature",
        accent: "cyan",
    },
    {
        icon: Calculator,
        label: "University",
        slug: "university",
        tag: "High demand",
        context: "Admission Preparation",
        accent: "slate",
    },
    {
        icon: Code,
        label: "Programming",
        slug: "programming",
        tag: null,
        context: "Coding & Web Development",
        accent: "teal",
    },
    {
        icon: Award,
        label: "Admission",
        slug: "admission",
        tag: null,
        context: "University Admission",
        accent: "pink",
    },
    {
        icon: Palette,
        label: "Arts",
        slug: "arts",
        tag: null,
        context: "Creative Studies",
        accent: "rose",
    },
];

const tagConfig = {
    "Most popular": { icon: Flame, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    Trending: { icon: TrendingUp, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    "High demand": { icon: Star, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" },
};

const accentStyles = {
    emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "ring-emerald-500/20", gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent" },
    blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", ring: "ring-blue-500/20", gradient: "from-blue-500/15 via-blue-500/5 to-transparent" },
    orange: { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", ring: "ring-orange-500/20", gradient: "from-orange-500/15 via-orange-500/5 to-transparent" },
    cyan: { text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", ring: "ring-cyan-500/20", gradient: "from-cyan-500/15 via-cyan-500/5 to-transparent" },
    slate: { text: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", ring: "ring-slate-500/20", gradient: "from-slate-500/15 via-slate-500/5 to-transparent" },
    teal: { text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", ring: "ring-teal-500/20", gradient: "from-teal-500/15 via-teal-500/5 to-transparent" },
    pink: { text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", ring: "ring-pink-500/20", gradient: "from-pink-500/15 via-pink-500/5 to-transparent" },
    rose: { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", ring: "ring-rose-500/20", gradient: "from-rose-500/15 via-rose-500/5 to-transparent" },
};

/* ---------- card (3×3 grid, compact) ---------- */

const CategoryCard = ({ cat, index }) => {
    const a = accentStyles[cat.accent] || accentStyles.emerald;
    const tag = cat.tag ? tagConfig[cat.tag] : null;
    const TagIcon = tag?.icon;

    return (
        <Link
            to={`/tutors?subject=${cat.slug}`}
            aria-label={`Browse ${cat.label} tutors`}
            className="group relative block opacity-0 animate-scale-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            style={{ animationDelay: `${100 + index * 50}ms` }}
        >
            <div
                className={cn(
                    "relative h-full overflow-hidden rounded-lg border border-border/70 bg-card",
                    "transition-all duration-300 ease-out",
                    "hover:shadow-premium-md",
                    "active:scale-[0.985]"
                )}
            >
                {/* Soft accent gradient on hover */}
                <div
                    className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0",
                        "transition-opacity duration-500 group-hover:opacity-100",
                        a.gradient
                    )}
                />

                {/* Border + ring accent on hover */}
                <div
                    className={cn(
                        "pointer-events-none absolute inset-0 rounded-lg border border-transparent",
                        "transition-colors duration-300",
                        "group-hover:[border-color:var(--tw-border)]",
                        a.border
                    )}
                />
                <div
                    className={cn(
                        "pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent",
                        "transition-all duration-300 group-hover:ring-2",
                        a.ring
                    )}
                />

                {/* Tag badge — top right */}
                {tag && TagIcon && (
                    <span
                        className={cn(
                            "absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full border backdrop-blur-sm",
                            "p-1 md:px-1.5 md:py-0.5",
                            tag.className
                        )}
                        title={cat.tag}
                    >
                        <TagIcon className="size-2.5 md:size-2" />
                        <span className="hidden md:inline text-[8px] font-bold uppercase tracking-wider">{cat.tag}</span>
                    </span>
                )}

                <div className="relative z-10 flex h-full flex-col p-3 md:p-4">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-2.5 mb-2 md:mb-3 min-w-0">
                        <div
                            className={cn(
                                "flex shrink-0 items-center justify-center rounded-lg border",
                                "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]",
                                "size-8 md:size-9",
                                a.bg,
                                a.border
                            )}
                        >
                            <cat.icon className={cn("size-4 md:size-4.5", a.text)} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="line-clamp-1 font-heading font-bold tracking-tight text-foreground leading-tight text-sm md:text-base">
                                {cat.label}
                            </h3>
                        </div>
                    </div>

                    {/* Context */}
                    <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[10px] md:text-xs text-muted-foreground leading-snug">
                            {cat.context}
                        </p>
                    </div>

                    {/* Footer: link */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 md:pt-2.5">
                        <span className="text-[10px] md:text-[11px] font-bold text-foreground">
                            Browse tutors
                        </span>
                        <ArrowUpRight className={cn("size-3 ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5", a.text)} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

/* ---------- section ---------- */

const FeaturedCategories = () => {
    return (
        <section className="relative overflow-hidden bg-card py-12 md:py-16">
            <div className="relative z-10 w-full px-4 md:px-6 lg:px-8">
                {/* Compact header */}
                <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
                    <div
                        className="max-w-2xl opacity-0 animate-fade-in-up"
                        style={{ animationDelay: "80ms" }}
                    >
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1">
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                Browse by subject
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight tracking-tight text-foreground">
                            Find your <span className="text-primary">subject</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
                            From school prep to university coaching — pick a category to start.
                        </p>
                    </div>

                    <Link
                        to="/tutors"
                        className="group inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-premium md:self-end"
                    >
                        View all
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-[-8deg]" />
                    </Link>
                </div>

                {/* 3×3 grid (8 cards fill 8 of 9 cells; last cell is a "view all" tile) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {categories.map((cat, idx) => (
                        <CategoryCard key={cat.slug} cat={cat} index={idx} />
                    ))}

                    {/* 9th cell: "View all subjects" tile */}
                    <Link
                        to="/tutors"
                        className="group relative block opacity-0 animate-scale-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
                        style={{ animationDelay: `${100 + categories.length * 50}ms` }}
                    >
                        <div
                            className={cn(
                                "relative flex h-full flex-col p-3 md:p-4 overflow-hidden rounded-lg border border-dashed border-border bg-background/40",
                                "transition-all duration-300 ease-out",
                                "hover:border-primary/40 hover:bg-primary/5 hover:shadow-premium-md",
                                "active:scale-[0.985]"
                            )}
                        >
                            <div className="flex items-center gap-2.5 mb-2 md:mb-3 min-w-0">
                                <div className="flex shrink-0 size-8 md:size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
                                    <ArrowUpRight className="size-4 md:size-4.5" strokeWidth={2.5} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-heading font-bold tracking-tight text-foreground leading-tight text-sm md:text-base">
                                        View all
                                    </h3>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] md:text-xs text-muted-foreground leading-snug">
                                    See every subject
                                </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 md:pt-2.5">
                                <span className="text-[10px] md:text-[11px] font-bold text-primary group-hover:underline">Explore options</span>
                                <ArrowUpRight className="size-3 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
