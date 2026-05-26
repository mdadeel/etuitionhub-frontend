import { ShieldCheck, MessageCircle, Wallet, Monitor, CheckCircle, Users, Clock, Heart } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';

const FeatureBlock = ({ icon: Icon, title, description, features, delay = '100ms' }) => (
    <div className="grid lg:grid-cols-12 gap-12 items-center opacity-0 animate-fade-in-up" style={{ animationDelay: delay }}>
        <div className="lg:col-span-5">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0 border border-border">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-heading text-foreground mb-2">{title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
        <div className="lg:col-span-7">
            <Card variant="elevated" className="p-8 rounded border border-border/50 hover:border-primary/20 transition-all duration-300">
                <div className="grid grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-foreground mb-1">{feature.title}</p>
                                <p className="text-xs text-muted-foreground">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <SectionHeader
                        title={<>Why parents <span className="text-primary">trust us</span> with their children's education</>}
                        subtitle="We've heard the stories — tutors who don't show up, fake credentials, and hidden fees. That's why we built a platform where every tutor is verified, every fee is transparent, and every parent can communicate directly."
                    />
                </div>

                <div className="space-y-20">
                    <FeatureBlock
                        icon={ShieldCheck}
                        title="Verified Credentials"
                        description="Every tutor's academic documents are manually checked. We verify qualifications, experience, and background to ensure your child learns from genuine educators."
                        delay="250ms"
                        features={[
                            { title: "Document Verification", desc: "Academic credentials checked" },
                            { title: "Background Check", desc: "Identity verification complete" },
                            { title: "Experience Validated", desc: "Teaching history confirmed" },
                            { title: "Reference Checks", desc: "Past employer verification" }
                        ]}
                    />

                    <div className="grid lg:grid-cols-12 gap-12 items-center opacity-0 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                        <div className="lg:col-span-7 order-2 lg:order-1">
                            <Card variant="elevated" className="p-8 rounded border border-border/50 hover:border-primary/20 transition-all duration-300">
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { icon: MessageCircle, title: "Direct Messaging", desc: "Communicate without intermediaries" },
                                        { icon: Wallet, title: "Transparent Fees", desc: "No hidden charges or commissions" },
                                        { icon: Users, title: "Parent-Tutor Match", desc: "Find the right fit for your child" },
                                        { icon: Clock, title: "Quick Response", desc: "Average 18-minute reply time" }
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground mb-1">{feature.title}</p>
                                                <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-5 order-1 lg:order-2">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0 border border-border">
                                    <MessageCircle className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-heading text-foreground mb-2">Direct Connection</h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">
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
                        delay="450ms"
                        features={[
                            { title: "Online Classes", desc: "Learn from anywhere" },
                            { title: "In-Person Sessions", desc: "Home tutoring available" },
                            { title: "Flexible Budget", desc: "৳2,000 to ৳15,000/month" },
                            { title: "Personalized Care", desc: "Tailored to your child" }
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
