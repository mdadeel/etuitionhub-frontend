import { Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
        <section className="py-20 md:py-28 bg-background relative overflow-hidden border-b border-border/50">
            {/* Decorative background elements */}
            <div className="absolute top-1/2 -left-32 size-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -right-32 size-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="bg-card border border-border/60 rounded-2xl p-8 md:p-12 lg:p-16 text-center space-y-8 md:space-y-12 shadow-premium-lg relative overflow-hidden">
                    {/* Decorative gradient lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-accent"></div>

                    {/* Header */}
                    <div className="flex flex-col items-center space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
                            <Mail size={14} className="text-primary" />
                            <span className="text-xs font-medium text-primary uppercase tracking-wide">Newsletter</span>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95]">
                                Stay inside <span className="text-primary">the loop</span>
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto font-body leading-relaxed">
                                Get verified tutor updates, learning tips, and educational resources delivered directly to your inbox.
                            </p>
                        </div>
                    </div>

                    {/* Subscription Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto w-full relative z-10">
                        <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                <Mail className="size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full h-12 md:h-14 pl-12 pr-4 bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg transition-all font-body"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="h-12 md:h-14 px-8 md:px-10 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-heading font-medium text-sm rounded-lg hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                        >
                            {submitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 pt-6 border-t border-border/60 relative z-10">
                        {[
                            { icon: CheckCircle2, text: "No spam" },
                            { icon: CheckCircle2, text: "Your email is secure" },
                            { icon: CheckCircle2, text: "Unsubscribe anytime" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                                <item.icon size={16} className="text-primary/70" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
