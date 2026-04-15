import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";

/**
 * Newsletter Component
 * Technical Emerald Minimalism Refactor
 */
const Newsletter = () => {
    return (
        <section className="py-32 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="relative bg-foreground dark:bg-muted text-background dark:text-foreground overflow-hidden p-12 lg:p-24 border-8 border-primary/20 shadow-[20px_20px_0px_0px_oklch(var(--primary))]">
                    
                    {/* Technical Grid Background */}
                    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
                         style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 0), linear-gradient(currentColor 1px, transparent 0)', backgroundSize: '30px 30px' }}>
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Stay Synchronized</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-10">
                            Receive Critical <br />
                            <span className="text-primary italic">Updates</span>
                        </h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-background/60 dark:text-muted-foreground mb-12 max-w-xl leading-relaxed">
                            Get the latest tuition opportunities, tutor strategies, and platform evolution delivered directly to your terminal. Zero overhead.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-0 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative flex-grow">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input
                                    type="email"
                                    placeholder="ENTER_EMAIL_ADDRESS"
                                    className="h-16 pl-16 pr-6 bg-background text-foreground border-none rounded-none text-[11px] font-black tracking-widest uppercase focus-visible:ring-primary placeholder:opacity-30"
                                    required
                                />
                            </div>
                            <Button className="h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] tracking-[0.2em] uppercase rounded-none transition-all hover:translate-x-1 group">
                                Subscribe <Send size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-12 right-12 hidden lg:block opacity-20">
                        <div className="text-[120px] font-black tracking-tighter leading-none select-none">RSS</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
