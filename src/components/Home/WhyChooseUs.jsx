import { ShieldCheck, MessageCircle, Wallet, Monitor, CheckCircle, Users, Clock, Heart } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

// eslint-disable-next-line no-unused-vars
const FeatureBlock = ({ icon: Icon, title, description, features, delay = '100ms', reversed = false }) => (
    <div className="grid lg:grid-cols-12 gap-12 items-center animate-in fade-in zoom-in-95 duration-700 ease-out" style={{ animationDelay: delay }}>
        <div className={`lg:col-span-5 ${reversed ? 'order-2 lg:order-1' : 'order-1 lg:order-2'}`}>
            <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-muted border border-border text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="size-7" />
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-foreground mb-3 tracking-tight">{title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed font-body">{description}</p>
                </div>
            </div>
        </div>
        <div className={`lg:col-span-7 ${reversed ? 'order-1 lg:order-2' : 'order-2 lg:order-1'}`}>
            <div className="p-8 bg-card rounded-2xl border border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-xl active:scale-[0.98] cursor-default">
                <div className="grid grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <div key={`${title}-feature-${idx}`} className="flex items-start gap-3 group">
                            <div className="mt-0.5 min-w-[18px]">
                                <CheckCircle className="size-5 text-primary transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground mb-1 transition-colors">{feature.title}</p>
                                <p className="text-xs text-muted-foreground">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 animate-in fade-in zoom-in-95 duration-700 ease-out">
                    <h2 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tight mb-4">
                        Why parents <span className="text-primary">trust us</span> with their children's education
                    </h2>
                    <p className="text-lg text-muted-foreground font-body max-w-3xl mx-auto">
                        We've heard the stories - tutors who don't show up, fake credentials, and hidden fees. That's why we built a platform where every tutor is verified, every fee is transparent, and every parent can communicate directly.
                    </p>
                </div>

                <div className="space-y-16">
                    <FeatureBlock
                        icon={ShieldCheck}
                        title="Verified Credentials"
                        description="Every tutor's academic documents are manually checked. We verify qualifications, experience, and background to ensure your child learns from genuine educators."
                        delay="200ms"
                        features={[
                            { title: "Document Verification", desc: "Academic credentials checked" },
                            { title: "Background Check", desc: "Identity verification complete" },
                            { title: "Experience Validated", desc: "Teaching history confirmed" },
                            { title: "Reference Checks", desc: "Past employer verification" }
                        ]}
                    />

                    <div className="grid lg:grid-cols-12 gap-12 items-center animate-in fade-in zoom-in-95 duration-700 ease-out" style={{ animationDelay: '350ms' }}>
                        <div className="lg:col-span-7">
                            <div className="p-8 bg-card rounded-2xl border border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-xl active:scale-[0.98] cursor-default">
                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    {[
                                        { id: "f1", icon: MessageCircle, title: "Direct Messaging", desc: "Communicate without intermediaries" },
                                        { id: "f2", icon: Wallet, title: "Transparent Fees", desc: "No hidden charges or commissions" },
                                        { id: "f3", icon: Users, title: "Parent-Tutor Match", desc: "Find the right fit for your child" },
                                        { id: "f4", icon: Clock, title: "Quick Response", desc: "Average 18-minute reply time" }
                                    ].map((feature) => (
                                        <div key={feature.id} className="flex items-start gap-3 group">
                                            <div className="mt-0.5 text-primary transition-colors">
                                                <feature.icon className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground mb-1 transition-colors">{feature.title}</p>
                                                <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-5">
                            <div className="flex items-start gap-4">
                                <div className="size-14 rounded-2xl bg-muted border border-border text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
                                    <MessageCircle className="size-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-heading font-black text-foreground mb-3 tracking-tight">Direct Connection</h3>
                                    <p className="text-base text-muted-foreground leading-relaxed font-body">
                                        No middlemen, no agents. Message tutors directly, discuss your child's needs, and build a relationship based on trust and transparency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <FeatureBlock
                        icon={Monitor}
                        title="Online & Offline"
                        description="Choose the learning mode that works best for your family. Whether it's in-person sessions at home or online classes, we support your preference."
                        delay="550ms"
                        reversed={true}
                        features={[
                            { title: "Online Classes", desc: "Learn from anywhere" },
                            { title: "In-Person Sessions", desc: "Home tutoring available" },
                            { title: "Flexible Budget", desc: "৳2,000 to ৳15,000/month" },
                            { title: "Personalized Care", desc: "Tailored to your child" }
                        ]}
                    />
                </div>

                {/* Trust Stats */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/60 animate-in fade-in zoom-in-95 duration-700 ease-out" style={{ animationDelay: '700ms' }}>
                    {[
                        { id: "s1", label: "Verified Tutors", value: "100%" },
                        { id: "s2", label: "Parent Satisfaction", value: "4.8/5" },
                        { id: "s3", label: "Response Time", value: "<24h" },
                        { id: "s4", label: "Success Rate", value: "95%" }
                    ].map((stat) => (
                        <div key={stat.id} className="text-center space-y-1">
                            <div className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight">{stat.value}</div>
                            <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
