import { GraduationCap, Users, CheckCircle2, Clock, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const Statistics = () => {
  const { t } = useTranslation();
  
  const stats = [
    {
      icon: GraduationCap,
      val: t('home.stat_tutors_val', '15,000+'),
      label: t('home.stat_tutors_label', 'Verified Tutors'),
    },
    {
      icon: Users,
      val: t('home.stat_students_val', '50,000+'),
      label: t('home.stat_students_label', 'Students Mentored'),
    },
    {
      icon: CheckCircle2,
      val: t('home.stat_matches_val', '98%'),
      label: t('home.stat_matches_label', 'Successful Matches'),
    },
    {
      icon: Clock,
      val: t('home.stat_response_val', '< 15 min'),
      label: t('home.stat_response_label', 'Avg. Response Time'),
    },
    {
      icon: MapPin,
      val: t('home.stat_districts_val', '64'),
      label: t('home.stat_districts_label', 'Districts Covered'),
    },
    {
      icon: Star,
      val: t('home.stat_rating_val', '4.8 / 5'),
      label: t('home.stat_rating_label', 'Parent Satisfaction'),
    },
  ];
  
  const containerRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden py-14 md:py-20 bg-muted/20 border-y border-border/40">
      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial statement */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              {t('home.stat_platform_overview', 'National Reach & Trust')}
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground leading-snug">
              {t('home.stat_caption')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('home.stat_caption_desc')}
            </p>
          </div>

          {/* Genuine Marketplace Metrics Grid */}
          <div
            ref={containerRef}
            className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
          >
            {stats.map((item, i) => (
              <div 
                key={i} 
                className="p-4 md:p-5 rounded-xl border border-border/70 bg-card hover:border-primary/30 transition-all duration-200"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <item.icon size={18} />
                </div>
                <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-foreground">
                  {item.val}
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-1">
                  {item.label}
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
