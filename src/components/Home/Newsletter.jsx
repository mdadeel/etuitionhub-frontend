import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useAnimateOnScroll();

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
    <section ref={sectionRef} className="animate-in-up relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Mail size={24} className="text-primary" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-tight leading-[0.95] text-wrap-balance">
          Stay updated with new tutors and features
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          Get notified when new tutors join in your area and receive tips for finding the perfect match.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-12 px-6 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              'Subscribing...'
            ) : (
              <>
                Subscribe <CheckCircle2 size={16} />
              </>
            )}
          </button>
        </form>
        <p className="text-[11px] text-muted-foreground/60 mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default Newsletter;
