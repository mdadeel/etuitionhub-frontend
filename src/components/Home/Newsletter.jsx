import { Mail, Zap, CheckCircle2 } from 'lucide-react';
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
        <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
            {/* Background Grid Motif */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-slate-950 p-12 md:p-16 text-center space-y-12 border border-white/10 relative overflow-hidden">
                    {/* Industrial Header */}
                    <div className="flex flex-col items-center space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10">
                            <Zap size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">System_Notification</span>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                                Stay Inside <br />
                                <span className="text-blue-600">The Loop</span>
                            </h2>
                            <p className="text-slate-400 text-xs font-bold max-w-sm mx-auto uppercase tracking-wider leading-relaxed">
                                Get verified tutor updates and strategic learning intel delivered with institutional precision.
                            </p>
                        </div>
                    </div>

                    {/* Technical Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto relative z-10 border border-white/10">
                        <div className="relative flex-1 group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                <Mail className="w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="USER@EMAIL_ADDRESS"
                                className="w-full h-16 pl-16 pr-6 bg-white/[0.02] text-white placeholder:text-slate-700 focus:outline-none focus:bg-white/[0.05] transition-all font-mono text-xs font-black uppercase tracking-widest"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="h-16 px-12 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-slate-950 transition-all border-l border-white/10 disabled:opacity-50"
                        >
                            {submitting ? 'Processing...' : 'Subscribe_Module'}
                        </button>
                    </form>

                    {/* Trust Bar */}
                    <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span>Zero Spam Filter</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span>Encrypted Data</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span>One-Click Opt-Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;