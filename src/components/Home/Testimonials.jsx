import { useRef } from 'react';
import { AppleCard } from '../shared/AppleUI';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, useInView } from 'framer-motion';

const testimonials = [
    { name: 'Rahim Ahmed', role: 'Class 10 Student', text: "Found an amazing math tutor through e-tuitionBD. My grades improved significantly!", image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Fatima Khan', role: 'HSC Student', text: "The platform made it so easy to find a qualified physics tutor near my home.", image: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Karim Hassan', role: 'Parent', text: "Finally a trustworthy platform to find tutors for my children. Highly recommended!", image: 'https://i.pravatar.cc/150?img=3' }
];

const Testimonials = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-16 md:py-24 bg-muted/20">
            <div className="max-w-[1200px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                        TRUSTED BY <span className="text-primary italic">VOICES THAT MATTER.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <AppleCard className="p-6 flex flex-col h-full">
                                <Quote className="text-primary/20 w-8 h-8 mb-4" />
                                <p className="text-sm leading-relaxed flex-grow mb-6">"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t">
                                    <Avatar className="h-10 w-10 rounded-lg">
                                        <AvatarImage src={t.image} />
                                        <AvatarFallback className="text-xs font-bold">{t.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </AppleCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
