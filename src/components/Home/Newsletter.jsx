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
            // Newsletter API will be added later — for now store locally
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
        <section className="py-20 bg-background relative overflow-hidden border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 relative z-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="bg-card border border-border/80 rounded p-12 md:p-16 text-center space-y-10 shadow-premium relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                            <Mail size={12} className="text-primary" />
                            <span className="text-xs font-medium text-primary">Newsletter</span>
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-5xl font-heading text-foreground tracking-tight leading-tight">
                                Stay inside <span className="text-primary font-semibold">the loop</span>
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto font-body leading-relaxed">
                                Get verified tutor updates and learning tips delivered directly to your inbox.
                            </p>
                        </div>
                    </div>

                    {/* Subscription Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto w-full relative z-10">
                        <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                <Mail className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full h-12 pl-11 pr-4 bg-background border border-border text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded text-sm font-body"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="h-12 px-8 bg-primary text-primary-foreground font-heading font-medium text-sm rounded hover:bg-primary/95 transition-all active:scale-[0.98] disabled:opacity-50 shrink-0 shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                            {submitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-border/60 relative z-10 text-xs text-muted-foreground font-body">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-primary/70" />
                            <span>No spam</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-primary/70" />
                            <span>Your email is secure</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-primary/70" />
                            <span>Unsubscribe anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;