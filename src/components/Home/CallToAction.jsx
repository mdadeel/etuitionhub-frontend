import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppleBadge, AppleCard } from '../shared/AppleUI';

const CallToAction = () => {
    return (
        <section className="py-40 bg-background overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <AppleCard className="relative p-12 md:p-24 overflow-hidden border-none bg-foreground text-background" data-aos="zoom-in">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1500&q=80"
                            alt="Students learning together"
                            className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-8">
                            <Sparkles size={16} className="text-primary animate-pulse" />
                            <AppleBadge variant="primary">Ready to Start?</AppleBadge>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 leading-[0.95]">
                            Your next chapter <br />
                            <span className="opacity-30">starts here.</span>
                        </h2>
                        
                        <p className="text-xl opacity-60 mb-12 leading-relaxed tracking-tight font-medium">
                            Join thousands of students and tutors across Bangladesh who have found their perfect match on e-TuitionBD.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button asChild className="h-16 px-10 rounded-2xl text-sm font-bold bg-background text-foreground hover:opacity-90 transition-all active:scale-[0.98]">
                                <Link to="/register" className="flex items-center gap-3">
                                    Create Your Profile <ArrowRight size={18} />
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild className="h-16 px-10 rounded-2xl text-sm font-bold text-background/50 hover:text-background hover:bg-background/10 transition-all">
                                <Link to="/about">
                                    Learn More
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="absolute bottom-12 right-12 hidden lg:block text-right">
                        <div className="text-4xl font-bold tracking-tighter mb-2">10,000+</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Successful Connections</div>
                    </div>
                </AppleCard>
            </div>
        </section>
    );
};

export default CallToAction;
