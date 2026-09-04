import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const FAQ = () => {
  const { t } = useTranslation();
  const faqs = [
    { question: t('faq.q1') || t('home.faq.q1'), answer: t('faq.a1') || t('home.faq.a1') },
    { question: t('faq.q2') || t('home.faq.q2'), answer: t('faq.a2') || t('home.faq.a2') },
    { question: t('faq.q3') || t('home.faq.q3'), answer: t('faq.a3') || t('home.faq.a3') },
    { question: t('faq.q4') || t('home.faq.q4'), answer: t('faq.a4') || t('home.faq.a4') },
    { question: t('faq.q5') || t('home.faq.q5'), answer: t('faq.a5') || t('home.faq.a5') },
    { question: t('faq.q6') || t('home.faq.q6'), answer: t('faq.a6') || t('home.faq.a6') },
  ];
  const [activeIndex, setActiveIndex] = useState(null);
  const headingRef = useAnimateOnScroll();
  const listRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24 border-b border-border/10">
      {/* Soft violet glow — grounds the student-thinking illustration */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-violet-400/5 blur-[120px] pointer-events-none z-0" />

      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT - FAQ Title & Accordion */}
          <div className="lg:col-span-7 space-y-8">
            <div ref={headingRef} className="text-left space-y-3">
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.18em]">{t('faq.badge') || t('home.faq.badge')}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight leading-tight">
                {t('faq.heading') || t('home.faq.heading')}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('faq.subheading') || t('home.faq.subheading')}
              </p>
            </div>

            <div ref={listRef} className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-border/30 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border/50">
                  <button
                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-semibold text-foreground pr-4">{faq.question}</span>
                    <span className="shrink-0 size-6 rounded-lg bg-muted/50 flex items-center justify-center transition-transform duration-300"
                      style={{ transform: activeIndex === idx ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                      <Plus size={14} className="text-muted-foreground" />
                    </span>
                  </button>
                  <div className={cn(
                    "grid transition-all duration-300",
                    activeIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden">
                      <p className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Student Thinking Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[450px] aspect-[5/4.2]">
              <img src="/images/faq.png" alt="FAQ illustration" className="w-full h-auto object-contain" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
