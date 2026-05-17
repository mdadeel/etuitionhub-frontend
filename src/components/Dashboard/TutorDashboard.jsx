import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom';
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
import { AppleCard, AppleHeader, AppleButton } from '../shared/AppleUI';
import { cn } from '@/lib/utils';

/**
 * TutorDashboard Component — Refined Apple Aesthetic
 */
const TutorDashboard = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState([]);

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

    const totalEarnings = revenue.reduce((sum, p) => sum + (p.amount || 0), 0);
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
                badge={<span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">Specialist Dashboard</span>}
            />

            {/* Tab Navigation */}
            <div className="w-full overflow-hidden">
                <div className="flex items-center gap-1 bg-[#EEF2F6] p-1 rounded-2xl border border-[rgba(15,23,46,0.08)] w-full max-w-full overflow-x-auto scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all duration-300 rounded-xl whitespace-nowrap min-w-fit",
                                activeTab === tab.id
                                    ? "bg-white text-[#2563EB] shadow-sm border border-[rgba(15,23,46,0.08)]"
                                    : "text-[#5B6475] hover:text-[#111827] hover:bg-white/50"
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
                            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-[#2563EB]/20 shadow-sm">
                                <FileText size={24} />
                            </div>
                            <p className="text-xs font-semibold text-[#5B6475] mb-2">Total Applications</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-5xl font-bold text-[#111827] tracking-tighter tabular-nums">{apps.length}</span>
                                <span className="text-xs font-semibold text-[#5B6475]">Sent</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-6 md:p-10 group" hover={false}>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-emerald-500/20 shadow-sm">
                                <UserCheck size={24} />
                            </div>
                            <p className="text-xs font-semibold text-[#5B6475] mb-2">Active Engagements</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-5xl font-bold text-[#111827] tracking-tighter tabular-nums">{activeEngagements}</span>
                                <span className="text-xs font-semibold text-[#5B6475]">Jobs</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-6 md:p-10 group col-span-2 lg:col-span-1" hover={false}>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-amber-500/20 shadow-sm">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-xs font-semibold text-[#5B6475] mb-2">Total Earnings</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-5xl font-bold text-[#111827] tracking-tighter tabular-nums">৳{totalEarnings}</span>
                                <span className="text-xs font-semibold text-[#5B6475]">BDT</span>
                            </div>
                        </AppleCard>
                    </div>

                    <AppleCard className="p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-[#111827] tracking-tight mb-6">Recent Activity</h3>
                            {apps.length === 0 ? (
                                <p className="text-sm text-[#5B6475] italic">No recent activity detected.</p>
                            ) : (
                                <div className="space-y-4">
                                    {apps.slice(0, 3).map((app) => (
                                        <div key={app._id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)] flex items-center justify-center">
                                                    <FileText size={14} className="text-[#2563EB]/60" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#111827]">{app.tuitionId?.subject}</p>
                                                    <p className="text-xs font-medium text-[#5B6475] mt-0.5">{app.status}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-[#5B6475] tabular-nums">
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
                            <Database size={48} className="text-[#5B6475]/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-[#5B6475] italic">No applications in the pipeline.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F5F7FA] border-b border-[rgba(15,23,46,0.08)]">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475]">Subject</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475] text-center">Expected Yield</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475] text-center">Status</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(15,23,46,0.08)]">
                                    {apps.map((app) => (
                                        <tr key={app._id} className="hover:bg-[#F5F7FA]/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-[#111827]">{app.tuitionId?.subject}</p>
                                                <p className="text-xs text-[#5B6475] font-medium mt-1">{app.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-[#2563EB] tabular-nums">৳{app.expectedSalary}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${app.status === 'approved' ? 'bg-[#2563EB]/10 text-[#2563EB]' : app.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-[#F5F7FA] text-[#5B6475]'}`}>
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
                                                ) : <span className="text-xs text-[#5B6475]/40 italic">Locked</span>}
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
                             <UserCheck size={48} className="text-[#5B6475]/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-[#5B6475] italic">No active engagements identified.</p>
                        </AppleCard>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <AppleCard key={app._id} className="p-4 md:p-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></div>
                                        <span className="text-xs font-bold text-[#2563EB]">Active Connection</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#111827] mb-8 tracking-tight">{app.tuitionId?.subject}</h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-[#5B6475]">Student Node</span>
                                            <span className="text-xs font-bold text-[#111827]">{app.studentEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-[#5B6475]">Cycle Yield</span>
                                            <span className="text-sm font-bold text-[#2563EB] tabular-nums">৳{app.expectedSalary} <span className="text-xs text-[#5B6475] opacity-50">/mo</span></span>
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
                    <div className="p-8 border-b border-[rgba(15,23,46,0.08)] bg-[#F5F7FA]/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                             <h2 className="text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                                Yield Report
                            </h2>
                            <p className="text-xs font-medium text-[#5B6475] mt-1">Audit trail for all completed node transmissions.</p>
                        </div>
                        <div className="bg-white px-8 py-4 rounded-2xl border border-[rgba(15,23,46,0.08)] shadow-sm">
                            <p className="text-xs font-semibold text-[#5B6475] mb-1">Total Yield</p>
                            <p className="text-2xl font-bold text-[#2563EB] tracking-tight tabular-nums">৳{totalEarnings}</p>
                        </div>
                    </div>

                    {revenue.length === 0 ? (
                        <div className="p-32 text-center">
                            <Banknote size={48} className="text-[#5B6475]/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-[#5B6475] italic">No financial history logs identified.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F5F7FA] border-b border-[rgba(15,23,46,0.08)]">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475]">Date</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475]">Source Node</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475] text-center">Yield</th>
                                        <th className="px-8 py-5 text-xs font-semibold text-[#5B6475] text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(15,23,46,0.08)]">
                                    {revenue.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-[#F5F7FA]/50 transition-colors">
                                            <td className="px-8 py-6 text-xs font-bold text-[#5B6475] uppercase tabular-nums tracking-widest">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-[#111827]">{payment.tuitionId?.subject || 'External Node'}</p>
                                                <p className="text-xs text-[#5B6475] font-medium mt-1">{payment.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-[#2563EB] tabular-nums">৳{payment.amount}</td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${payment.status === 'verified' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#F5F7FA] text-[#5B6475]'}`}>
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
