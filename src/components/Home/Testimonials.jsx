import { useRef } from 'react';
import { Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, useInView } from 'framer-motion';

const testimonials = [
    { name: 'Rahim Ahmed', role: 'Class 10 Student', text: "Found an amazing math tutor through e-tuitionBD. My grades improved significantly!", image: 'https://i.pravatar.cc/150?img=11', rating: 5 },
    { name: 'Fatima Khan', role: 'HSC Student', text: "The platform made it so easy to find a qualified physics tutor near my home.", image: 'https://i.pravatar.cc/150?img=32', rating: 5 },
    { name: 'Karim Hassan', role: 'Parent', text: "Finally a trustworthy platform to find tutors for my children. Highly recommended!", image: 'https://i.pravatar.cc/150?img=44', rating: 5 }
];

const Testimonials = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} className="py-24 bg-muted/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
                        TRUSTED BY <span className="text-primary italic">VOICES THAT MATTER.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group relative p-8 rounded-[2.5rem] bg-white border border-border/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
                        >
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                            
                            <p className="text-base text-muted-foreground leading-relaxed font-medium mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                                <Avatar className="h-12 w-12 rounded-full border-2 border-white shadow-md">
                                    <AvatarImage src={t.image} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">{t.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-black text-foreground uppercase tracking-tight">{t.name}</p>
                                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{t.role}</p>
                                </div>
                                <Quote className="ml-auto text-primary/10 w-8 h-8 -rotate-12 group-hover:text-primary/20 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;

