import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const faqs = [
  { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile to ensure 100% academic integrity." },
  { question: "What boards and classes do you cover?", answer: "We cover all education boards in Bangladesh, including National Curriculum (English & Bangla Version). Our tutors specialize from primary levels to university admission coaching." },
  { question: "How much does tutoring cost?", answer: "Fees are transparent and set by tutors. Typically, primary levels range from ৳2,000-৳4,000, while HSC and Admission levels range from ৳6,000-৳15,000 per month." },
  { question: "How do payments work?", answer: "Parents pay tutors directly through secure channels like bKash, Nagad, or Bank Transfer. There are zero middleman fees on our platform." },
  { question: "Can I change tutors if not satisfied?", answer: "Absolutely. Your satisfaction is our priority. If the tutor is not a perfect fit, our support team will help you find a replacement immediately." },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const headingRef = useAnimateOnScroll();
  const listRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="animate-in-up text-center mb-16">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">FAQ</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mt-2">
            Questions? We've got answers.
          </h2>
        </div>

        <div ref={listRef} className="animate-in-up animate-stagger space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="animate-in-up-child border border-border/20 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border/50">
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
    </section>
  );
};

export default FAQ;
