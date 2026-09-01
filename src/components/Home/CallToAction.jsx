import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { trackEvent } from '../../services/analytics';
import Illustration from './illustrations/Illustration';

const CallToAction = () => {
    const { t } = useTranslation();
    return (
        <section className="py-16 md:py-24 bg-card relative overflow-hidden">
            {/* Graduation illustration — large, prominent, bottom-right */}
            <div className="absolute bottom-0 right-8 w-56 h-56 pointer-events-none z-0">
                <Illustration name="graduation" className="w-full h-auto" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-card border border-border/60 rounded-lg p-8 md:p-16 lg:p-20 text-center  relative overflow-hidden">
                    {/* Decorative header */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                    <div className="space-y-8 relative z-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-foreground tracking-tight leading-[0.95]">
                                {t('callToAction.heading')}
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-body leading-relaxed">
                                {t('callToAction.desc')}
                            </p>
                        </div>

                        {/* Features Brief */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-75">
                            {[
                                { icon: CheckCircle, text: t('callToAction.feature1') },
                                { icon: CheckCircle, text: t('callToAction.feature2') },
                                { icon: CheckCircle, text: t('callToAction.feature3') }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm md:text-base text-muted-foreground">
                                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <item.icon size={16} />
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                            <Button asChild size="xl" className="w-full sm:w-auto px-8 md:px-10 font-heading font-semibold text-base h-14 md:h-16 bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all">
                                <Link to="/register" onClick={() => trackEvent('home_cta_click', 'create_account')}>
                                    {t('callToAction.btn')}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto px-8 md:px-10 font-heading font-semibold text-base h-14 md:h-16 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all">
                                <Link to="/tutors" onClick={() => trackEvent('home_cta_click', 'browse_tutors')}>
                                    {t('callToAction.browse_btn')}
                                </Link>
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground pt-4">
                            {t('callToAction.disclaimer')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
