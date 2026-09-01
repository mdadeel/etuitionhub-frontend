import { Brain, Zap, BookOpen, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const Statistics = () => {
  const { t } = useTranslation();
  const capabilities = [
    {
      icon: Zap,
      title: t('poruaTeaser.feature1'),
      description: t('poruaTeaser.feature1_desc'),
    },
    {
      icon: Brain,
      title: t('poruaTeaser.feature2'),
      description: t('poruaTeaser.feature2_desc'),
    },
    {
      icon: BookOpen,
      title: t('poruaTeaser.feature3'),
      description: t('poruaTeaser.feature3_desc'),
    },
    {
      icon: MessageSquare,
      title: t('home.stat_quick_response'),
      description: t('home.stat_quick_response_desc'),
    }
  ];
  const containerRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-card border-y border-border/40">
      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Editorial statement */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              {t('poruaTeaser.badge')}
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground">
              {t('home.stat_caption')}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t('home.stat_caption_desc')}
            </p>
          </div>

          {/* Capabilities as a hairline-separated list */}
          <div
            ref={containerRef}
            className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden"
          >
            {capabilities.map((item, i) => (
              <div key={i} className="flex items-start gap-3.5 p-5 bg-card">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <item.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-sm text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
