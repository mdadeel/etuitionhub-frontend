import { GraduationCap, CheckCircle, Users, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SEO from '../components/shared/SEO';
import api from '../services/api';

const About = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['about', 'stats'],
        queryFn: async () => {
            const [tutors, tuitions] = await Promise.all([
                api.get('/api/tutors?limit=1'),
                api.get('/api/tuitions?limit=1')
            ]);
            return [
                { value: tutors.data?.pagination?.total, label: 'Verified Tutors', icon: Users },
                { value: tuitions.data?.pagination?.total, label: 'Open Tuition Posts', icon: GraduationCap }
            ];
        },
        staleTime: 5 * 60_000,
    });

    return (
        <div className="bg-background min-h-screen py-16">
            <SEO title="About eTuitionBD | Connecting Students with Verified Tutors in Bangladesh" description="Learn how eTuitionBD helps parents and students find verified, trustworthy private tutors across Bangladesh — with no middleman fees." />
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
                <section className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
                    {(stats || []).map((stat, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
                            <stat.icon className="size-6 text-blue-600 mx-auto mb-2" />
                            <span className="text-2xl font-bold text-foreground">
                                {isLoading ? '…' : stat.value ?? '—'}
                            </span>
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
                                <CheckCircle className="size-5 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coverage */}
                <section className="bg-card border border-border rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <Globe className="size-6 text-blue-600" />
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
