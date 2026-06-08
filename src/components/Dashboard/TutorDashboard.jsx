import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'
import api from '../../services/api';
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/skeletons";
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
import { AppleCard, AppleHeader, AppleButton } from '../shared/AppleUI';
import { cn } from '@/lib/utils';

/**
 * TutorDashboard Component — Refined Apple Aesthetic
 */
const TutorDashboard = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const initialTab = pathname.includes('/applications') ? 'applications' : (searchParams.get('tab') || 'overview');
    const [activeTab, setActiveTab] = useState(initialTab);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState([]);

    useEffect(() => {
        if (pathname.includes('/applications')) {
            setActiveTab('applications');
        } else {
            setActiveTab(searchParams.get('tab') || 'overview');
        }
    }, [pathname, searchParams]);

    // Fetch applications
    const fetchApplications = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await api.get(`/api/applications/tutor/${user.email}`);
            setApps(res.data || []);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            toast.error('Failed to load applications');
            setApps([]);
        }
    }, [user?.email]);

    // Fetch earnings
    const fetchRevenue = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await api.get(`/api/payments/tutor/${user.email}`);
            setRevenue(res.data || []);
        } catch (err) {
            console.error('Failed to fetch earnings:', err);
            setRevenue([]);
        }
    }, [user?.email]);

    // Initial data fetch
    useEffect(() => {
        if (!user?.email) return;
        
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchApplications(),
                    fetchRevenue()
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user?.email, fetchApplications, fetchRevenue]);

    const totalEarnings = revenue.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
    const activeEngagements = apps.filter(a => a.status === 'approved').length;

    const handleDelete = async (id) => {
        if (!confirm('Delete this application?')) return;
        try {
            await api.delete(`/api/applications/${id}`);
            toast.success('Application deleted');
            await fetchApplications();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete application');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>
                <TableSkeleton rows={5} columns={4} />
            </div>
        );
    }

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
                badge={<span className="px-3 py-1 text-xs font-semibold rounded-none bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">Tutor Dashboard</span>}
            />

            {/* Tab Navigation */}
            <div className="w-full overflow-hidden">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-none border border-border w-full max-w-full overflow-x-auto scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all duration-300 rounded-none whitespace-nowrap min-w-fit",
                                activeTab === tab.id
                                    ? "bg-card text-[#2563EB] shadow-sm border border-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            )}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-[#2563EB]' : 'opacity-50'} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        <AppleCard className="p-6 md:p-10 group" hover={false}>
                            <div className="size-12 rounded-none bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-[#2563EB]/20 shadow-sm">
                                <FileText size={24} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Total Applications</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">{apps.length}</span>
                                <span className="text-xs font-semibold text-muted-foreground">Sent</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-6 md:p-10 group" hover={false}>
                            <div className="size-12 rounded-none bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-emerald-500/20 shadow-sm">
                                <UserCheck size={24} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Active Engagements</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">{activeEngagements}</span>
                                <span className="text-xs font-semibold text-muted-foreground">Jobs</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-6 md:p-10 group col-span-2 lg:col-span-1" hover={false}>
                            <div className="size-12 rounded-none bg-amber-500/10 text-amber-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-amber-500/20 shadow-sm">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Total Earnings</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">৳{totalEarnings}</span>
                                <span className="text-xs font-semibold text-muted-foreground">BDT</span>
                            </div>
                        </AppleCard>
                    </div>

                    <AppleCard className="p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 size-64 bg-[#2563EB]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-foreground tracking-tight mb-6">Recent Activity</h3>
                            {apps.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No recent activity detected.</p>
                            ) : (
                                <div className="space-y-4">
                                    {apps.slice(0, 3).map((app) => (
                                        <div key={app._id} className="flex items-center justify-between p-4 rounded-none bg-background border border-border">
                                            <div className="flex items-center gap-4">
                                                <div className="size-8 rounded-none bg-background border border-border flex items-center justify-center">
                                                    <FileText size={14} className="text-[#2563EB]/60" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{app.tuitionId?.subject}</p>
                                                    <p className="text-xs font-medium text-muted-foreground mt-0.5">{app.status}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-muted-foreground tabular-nums">
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
                                <thead className="bg-background border-b border-border">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">Subject</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-center">Expected Fee</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-center">Status</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(15,23,46,0.08)]">
                                    {apps.map((app) => (
                                        <tr key={app._id} className="hover:bg-background/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{app.tuitionId?.subject}</p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{app.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-[#2563EB] tabular-nums">৳{app.expectedSalary}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-none ${app.status === 'approved' ? 'bg-[#2563EB]/10 text-[#2563EB]' : app.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-background text-muted-foreground'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {app.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => handleDelete(app._id)}
                                                        className="text-xs font-bold text-red-600 hover:underline"
                                                    >
                                                        Recall Application
                                                    </button>
                                                ) : <span className="text-xs text-muted-foreground/40 italic">Locked</span>}
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
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                    {apps.filter(a => a.status === 'approved').length === 0 ? (
                        <AppleCard className="md:col-span-2 p-32 text-center border-dashed">
                             <UserCheck size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No active engagements identified.</p>
                        </AppleCard>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <AppleCard key={app._id} className="p-4 md:p-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-[#2563EB]/5 rounded-none -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="size-2 rounded-full bg-[#2563EB] animate-pulse"></div>
                                        <span className="text-xs font-bold text-[#2563EB]">Active Connection</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight">{app.tuitionId?.subject}</h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">Student Email</span>
                                            <span className="text-xs font-bold text-foreground">{app.studentEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">Monthly Fee</span>
                                            <span className="text-sm font-bold text-[#2563EB] tabular-nums">৳{app.expectedSalary} <span className="text-xs text-muted-foreground opacity-50">/mo</span></span>
                                        </div>
                                    </div>
                                    
                                    <AppleButton asChild variant="outline" className="w-full h-11 rounded-none">
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
                    <div className="p-8 border-b border-border bg-background/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                             <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                                <div className="size-2 rounded-full bg-[#2563EB]"></div>
                                Earnings Report
                            </h2>
                            <p className="text-xs font-medium text-muted-foreground mt-1">Audit trail for all completed tutor payments.</p>
                        </div>
                        <div className="bg-card px-8 py-4 rounded-none border border-border shadow-sm">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Total Earnings</p>
                            <p className="text-2xl font-bold text-[#2563EB] tracking-tight tabular-nums">৳{totalEarnings}</p>
                        </div>
                    </div>

                    {revenue.length === 0 ? (
                        <div className="p-32 text-center">
                            <Banknote size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No payment history found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-background border-b border-border">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">Date</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground">Subject / Student</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-center">Amount</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-muted-foreground text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(15,23,46,0.08)]">
                                    {revenue.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-background/50 transition-colors">
                                            <td className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tabular-nums tracking-widest">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{payment.tuitionId?.subject || 'Tutoring Fee'}</p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{payment.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-[#2563EB] tabular-nums">৳{payment.grossAmount}</td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-none ${payment.status === 'verified' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-background text-muted-foreground'}`}>
                                                    {payment.status}
                                                </span>
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
