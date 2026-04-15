import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Clock, Send, Database, Terminal } from "lucide-react";

/**
 * Contact Page
 * Refactored to "Technical Emerald Minimalism"
 */
const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Communication synchronized with support infrastructure.');
    };

    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-24 border-b border-border pb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Communication Interface</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] mb-10">
                        Support <br />
                        <span className="text-muted-foreground">Infrastructure.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-muted-foreground font-bold leading-relaxed max-w-2xl uppercase tracking-tight">
                        Direct access to platform operations and resolution protocols.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
                    {/* Sidebar Info */}
                    <div className="md:col-span-4 space-y-16">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-primary" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Operational Hub</h2>
                            </div>
                            <div className="pl-7 space-y-4">
                                <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-loose">
                                    Dhaka Operations Center<br />
                                    Bangladesh Regional Node
                                </p>
                                <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group cursor-pointer">
                                    <Mail size={12} />
                                    <span className="group-hover:underline">OPS@E-TUITIONBD.COM</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-primary" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Response Protocol</h2>
                            </div>
                            <div className="pl-7">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
                                    Standard response latency:<br />
                                    <span className="text-foreground">24 - 48 Operational Hours</span>
                                </p>
                            </div>
                        </section>

                        <section className="p-8 bg-muted/30 border border-border group">
                            <div className="flex items-center gap-3 mb-4">
                                <Terminal size={16} className="text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">System Status</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Channels Active</span>
                            </div>
                        </section>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-10 p-10 bg-background border border-border shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Database size={120} className="text-foreground" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Origin Identity</Label>
                                    <Input 
                                        type="text" 
                                        placeholder="FULL_NAME_OR_ORG" 
                                        className="h-14 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary uppercase text-[11px] tracking-widest"
                                        required 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Operational Email</Label>
                                    <Input 
                                        type="email" 
                                        placeholder="IDENTITY@DOMAIN.COM" 
                                        className="h-14 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary uppercase text-[11px] tracking-widest"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Communication Payload</Label>
                                <Textarea 
                                    placeholder="DETAIL_INQUIRY_OR_INCIDENT_PARAMETERS..." 
                                    className="min-h-[200px] rounded-none border-border bg-muted/20 font-medium focus-visible:ring-primary resize-none p-6 text-sm"
                                    required 
                                />
                            </div>

                            <div className="pt-4 relative z-10">
                                <Button type="submit" className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg">
                                    Transmit Message <Send size={18} className="transition-transform hover:translate-x-1" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
