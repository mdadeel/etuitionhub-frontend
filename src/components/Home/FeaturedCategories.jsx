import { 
    Calculator, 
    FlaskConical, 
    Languages, 
    Palette, 
    Monitor, 
    Briefcase, 
    Music, 
    Globe,
    ArrowUpRight
} from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * FeaturedCategories Component
 * Technical Emerald Minimalism Refactor
 */
const FeaturedCategories = () => {
    const categories = [
        { icon: Calculator, label: "Mathematics", count: "1,200+ Tutors" },
        { icon: FlaskConical, label: "Physics & Science", count: "850+ Tutors" },
        { icon: Languages, label: "English & Languages", count: "2,000+ Tutors" },
        { icon: Palette, label: "Arts & Humanities", count: "450+ Tutors" },
        { icon: Monitor, label: "ICT & Programming", count: "600+ Tutors" },
        { icon: Briefcase, label: "Business Studies", count: "500+ Tutors" },
        { icon: Music, label: "Music & Dance", count: "120+ Tutors" },
        { icon: Globe, label: "Religious Studies", count: "300+ Tutors" },
    ];

    return (
        <section className="py-32 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Categories</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase leading-[0.9]">
                            Subject <br />
                            <span className="text-muted-foreground">Specializations</span>
                        </h2>
                    </div>
                    <Button variant="outline" asChild size="lg" className="h-12 px-8 text-xs font-bold tracking-widest uppercase rounded-lg border-2">
                        <Link to="/tuitions">
                            View All <ArrowUpRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            to={`/tuitions?category=${cat.label}`}
                            key={idx}
                            className="group relative glass-card p-6 rounded-xl"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-4 group-hover:-translate-y-1 transition-transform duration-500">
                                    <cat.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-base font-bold text-foreground transition-colors leading-tight">
                                    {cat.label}
                                </h3>
                                <p className="text-[10px] font-medium text-muted-foreground mt-1">
                                    {cat.count}
                                </p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
