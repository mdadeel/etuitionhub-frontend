import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const faqs = [
  { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile to ensure 100% academic integrity." },
  { question: "What boards and classes do you cover?", answer: "We cover all education boards in Bangladesh, including National Curriculum (English & Bangla Version). Our tutors specialize from primary levels to university admission coaching." },
  { question: "How much does tutoring cost?", answer: "Fees are transparent and set by tutors. Typically, primary levels range from ৳2,000-৳4,000, while HSC and Admission levels range from ৳6,000-৳15,000 per month." },
  { question: "How do payments work?", answer: "You can pay securely through our integrated Checkout system using credit/debit cards or mobile banking, or pay tutors directly via bKash, Nagad, or Bank Transfer. All Checkout transactions are protected. There are zero middleman fees on our platform." },
  { question: "Can I change tutors if not satisfied?", answer: "Absolutely. Your satisfaction is our priority. If the tutor is not a perfect fit, our support team will help you find a replacement immediately." },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const headingRef = useAnimateOnScroll();
  const listRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 border-b border-border/10">
      {/* Soft violet glow — grounds the student-thinking illustration */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-violet-400/5 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT - FAQ Title & Accordion */}
          <div className="lg:col-span-7 space-y-8">
            <div ref={headingRef} className="text-left space-y-3">
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.18em]">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight leading-tight">
                Questions? We've got answers.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Everything you need to know about finding the perfect tutor and securing your child's success.
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
