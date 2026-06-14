import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { question: "How do you verify tutors?", answer: "Every tutor submits their academic certificates and national ID. We verify all documents manually before activating their profile to ensure 100% academic integrity." },
  { question: "What boards and classes do you cover?", answer: "We cover all education boards in Bangladesh, including National Curriculum (English & Bangla Version). Our tutors specialize from primary levels to university admission coaching." },
  { question: "How much does tutoring cost?", answer: "Fees are transparent and set by tutors. Typically, primary levels range from ৳2,000-৳4,000, while HSC and Admission levels range from ৳6,000-৳15,000 per month." },
  { question: "How do payments work?", answer: "Parents pay tutors directly through secure channels like bKash, Nagad, or Bank Transfer. There are zero middleman fees on our platform." },
  { question: "Can I change tutors if not satisfied?", answer: "Absolutely. Your satisfaction is our priority. If the tutor is not a perfect fit, our support team will help you find a replacement immediately." },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(headingRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
          );

          const items = gsap.utils.toArray('.faq-item');
          gsap.fromTo(items,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out", delay: 0.2 }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="text-center mb-14">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">Questions & Answers</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mt-3">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-base text-muted-foreground mt-3">Got questions? We've got answers.</p>
        </div>

        <div className="divide-y divide-border/20">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div key={idx} className="faq-item py-4 md:py-5 first:pt-0">
                <button
                  className="w-full flex items-center justify-between text-left gap-4 outline-none"
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                >
                  <span className={cn(
                    "text-sm md:text-base font-heading tracking-tight transition-colors duration-300",
                    isOpen ? 'text-primary' : 'text-foreground'
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "size-7 flex items-center justify-center rounded-md transition-all duration-300 shrink-0",
                    isOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  )}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div className={cn(
                    "grid transition-all duration-500 ease-in-out overflow-hidden",
                    isOpen ? "grid-rows-[1fr] max-h-96" : "grid-rows-[0fr] max-h-0"
                )}>
                  <div className="min-w-0">
                    <p className="pt-3 pb-1 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
