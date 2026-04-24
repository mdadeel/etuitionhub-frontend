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

const categories = [
    { icon: Calculator, label: "Mathematics", count: "SSC & HSC" },
    { icon: FlaskConical, label: "Physics & Science", count: "Board Prep" },
    { icon: Languages, label: "English", count: "All Boards" },
    { icon: Palette, label: "Arts & Humanities", count: "Creative" },
    { icon: Monitor, label: "ICT & Programming", count: "Digital Skills" },
    { icon: Briefcase, label: "Business Studies", count: "Commerce" },
    { icon: Music, label: "Music & Dance", count: "Extra Curricular" },
    { icon: Globe, label: "Religious Studies", count: "All Religions" },
];

const FeaturedCategories = () => {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <AppleBadge variant="secondary" className="mb-3">Board Exam Prep</AppleBadge>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                            Every subject. Every board.
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="text-sm text-primary">
                        <Link to="/tuitions" className="flex items-center gap-2">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <Link to={`/tuitions?q=${encodeURIComponent(cat.label)}`} key={idx}>
                            <AppleCard className="p-6 hover:bg-muted transition-colors">
                                <cat.icon className="w-8 h-8 text-primary mb-4" strokeWidth={1.5} />
                                <h3 className="text-base font-semibold mb-1">{cat.label}</h3>
                                <p className="text-xs text-muted-foreground">{cat.count}</p>
                            </AppleCard>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
