// pages/Terms.jsx
// Simple terms-of-service page — honest placeholder, no fake legal claims.
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scale, ArrowLeft } from 'lucide-react';
import SEO from '../components/shared/SEO';

export default function Terms() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-background">
            <SEO title={t('terms.seo_title')} description={t('terms.seo_desc')} />
            <div className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-3xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-8 uppercase tracking-widest"
                >
                    <ArrowLeft size={14} />
                    {t('common.back_home')}
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Scale size={20} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-foreground">{t('terms.title')}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{t('common.last_updated')}</p>
                    </div>
                </div>

                <div className="border border-border/40 rounded-lg p-6 md:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning text-xs font-medium">
                        ⚠️ {t('terms.warning')}
                    </div>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s1_title')}</h2>
                        <p>{t('terms.s1_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s2_title')}</h2>
                        <p>{t('terms.s2_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s3_title')}</h2>
                        <p>{t('terms.s3_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s4_title')}</h2>
                        <p>{t('terms.s4_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s5_title')}</h2>
                        <p>{t('terms.s5_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s6_title')}</h2>
                        <p>{t('terms.s6_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s7_title')}</h2>
                        <p>{t('terms.s7_body')}</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-foreground mb-3">{t('terms.s8_title')}</h2>
                        <p>{t('terms.s8_body')}<a href="mailto:support@etuitionbd.com" className="text-primary underline">support@etuitionbd.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}