import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    Activity, 
    FileText, 
    Zap, 
    Banknote, 
    ShieldCheck, 
    ArrowUpRight,
    Trash2,
    Database,
    Clock,
    UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * TutorDashboard Component
 * Refactored to "Technical Emerald Minimalism"
 */
const TutorDashboard = () => {
    const { user, dbUser } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState([]);

    useEffect(() => {
        if (user?.email) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            const appResponse = await api.get(`/api/applications/tutor/${user.email}`);
            setApps(appResponse.data || []);

            try {
                const revenueRes = await api.get(`/api/payments/tutor/${user.email}`);
                setRevenue(revenueRes.data || []);
            } catch (e) {
                console.log('Revenue fetch:', e.message);
            }
        } catch (e) {
            console.error("Dashboard Load Error:", e);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = revenue.reduce((sum, p) => sum + (p.amount || 0), 0);
    const activeEngagements = apps.filter(a => a.status === 'approved').length;

    const handleDelete = async (id) => {
        if (!confirm('Permanently remove this application documentation?')) return;

        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(id)) {
            toast.error('System Integrity: Demo data is read-only.');
            return;
        }

        try {
            await api.delete(`/api/applications/${id}`);
            toast.success("Record expunged.");
            setApps(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed.');
        }
    };

    if (loading) return <LoadingSpinner />;

    const tabs = [
        { id: 'overview', label: 'STRATEGIC_OVERVIEW', icon: Activity },
        { id: 'applications', label: 'ACTIVE_PIPELINE', icon: FileText },
        { id: 'ongoing', label: 'VERIFIED_ENGAGEMENTS', icon: UserCheck },
        { id: 'revenue', label: 'YIELD_MANIFEST', icon: Banknote }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 bg-background border-b border-border pb-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary text-balance">Specialist Intelligence Interface</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-none">Command Center.</h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-6 flex items-center gap-2">
                        <Database size={12} className="text-primary" /> NODE_{dbUser?.displayName?.toUpperCase().replace(' ', '_')} // {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="flex flex-wrap bg-muted/20 p-1 rounded-none border border-border gap-1 overflow-x-auto shrink-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-none ${activeTab === tab.id
                                ? 'bg-background text-primary shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-50'} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-border bg-border">
                    <div className="p-12 bg-background border-r border-b border-border group hover:bg-muted/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 group-hover:text-primary transition-colors">Pipeline Volume</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-foreground tracking-tighter tabular-nums italic leading-none">{apps.length}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Records</span>
                        </div>
                    </div>
                    <div className="p-12 bg-background border-r border-b border-border group hover:bg-muted/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 group-hover:text-primary transition-colors">Active Tenure</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-primary tracking-tighter tabular-nums italic leading-none">{activeEngagements}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Nodes</span>
                        </div>
                    </div>
                    <div className="p-12 bg-background border-r border-b border-border group hover:bg-muted/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 group-hover:text-primary transition-colors">Cumulative Yield</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-foreground tracking-tighter tabular-nums italic leading-none">৳{totalEarnings}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Protocol BDT</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="bg-background border border-border shadow-2xl overflow-hidden relative selection:bg-primary/30 selection:text-primary">
                    {apps.length === 0 ? (
                        <div className="p-32 text-center bg-muted/10 border-b border-border">
                            <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">No pipeline records available within this infrastructure.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted border-b border-border">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Reference</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Academic Target</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Yield</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Protocol Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {apps.map((app, idx) => (
                                        <tr key={app._id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-10 py-8 text-[10px] font-black text-muted-foreground tabular-nums tracking-widest">PROTO_{idx + 1001}</td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-foreground tracking-tighter uppercase italic">{app.tuitionId?.subject}</p>
                                                <p className="text-[9px] text-muted-foreground font-black mt-1 uppercase tracking-widest">{app.studentEmail}</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                 <p className="text-sm font-black text-primary tabular-nums italic">৳{app.expectedSalary}</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest border-border ${
                                                    app.status === 'approved' ? 'text-primary border-primary bg-primary/5' :
                                                    app.status === 'rejected' ? 'text-destructive border-destructive/20 bg-destructive/5' :
                                                    'text-muted-foreground bg-muted'
                                                }`}>
                                                    {app.status}
                                                </Badge>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                {app.status === 'pending' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-[9px] font-black uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/5 rounded-none"
                                                        onClick={() => handleDelete(app._id)}
                                                    >
                                                        <Trash2 size={14} className="mr-2" /> Recall Transmission
                                                    </Button>
                                                ) : (
                                                    <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] italic">— LOCKED —</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'ongoing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {apps.filter(a => a.status === 'approved').length === 0 ? (
                        <div className="col-span-full p-32 bg-muted/10 border border-dashed border-border text-center rounded-none relative overflow-hidden">
                             <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">No active engagements identified within system nodes.</p>
                        </div>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <div key={app._id} className="p-12 bg-background border border-border rounded-none shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-none -mr-20 -mt-20 rotate-45 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-1.5 bg-primary"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Verified Connection Active</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-foreground mb-10 tracking-tighter uppercase italic leading-none border-l-4 border-primary pl-6">{app.tuitionId?.subject}</h3>
                                    
                                    <div className="space-y-6 pt-8 border-t border-border">
                                        <div className="flex justify-between items-center group/row">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Zap size={12} className="text-primary" /> Target Node
                                            </span>
                                            <span className="text-[10px] font-black text-foreground bg-muted px-4 py-2 border border-border uppercase tracking-widest">{app.studentEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center group/row">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Clock size={12} className="text-primary" /> Yield Cycle
                                            </span>
                                            <span className="text-sm font-black text-primary tabular-nums italic">৳{app.expectedSalary} <span className="text-[9px] text-muted-foreground font-black ml-1 uppercase">/ cycle</span></span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-10 pt-10 border-t border-border">
                                        <Button asChild variant="outline" className="w-full h-14 rounded-none border-border text-[10px] font-black uppercase tracking-[0.2em] hover:bg-muted group/btn">
                                            <a href={`mailto:${app.studentEmail}`} className="flex items-center justify-center gap-2">
                                                Initiate Direct Transmission <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="bg-background border border-border shadow-2xl overflow-hidden relative">
                    <div className="p-12 border-b border-border bg-muted/10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                             <h2 className="text-sm font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-primary"></div>
                                Yield Audit Manifest
                            </h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-3">Comprehensive audit of all financial protocol transmissions</p>
                        </div>
                        <div className="bg-background px-10 py-6 border border-border relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full bg-primary/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-2 relative z-10">Accumulated Node Yield</p>
                            <p className="text-4xl font-black text-primary tracking-tighter tabular-nums italic relative z-10 leading-none">৳{totalEarnings}</p>
                        </div>
                    </div>

                    {revenue.length === 0 ? (
                        <div className="p-32 text-center bg-muted/10">
                            <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">No financial history logs identified.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto selection:bg-primary/30 selection:text-primary">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted border-b border-border">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Log Timestamp</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Allocation Target</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Transmission Yield</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {revenue.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tabular-nums tracking-widest">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-foreground tracking-tighter uppercase italic">{payment.tuitionId?.subject || 'External Cluster'}</p>
                                                <p className="text-[9px] text-muted-foreground font-black mt-1 uppercase tracking-widest italic">Source Node: {payment.studentEmail}</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <p className="text-sm font-black text-primary tabular-nums italic">৳{payment.amount}</p>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                                    payment.status === 'completed' ? 'text-primary border-primary bg-primary/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                                                }`}>
                                                    {payment.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorDashboard;
