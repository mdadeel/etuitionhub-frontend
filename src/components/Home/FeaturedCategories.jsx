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
    { icon: Calculator, label: "Mathematics", count: "SSC & HSC", span: "md:col-span-2 md:row-span-2", bg: "bg-primary/10", text: "Master advanced calculus and algebra with board-specific experts." },
    { icon: FlaskConical, label: "Science", count: "Physics & Chemistry", span: "md:col-span-1 md:row-span-1", bg: "bg-orange-500/10", text: "Conceptual learning for future engineers." },
    { icon: Languages, label: "English", count: "IELTS & Board", span: "md:col-span-1 md:row-span-1", bg: "bg-blue-500/10", text: "Fluency and grammar mastery." },
    { icon: Monitor, label: "ICT", count: "Programming", span: "md:col-span-1 md:row-span-2", bg: "bg-purple-500/10", text: "Python, C++, and Web Development basics." },
    { icon: Briefcase, label: "Business", count: "Commerce", span: "md:col-span-1 md:row-span-1", bg: "bg-green-500/10", text: "Accounting and Finance specialized help." },
    { icon: Palette, label: "Arts", count: "Humanities", span: "md:col-span-1 md:row-span-1", bg: "bg-pink-500/10", text: "History, Geography, and Fine Arts." },
];

const FeaturedCategories = () => {
    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight uppercase">
                            SUBJECTS <span className="text-primary italic">WITHOUT LIMITS.</span>
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="text-xs font-black uppercase tracking-widest hover:bg-transparent p-0">
                        <Link to="/tuitions" className="flex items-center gap-2 group">
                            Explore All <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowUpRight className="w-4 h-4" /></div>
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <Link 
                            to={`/tuitions?q=${encodeURIComponent(cat.label)}`} 
                            key={idx}
                            className={`group relative overflow-hidden rounded-[2rem] border border-border/40 transition-all hover:shadow-apple-xl p-8 ${cat.bg}`}
                        >
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-apple-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <cat.icon className="w-5 h-5 text-primary" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight mb-2 uppercase">{cat.label}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4">{cat.count}</p>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                    {cat.text}
                                </p>
                            </div>
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                    <ArrowUpRight size={14} />
                                </div>
                            </div>
                            
                            {/* Abstract Vector Decoration */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
