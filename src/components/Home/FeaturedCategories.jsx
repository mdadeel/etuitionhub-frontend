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
import { AppleBadge, AppleCard } from "../shared/AppleUI";

const FeaturedCategories = () => {
    const categories = [
        { icon: Calculator, label: "Mathematics", count: "1,200+ Specialists" },
        { icon: FlaskConical, label: "Physics & Science", count: "850+ Specialists" },
        { icon: Languages, label: "English & Languages", count: "2,000+ Specialists" },
        { icon: Palette, label: "Arts & Humanities", count: "450+ Specialists" },
        { icon: Monitor, label: "ICT & Programming", count: "600+ Specialists" },
        { icon: Briefcase, label: "Business Studies", count: "500+ Specialists" },
        { icon: Music, label: "Music & Dance", count: "120+ Specialists" },
        { icon: Globe, label: "Religious Studies", count: "300+ Specialists" },
    ];

    return (
        <section className="py-32 bg-white dark:bg-apple-gray-950">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div className="max-w-xl" data-aos="fade-right">
                        <AppleBadge variant="secondary" className="mb-4">Directory</AppleBadge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.1]">
                            Explore your interests. <br />
                            <span className="text-black/20 dark:text-white/20">Master your subject.</span>
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="p-0 h-auto text-xs font-bold tracking-widest uppercase text-primary hover:text-primary/80 hover:bg-transparent group" data-aos="fade-left">
                        <Link to="/tuitions" className="flex items-center gap-2">
                            Explore All <ArrowUpRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            to={`/tuitions?q=${encodeURIComponent(cat.label)}`}
                            key={idx}
                            data-aos="fade-up"
                            data-aos-delay={idx * 50}
                        >
                            <AppleCard className="p-8 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300">
                                <div className="mb-8">
                                    <cat.icon className="w-10 h-10 text-black/80 dark:text-white/80 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold text-black dark:text-white tracking-tight leading-tight">
                                    {cat.label}
                                </h3>
                                <p className="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase tracking-[0.1em] mt-2">
                                    {cat.count}
                                </p>
                            </AppleCard>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
