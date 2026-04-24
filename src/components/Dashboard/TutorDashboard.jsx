import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    Activity, 
    FileText, 
    Banknote, 
    Trash2,
    Database,
    Clock,
    UserCheck,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppleCard, AppleBadge, AppleHeader, AppleButton } from '../shared/AppleUI';
import { cn } from '@/lib/utils';

/**
 * TutorDashboard Component — Refined Apple Aesthetic
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
        if (!confirm('Permanently remove this application?')) return;
        try {
            await api.delete(`/api/applications/${id}`);
            toast.success("Application removed");
            setApps(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed.');
        }
    };

    if (loading) return <LoadingSpinner />;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'ongoing', label: 'Engagements', icon: UserCheck },
        { id: 'revenue', label: 'Earnings', icon: Banknote }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            
            <AppleHeader 
                title={`Welcome back, ${user?.displayName?.split(' ')[0]}`}
                subtitle="Here's a summary of your professional activity and performance."
                badge={<AppleBadge variant="primary">Specialist Dashboard</AppleBadge>}
            />

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl border border-border/40 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 text-xs font-semibold transition-all duration-300 rounded-xl",
                            activeTab === tab.id
                                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-50'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AppleCard className="p-8 group">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Total Applications</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{apps.length}</span>
                                <span className="text-xs font-medium text-muted-foreground">submitted</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-8 group">
                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <UserCheck size={20} />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Active Engagements</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{activeEngagements}</span>
                                <span className="text-xs font-medium text-muted-foreground">approved</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-8 group">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={20} />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Total Earnings</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">৳{totalEarnings}</span>
                                <span className="text-xs font-medium text-muted-foreground">BDT</span>
                            </div>
                        </AppleCard>
                    </div>

                    <AppleCard className="p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-foreground tracking-tight mb-6">Recent Activity</h3>
                            {apps.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No recent activity detected.</p>
                            ) : (
                                <div className="space-y-4">
                                    {apps.slice(0, 3).map((app, i) => (
                                        <div key={app._id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/40">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-background border border-border/40 flex items-center justify-center">
                                                    <FileText size={14} className="text-primary/60" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{app.tuitionId?.subject}</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{app.status}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </AppleCard>
                </div>
            )}

            {/* Applications Tab Content */}
            {activeTab === 'applications' && (
                <AppleCard className="overflow-hidden">
                    {apps.length === 0 ? (
                        <div className="p-32 text-center">
                            <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No applications in the pipeline.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 border-b border-border/40">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Subject</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Expected Yield</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {apps.map((app) => (
                                        <tr key={app._id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{app.tuitionId?.subject}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">{app.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-primary tabular-nums">৳{app.expectedSalary}</td>
                                            <td className="px-8 py-6 text-center">
                                                <AppleBadge variant={app.status === 'approved' ? 'primary' : app.status === 'rejected' ? 'error' : 'default'} className="normal-case">
                                                    {app.status}
                                                </AppleBadge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {app.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => handleDelete(app._id)}
                                                        className="text-[10px] font-bold text-destructive hover:underline"
                                                    >
                                                        Recall Application
                                                    </button>
                                                ) : <span className="text-[10px] text-muted-foreground/40 italic">Locked</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AppleCard>
            )}

            {/* ongoing engagements */}
            {activeTab === 'ongoing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apps.filter(a => a.status === 'approved').length === 0 ? (
                        <AppleCard className="md:col-span-2 p-32 text-center border-dashed">
                             <UserCheck size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No active engagements identified.</p>
                        </AppleCard>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <AppleCard key={app._id} className="p-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Connection</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight">{app.tuitionId?.subject}</h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">Student Node</span>
                                            <span className="text-xs font-bold text-foreground">{app.studentEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">Cycle Yield</span>
                                            <span className="text-sm font-bold text-primary tabular-nums">৳{app.expectedSalary} <span className="text-[10px] text-muted-foreground opacity-50">/mo</span></span>
                                        </div>
                                    </div>
                                    
                                    <AppleButton asChild variant="outline" className="w-full h-11 rounded-xl">
                                        <a href={`mailto:${app.studentEmail}`} className="flex items-center justify-center gap-2">
                                            Send Message <ArrowUpRight size={14} />
                                        </a>
                                    </AppleButton>
                                </div>
                            </AppleCard>
                        ))
                    )}
                </div>
            )}

            {/* revenue tab */}
            {activeTab === 'revenue' && (
                <AppleCard className="overflow-hidden">
                    <div className="p-8 border-b border-border/40 bg-muted/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                             <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                Yield Report
                            </h2>
                            <p className="text-xs font-medium text-muted-foreground mt-1">Audit trail for all completed node transmissions.</p>
                        </div>
                        <div className="bg-background px-8 py-4 rounded-2xl border border-border/40 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Yield</p>
                            <p className="text-2xl font-bold text-primary tracking-tight tabular-nums">৳{totalEarnings}</p>
                        </div>
                    </div>

                    {revenue.length === 0 ? (
                        <div className="p-32 text-center">
                            <Banknote size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No financial history logs identified.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 border-b border-border/40">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Date</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Source Node</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Yield</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {revenue.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6 text-[10px] font-bold text-muted-foreground uppercase tabular-nums tracking-widest">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{payment.tuitionId?.subject || 'External Node'}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">{payment.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-primary tabular-nums">৳{payment.amount}</td>
                                            <td className="px-8 py-6 text-right">
                                                <AppleBadge variant={payment.status === 'completed' ? 'primary' : 'default'} className="normal-case">
                                                    {payment.status}
                                                </AppleBadge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AppleCard>
            )}
        </div>
    );
};

export default TutorDashboard;
