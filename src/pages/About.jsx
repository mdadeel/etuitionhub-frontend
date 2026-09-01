import { GraduationCap, CheckCircle, Users, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import SEO from '../components/shared/SEO';
import api from '../services/api';

const About = () => {
    const { t } = useTranslation();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['about', 'stats'],
        queryFn: async () => {
            const [tutors, tuitions] = await Promise.all([
                api.get('/api/tutors?limit=1'),
                api.get('/api/tuitions?limit=1')
            ]);
            return [
                { value: tutors.data?.pagination?.total, label: t('about.stat_tutors'), icon: Users },
                { value: tuitions.data?.pagination?.total, label: t('about.stat_tuitions'), icon: GraduationCap }
            ];
        },
        staleTime: 5 * 60_000,
    });

    return (
        <div className="bg-background min-h-screen py-16">
            <SEO title={t('about.seo_title')} description={t('about.seo_desc')} />
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <span className="text-sm font-medium text-primary">{t('about.badge')}</span>
                    <h1 className="text-3xl font-bold text-foreground mt-2">{t('about.title')}</h1>
                </div>

                {/* Mission */}
                <section className="bg-card border border-border rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">{t('about.mission_title')}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t('about.mission_p1')} {t('about.mission_p2')}
                    </p>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
                    {(stats || []).map((stat, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
                            <stat.icon className="size-6 text-primary mx-auto mb-2" />
                            <span className="text-2xl font-bold text-foreground">
                                {isLoading ? '…' : stat.value ?? '—'}
                            </span>
                            <span className="text-sm text-muted-foreground block">{stat.label}</span>
                        </div>
                    ))}
                </section>

                {/* Values */}
                <section className="bg-card border border-border rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6">{t('about.why_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            t('about.why_1_title'),
                            t('about.why_2_title'),
                            t('about.why_3_title'),
                            t('about.why_4_title')
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle className="size-5 text-success shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coverage */}
                <section className="bg-card border border-border rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Globe className="size-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">{t('about.team_title')}</h2>
                            <p className="text-muted-foreground">
                                {t('about.team_desc')}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
