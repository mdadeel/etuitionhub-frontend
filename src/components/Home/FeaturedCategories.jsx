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

/**
 * FeaturedCategories Component
 * Refactored to "Apple macOS App Icons Grid"
 * Features: High-precision layout, compact metadata, Apple Blue interactive states.
 */
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
        <section className="py-24 bg-white dark:bg-apple-gray-900 border-b border-apple-gray-100 dark:border-apple-gray-800">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-apple-blue mb-3 block">Categories</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-apple-gray-900 dark:text-white leading-tight">
                            Subject Directory. <br />
                            <span className="text-apple-gray-400">Node Classes.</span>
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="p-0 h-auto text-[11px] font-bold tracking-widest uppercase text-apple-blue hover:text-apple-blue/80 hover:bg-transparent group">
                        <Link to="/tuitions" className="flex items-center gap-2">
                            Explore All Categories <ArrowUpRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            to={`/tuitions?q=${encodeURIComponent(cat.label)}`}
                            key={idx}
                            className="group apple-card p-6 bg-white dark:bg-apple-gray-800 border-apple-gray-200 dark:border-apple-gray-700 hover:border-apple-blue/50 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Subtle hover background glow */}
                            <div className="absolute inset-0 bg-apple-blue/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6">
                                    <cat.icon className="w-8 h-8 text-apple-gray-900 dark:text-white group-hover:text-apple-blue transition-colors duration-300" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[15px] font-bold text-apple-gray-900 dark:text-white tracking-tight leading-tight">
                                    {cat.label}
                                </h3>
                                <p className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-tight mt-1.5">
                                    {cat.count}
                                </p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                                <ArrowUpRight className="w-3.5 h-3.5 text-apple-blue" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
