import { ShieldCheck, Banknote, Clock, Zap } from 'lucide-react';
import { AppleBadge, AppleCard } from '../shared/AppleUI';

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Tutors",
        description: "Every tutor is background-checked with verified academic credentials and national ID."
    },
    {
        icon: Banknote,
        title: "Transparent Pricing",
        description: "Clear monthly rates upfront. No hidden fees. bKash, Nagad, or bank transfer accepted."
    },
    { 
        icon: Clock, 
        title: "Flexible Scheduling", 
        description: "Morning, evening, or weekend sessions. Match your routine, not the other way around." 
    },
    {
        icon: Zap,
        title: "Quick Match",
        description: "Find a verified tutor in your area within 24 hours. Start learning faster."
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-32 bg-background">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="mb-24" data-aos="fade-right">
                    <AppleBadge variant="primary" className="mb-4">Why e-TuitionBD</AppleBadge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                        Bangladesh's trusted <br />
                        <span className="text-muted-foreground/30">tutoring platform.</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-lg">Thousands of students across Dhaka, Chittagong, Sylhet, and beyond have found their perfect tutor through e-TuitionBD.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <AppleCard key={idx} className="p-10 group" data-aos="fade-up" data-aos-delay={idx * 100}>
                            <div className="mb-10 w-14 h-14 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <feature.icon size={28} strokeWidth={1.5} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </AppleCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
