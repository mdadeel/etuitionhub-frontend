import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, useInView } from 'framer-motion';

const Newsletter = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section ref={ref} className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative p-12 md:p-20 rounded-[3rem] bg-muted/30 border border-border/50 overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6 uppercase">
                                THE <span className="text-primary italic">KNOWLEDGE</span> <br />
                                DISPATCH.
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium max-w-sm lg:mx-0 mx-auto opacity-70">
                                Get elite tutor listings and curated exam strategies delivered to your inbox every Monday.
                            </p>
                        </div>

                        <div className="flex-1 w-full max-w-md">
                            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative flex-1 group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-16 pl-12 pr-6 rounded-2xl bg-white border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all text-base font-bold shadow-sm"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                                    Join <Send size={18} className="ml-2" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-center lg:text-left text-muted-foreground/60 font-bold uppercase tracking-[0.2em] mt-4 ml-2">
                                Privacy Guaranteed. No Spam Ever.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;

