import React from 'react';
import { AppleBadge, AppleCard } from '../shared/AppleUI';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: 'Rahim Ahmed', 
        role: 'Class 10 Student',
        text: "Found an amazing math tutor through e-tuitionBD. My grades improved significantly!",
        image: 'https://i.pravatar.cc/150?img=1'
    },
    {
        name: 'Fatima Khan', 
        role: 'HSC Student', 
        text: "The platform made it so easy to find a qualified physics tutor near my home.",
        image: 'https://i.pravatar.cc/150?img=2'
    },
    {
        name: 'Karim Hassan', 
        role: 'Parent',
        text: "Finally a trustworthy platform to find tutors for my children. Highly recommended!",
        image: 'https://i.pravatar.cc/150?img=3'
    }
];

const Testimonials = () => {
    return (
        <section className="py-32 bg-muted/20">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-20" data-aos="fade-up">
                    <AppleBadge variant="primary" className="mb-4">The Impact</AppleBadge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Voices of Excellence.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <AppleCard key={idx} className="p-10 flex flex-col h-full group" data-aos="fade-up" data-aos-delay={idx * 100}>
                            <Quote className="text-primary/20 w-10 h-10 mb-6 group-hover:text-primary/40 transition-colors duration-500" />
                            <p className="text-sm font-medium text-foreground leading-relaxed flex-grow italic">
                                "{t.text}"
                            </p>
                            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-border/50">
                                <Avatar className="h-12 w-12 rounded-xl border border-border shadow-sm">
                                    <AvatarImage src={t.image} className="object-cover" />
                                    <AvatarFallback className="text-xs font-bold uppercase">{t.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm text-foreground leading-tight tracking-tight">{t.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t.role}</p>
                                </div>
                            </div>
                        </AppleCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
