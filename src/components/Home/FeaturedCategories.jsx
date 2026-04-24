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
        { icon: Calculator, label: "Mathematics", count: "For SSC & HSC" },
        { icon: FlaskConical, label: "Physics & Science", count: "Board Exam Prep" },
        { icon: Languages, label: "English & Languages", count: "All Boards Covered" },
        { icon: Palette, label: "Arts & Humanities", count: "Creative Learning" },
        { icon: Monitor, label: "ICT & Programming", count: "Digital Skills" },
        { icon: Briefcase, label: "Business Studies", count: "Commerce Focus" },
        { icon: Music, label: "Music & Dance", count: "Extra Curricular" },
        { icon: Globe, label: "Religious Studies", count: "All Religions" },
    ];

    return (
        <section className="py-32 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div className="max-w-xl" data-aos="fade-right">
                        <AppleBadge variant="secondary" className="mb-4">Board Exam Prep</AppleBadge>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                            Every subject. <br />
                            <span className="text-muted-foreground/30">Every board.</span>
                        </h2>
                        <p className="text-muted-foreground mt-4">Expert tutors for Dhaka, Chittagong, Rajshahi, Sylhet, and all education boards in Bangladesh.</p>
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
                            <AppleCard className="p-8 group hover:bg-muted transition-all duration-300">
                                <div className="mb-8">
                                    <cat.icon className="w-10 h-10 text-foreground group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold text-foreground tracking-tight leading-tight">
                                    {cat.label}
                                </h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mt-2">
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
