import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { AppleCard, AppleInput } from "../shared/AppleUI";
import { motion, useInView } from 'framer-motion';

const Newsletter = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-16 md:py-24 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <AppleCard className="p-8 md:p-12 bg-muted">
                        <div className="max-w-xl">
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                                Stay updated
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Get new tutor listings and exam tips delivered to your inbox.
                            </p>

                            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                    <AppleInput
                                        type="email"
                                        placeholder="Your email address"
                                        className="h-12 pl-10 pr-4"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="h-12 px-6 rounded-xl font-semibold">
                                    Subscribe <Send size={16} className="ml-2" />
                                </Button>
                            </form>
                        </div>
                    </AppleCard>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
