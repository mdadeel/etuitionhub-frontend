import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, MessageSquare, Terminal } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5 font-mono selection:bg-blue-500 selection:text-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Strip - System Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/5 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">System: Operational</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Globe className="w-3 h-3 text-slate-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Global Ping: 18ms</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">v4.0.2-stable</span>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">UTC: {new Date().toISOString().slice(11, 16)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
                                <Terminal className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-black text-white uppercase tracking-tighter">e-tuitionBD</span>
                        </div>
                        <p className="text-xs font-bold leading-relaxed uppercase tracking-tight max-w-xs text-slate-500">
                            The infrastructure for private education in Bangladesh. Verified credentials. Direct contact. Institutional trust.
                        </p>
                    </div>

                    {/* Navigation - High Density Grid */}
                    <div className="lg:col-span-5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            Core_Modules
                        </h4>
                        <div className="grid grid-cols-2 gap-y-3">
                            <Link to="/tutors" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                Find_Tutors
                            </Link>
                            <Link to="/post-tuition" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                Post_Tuition
                            </Link>
                            <Link to="/become-tutor" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                Join_Faculty
                            </Link>
                            <Link to="/contact" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                Support_Link
                            </Link>
                            <Link to="/privacy" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                Privacy_Policy
                            </Link>
                            <Link to="/terms" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                Terms_Of_Service
                            </Link>
                            <Link to="/about" className="text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-1 h-px bg-slate-800 group-hover:w-3 transition-all"></span>
                                About_Mission
                            </Link>
                        </div>
                    </div>

                    {/* Authority Signals */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            Trust_Signals
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 border border-white/5 bg-white/[0.02] space-y-2">
                                <div className="flex items-center gap-2 text-white">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Infrastructure</span>
                                </div>
                                <p className="text-[8px] text-slate-600 font-bold uppercase leading-tight">Every profile is manual-checked for academic authenticity.</p>
                            </div>
                            <div className="flex items-center gap-4 px-2">
                                <MessageSquare className="w-4 h-4 text-slate-700" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">P2P Encryption Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 italic">
                        &gt; END OF TRANSMISSION // 2026 E-TUITIONBD
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">No agents</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">No guesswork</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Just teaching.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;