import { 
    Calculator, 
    FlaskConical, 
    Languages, 
    Palette, 
    Monitor, 
    Briefcase, 
    ArrowRight
} from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
    { icon: Calculator, label: "Mathematics", count: "From basic arithmetic to advanced calculus", bg: "bg-blue-50/50", iconBg: "bg-blue-100", color: "text-blue-600" },
    { icon: FlaskConical, label: "Science", count: "Explore the world through experiments", bg: "bg-orange-50/50", iconBg: "bg-orange-100", color: "text-orange-600" },
    { icon: Languages, label: "English", count: "Language is power, master it", bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", color: "text-indigo-600" },
    { icon: Monitor, label: "ICT", count: "Digital skills for a brighter future", bg: "bg-sky-50/50", iconBg: "bg-sky-100", color: "text-sky-600" },
    { icon: Briefcase, label: "Business", count: "Learn, adapt, and lead with confidence", bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", color: "text-emerald-600" },
    { icon: Palette, label: "Arts", count: "Creativity shapes the future", bg: "bg-pink-50/50", iconBg: "bg-pink-100", color: "text-pink-600" },
];

const FeaturedCategories = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <section ref={ref} className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                            SUBJECTS <span className="text-primary italic">WITHOUT LIMITS.</span>
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <Button variant="link" asChild className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors p-0 gap-2">
                            <Link to="/tuitions">
                                View All Subjects <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {categories.map((cat, idx) => (
                        <motion.div key={idx} variants={cardVariants}>
                            <Link 
                                to={`/tuitions?q=${encodeURIComponent(cat.label)}`} 
                                className={`group relative block h-full overflow-hidden rounded-[2.5rem] border border-border/40 transition-all duration-300 p-8 ${cat.bg} hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:bg-white`}
                            >
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-8 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10`}>
                                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight mb-3 uppercase">{cat.label}</h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                        {cat.count}
                                    </p>
                                </div>
                                
                                {/* Decorative elements that appear on hover */}
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedCategories;

