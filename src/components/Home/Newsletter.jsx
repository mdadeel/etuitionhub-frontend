import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { AppleCard, AppleInput, AppleBadge } from "../shared/AppleUI";
import { motion, useInView } from 'framer-motion';

const Newsletter = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="pt-16 pb-0 bg-background">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="relative p-12 md:p-24 rounded-[4rem] bg-muted/40 border border-border/50 overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl text-center lg:text-left">
                            <AppleBadge variant="secondary" className="mb-6">Weekly Updates</AppleBadge>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-6 uppercase">
                                THE <span className="text-primary italic">KNOWLEDGE</span> DISPATCH.
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium max-w-sm">
                                Get elite tutor listings and curated exam strategies delivered to your inbox every Monday.
                            </p>
                        </div>

                        <div className="w-full lg:w-1/2 max-w-md">
                            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <AppleInput
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-16 pl-14 pr-6 rounded-2xl bg-white border-2 border-border/50 focus:border-black transition-all text-base font-bold"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest bg-black text-white hover:bg-black/90 shadow-apple-lg transition-all active:scale-[0.98]">
                                    Subscribe <Send size={18} className="ml-3" />
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-2">
                                    Privacy Guaranteed. No Spam Ever.
                                </p>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
