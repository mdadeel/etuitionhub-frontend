import { useTranslation } from 'react-i18next';
import { ShieldCheck, MessageCircle, HeadphonesIcon } from 'lucide-react';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: ShieldCheck,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: t('whyChooseUs.block1_title'),
      desc: t('whyChooseUs.block1_desc'),
    },
    {
      icon: MessageCircle,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      title: t('whyChooseUs.block2_title'),
      desc: t('whyChooseUs.block2_desc'),
    },
    {
      icon: HeadphonesIcon,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      title: t('whyChooseUs.block3_title'),
      desc: t('whyChooseUs.block3_desc'),
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[11px] font-bold text-primary uppercase tracking-[0.18em]">
            {t('whyChooseUs.badge')}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight leading-tight mt-2 max-w-xl mx-auto">
            {t('whyChooseUs.heading')}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-2xl mx-auto">
            {t('whyChooseUs.intro')}
          </p>
        </div>

        {/* Pillars — 3-column bento */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          {pillars.map(({ icon: Icon, iconColor, iconBg, title, desc }) => (
            <div
              key={title}
              className="group relative p-6 rounded-2xl border border-border/60 bg-card hover:border-border hover:bg-card/80 transition-all duration-300 hover:shadow-md hover:shadow-primary/5"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={22} className={iconColor} />
              </div>
              <h3 className="text-base font-heading font-bold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom trust line */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground font-medium">
          {[
            'NID Verified',
            'Direct Communication',
            '24/7 Support',
            'Zero Agency Fees',
            'Background Checked',
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-primary/40" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
