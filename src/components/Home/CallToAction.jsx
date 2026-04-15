import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

/**
 * CallToAction Component
 * Technical Emerald Minimalism Refactor
 */
const CallToAction = () => {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    
                    <div className="order-2 lg:order-1 relative group">
                        <div className="absolute -inset-1 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all duration-700 opacity-50"></div>
                        <div className="relative border-4 border-foreground overflow-hidden bg-muted">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Platform Activity"
                                className="w-full object-cover h-[500px] grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                            />
                            
                            {/* Technical Overlay */}
                            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none"></div>
                            <div className="absolute bottom-8 left-8 p-8 bg-background border-2 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] max-w-xs hidden sm:block">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 border-2 border-background bg-muted overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="font-black text-lg tabular-nums">1.2K+</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground leading-relaxed">
                                    New specialized tutors active in the system this month.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-6 block">Converge</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-[0.85] mb-10">
                            Scale Your <br />
                            <span className="text-primary italic">Learning</span> <br />
                            Velocity.
                        </h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground mb-12 max-w-lg leading-relaxed">
                            Whether seeking guidance or sharing knowledge, we provide the industrial-strength platform for academic advancement. Verified, secure, and precise.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="h-16 px-10 text-[11px] font-black tracking-[0.2em] uppercase rounded-none">
                                <Link to="/register" className="flex items-center gap-2">
                                    Initialize Account <Zap size={14} className="fill-current" />
                                </Link>
                            </Button>
                            <Button variant="outline" asChild size="lg" className="h-16 px-10 text-[11px] font-black tracking-[0.2em] uppercase rounded-none border-2">
                                <Link to="/about">
                                    System Overview
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-20 flex flex-wrap items-center gap-10 opacity-30 grayscale contrast-125">
                            <span className="font-black text-2xl tracking-tighter">UDEMY</span>
                            <span className="font-black text-2xl tracking-tighter">COURSERA</span>
                            <span className="font-black text-2xl tracking-tighter">EDX</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
