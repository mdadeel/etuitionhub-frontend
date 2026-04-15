import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Target, Layers, Globe } from "lucide-react";

/**
 * About Page
 * Refactored to "Technical Emerald Minimalism"
 */
const About = () => {
    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-24 border-b border-border pb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Institutional Profile</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] mb-10">
                        Educational <br />
                        <span className="text-muted-foreground">Infrastructure.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-muted-foreground font-bold leading-relaxed max-w-2xl uppercase tracking-tight">
                        Bangladesh's premier neural network connecting academic potential with specialized expertise.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Target size={18} className="text-primary" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Operational Mission</h2>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-loose uppercase tracking-wide">
                            We are engineering a future where quality academic guidance is no longer a geographical privilege.
                            By standardizing the discovery and engagement of educational talent, we ensure every student has access to the specialized intelligence they require.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Layers size={18} className="text-primary" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Value Architecture</h2>
                        </div>
                        <ul className="space-y-6">
                            {[
                                'Verified professional credentials',
                                'Comprehensive subject indexing',
                                'Dynamic scheduling protocols',
                                'Nationwide jurisdictional coverage'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 group">
                                    <div className="w-1.5 h-1.5 bg-primary group-hover:scale-150 transition-transform"></div>
                                    <span className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <footer className="mt-32 pt-16 border-t border-border">
                    <div className="bg-muted/30 p-12 border border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Database size={80} className="text-primary" />
                        </div>
                        <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">Established MMXXIV</p>
                                <p className="text-sm font-black text-foreground uppercase tracking-widest italic group-hover:text-primary transition-colors">
                                    "Standardizing Excellence in National Education"
                                </p>
                            </div>
                            <Badge variant="outline" className="rounded-none border-primary text-primary px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-background">
                                <Globe size={12} className="mr-2" /> GLOBAL_STANDARDS
                            </Badge>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default About;
