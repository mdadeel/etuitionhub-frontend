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
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/* ---------- data ---------- */

const categories = [
    {
        icon: GraduationCap,
        label: "SSC",
        count: "850+",
        rating: "4.8",
        slug: "ssc",
        tag: "Most popular",
        context: "Class 9–10 Preparation",
        accent: "emerald",
    },
    {
        icon: BookOpen,
        label: "HSC",
        count: "620+",
        rating: "4.7",
        slug: "hsc",
        tag: "Trending",
        context: "Higher Secondary Preparation",
        accent: "blue",
    },
    {
        icon: Languages,
        label: "IELTS",
        count: "340+",
        rating: "4.6",
        slug: "ielts",
        tag: null,
        context: "International Exam Prep",
        accent: "orange",
    },
    {
        icon: Languages,
        label: "English",
        count: "480+",
        rating: "4.7",
        slug: "english-medium",
        tag: null,
        context: "Language & Literature",
        accent: "cyan",
    },
    {
        icon: Calculator,
        label: "University",
        count: "480+",
        rating: "4.6",
        slug: "university",
        tag: "High demand",
        context: "Admission Preparation",
        accent: "indigo",
    },
    {
        icon: Code,
        label: "Programming",
        count: "290+",
        rating: "4.9",
        slug: "programming",
        tag: null,
        context: "Coding & Web Development",
        accent: "teal",
    },
    {
        icon: Award,
        label: "Admission",
        count: "310+",
        rating: "4.5",
        slug: "admission",
        tag: null,
        context: "University Admission",
        accent: "pink",
    },
    {
        icon: Palette,
        label: "Arts",
        count: "180+",
        rating: "4.6",
        slug: "arts",
        tag: null,
        context: "Creative Studies",
        accent: "rose",
    },
];

const tagConfig = {
    "Most popular": { icon: Flame, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    Trending: { icon: TrendingUp, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    "High demand": { icon: Star, className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
};

const accentStyles = {
    emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "ring-emerald-500/20", gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent" },
    blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", ring: "ring-blue-500/20", gradient: "from-blue-500/15 via-blue-500/5 to-transparent" },
    orange: { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", ring: "ring-orange-500/20", gradient: "from-orange-500/15 via-orange-500/5 to-transparent" },
    cyan: { text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", ring: "ring-cyan-500/20", gradient: "from-cyan-500/15 via-cyan-500/5 to-transparent" },
    indigo: { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", ring: "ring-indigo-500/20", gradient: "from-indigo-500/15 via-indigo-500/5 to-transparent" },
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
            to={`/tutors?subjects=${cat.slug}`}
            aria-label={`Browse ${cat.label} tutors`}
            className="group relative block opacity-0 animate-scale-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
            style={{ animationDelay: `${100 + index * 50}ms` }}
        >
            <div
                className={cn(
                    "relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-1 hover:shadow-premium-md",
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
                        "pointer-events-none absolute inset-0 rounded-2xl border border-transparent",
                        "transition-colors duration-300",
                        "group-hover:[border-color:var(--tw-border)]",
                        a.border
                    )}
                />
                <div
                    className={cn(
                        "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent",
                        "transition-all duration-300 group-hover:ring-2",
                        a.ring
                    )}
                />

                {/* Tag badge — top right */}
                {tag && TagIcon && (
                    <span
                        className={cn(
                            "absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm",
                            tag.className
                        )}
                    >
                        <TagIcon className="size-2.5" />
                        {cat.tag}
                    </span>
                )}

                <div className="relative z-10 flex h-full flex-col gap-3 p-4 md:p-5">
                    {/* Icon + label in same line */}
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "flex shrink-0 items-center justify-center rounded-xl border",
                                "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]",
                                "size-10 md:size-11",
                                a.bg,
                                a.border
                            )}
                        >
                            <cat.icon className={cn("size-5", a.text)} strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1 pr-16">
                            <h3 className="truncate font-heading font-black tracking-tight text-foreground leading-tight text-base md:text-lg">
                                {cat.label}
                            </h3>
                            <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5">
                                {cat.context}
                            </p>
                        </div>
                    </div>

                    {/* Footer: stats + view btn in same line */}
                    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-foreground">
                            <span className="flex items-center gap-1">
                                <Users className={cn("size-3", a.text)} />
                                {cat.count} tutors
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-500">
                                <Star className="size-3 fill-amber-400" />
                                {cat.rating}
                            </span>
                        </div>
                        <span
                            className={cn(
                                "inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                                "bg-foreground text-background",
                                "transition-all duration-300 group-hover:gap-1"
                            )}
                        >
                            View
                            <ArrowUpRight className="size-3" strokeWidth={2.5} />
                        </span>
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
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
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
                        <h2 className="text-2xl font-heading font-black leading-[0.95] tracking-tight text-foreground md:text-3xl lg:text-4xl">
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
                        className="group relative block opacity-0 animate-scale-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                        style={{ animationDelay: `${100 + categories.length * 50}ms` }}
                    >
                        <div
                            className={cn(
                                "relative flex h-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-border bg-background/40 p-4 md:p-5",
                                "transition-all duration-300 ease-out",
                                "hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/5 hover:shadow-premium-md",
                                "active:scale-[0.985]"
                            )}
                        >
                            <div className="flex size-10 md:size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
                                <ArrowUpRight className="size-5" strokeWidth={2.5} />
                            </div>
                            <div className="text-center">
                                <h3 className="font-heading font-black tracking-tight text-foreground leading-tight text-base md:text-lg">
                                    View all
                                </h3>
                                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                    See every subject
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
