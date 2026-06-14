import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(sectionRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (subscribers.includes(email)) {
        toast.error('You are already subscribed');
      } else {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        toast.success('Subscribed successfully!');
        setEmail('');
      }
    } catch {
      toast.error('Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.04) 50%, hsl(var(--accent) / 0.02) 100%)' }}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 relative z-10 text-center">
        <div className="size-14 rounded-full bg-primary/[0.06] border border-primary/10 flex items-center justify-center mx-auto mb-6">
          <Mail size={24} className="text-primary" />
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mb-4">
          Stay inside <span className="text-primary">the loop</span>
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
          Get verified tutor updates, learning tips, and educational resources delivered directly to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail className="size-5 text-muted-foreground/50 group-focus-within:text-primary/70 transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-background border border-border/40 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 rounded-lg transition-all font-body"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-12 md:h-14 px-8 md:px-10 bg-primary text-primary-foreground font-heading font-medium text-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mt-10 pt-8 border-t border-border/20">
          {[
            { icon: CheckCircle2, text: "No spam" },
            { icon: CheckCircle2, text: "Your email is secure" },
            { icon: CheckCircle2, text: "Unsubscribe anytime" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground/60">
              <item.icon size={14} className="text-primary/50" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
