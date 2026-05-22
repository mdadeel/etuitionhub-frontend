import { GraduationCap, CheckCircle, Users, BookOpen, MapPin, Globe } from "lucide-react";

const About = () => {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <span className="text-sm font-medium text-blue-600">About Us</span>
                    <h1 className="text-3xl font-bold text-foreground mt-2">Connecting students with verified tutors</h1>
                </div>

                {/* Mission */}
                <section className="bg-card border border-border rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We built e-tuitionBD because finding a good tutor in Bangladesh shouldn't feel like gambling.
                        Every profile on our platform is verified, every fee is transparent, and every parent can
                        speak directly to the tutor before making a decision.
                    </p>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { value: '2,500+', label: 'Active Tutors', icon: Users },
                        { value: '15,000+', label: 'Students Matched', icon: GraduationCap },
                        { value: '50+', label: 'Subjects', icon: BookOpen },
                        { value: '10+', label: 'Cities', icon: MapPin }
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
                            <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                            <span className="text-sm text-muted-foreground block">{stat.label}</span>
                        </div>
                    ))}
                </section>

                {/* Values */}
                <section className="bg-card border border-border rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            'Verified tutor profiles with credentials',
                            'Transparent pricing - no hidden fees',
                            'Direct communication with tutors',
                            'Wide range of subjects and levels'
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coverage */}
                <section className="bg-card border border-border rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Nationwide Coverage</h2>
                            <p className="text-muted-foreground">
                                We serve students across Bangladesh - from Dhaka to Chattogram, Sylhet to Khulna.
                                Our platform connects students with tutors regardless of location.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
