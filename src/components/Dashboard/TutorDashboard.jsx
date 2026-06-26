import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/ui/data-table";
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'
import api from '../../services/api';
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import TutorAvailability from './TutorAvailability';
import Assignments from './Assignments';
import { AppleHeader } from "@/components/shared/AppleUI";
import { 
    FileText, 
    Banknote, 
    Database,
    UserCheck,
    ArrowUpRight,
    TrendingUp,
    Activity,
    Calendar,
    BookOpen,
} from "lucide-react";
import { cn } from '@/lib/utils';
import SessionStatsCard from './SessionStatsCard';
 
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
            toast.error('Failed to load earnings');
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
        { id: 'revenue', label: 'Earnings', icon: Banknote },
        { id: 'availability', label: 'Availability', icon: Calendar },
        { id: 'assignments', label: 'Assignments', icon: BookOpen },
    ];

    return (
        <div className="space-y-10 animate-fade-in-up">
            
            <AppleHeader 
                title={`Welcome back, ${user?.displayName?.split(' ')[0]}`}
                subtitle="Here's a summary of your professional activity and performance."
                badge={<span className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20">Tutor Dashboard</span>}
            />

            {/* Tab Navigation */}
            <div className="w-full overflow-hidden">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border w-full max-w-full overflow-x-auto scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all duration-300 rounded-lg whitespace-nowrap min-w-fit active:scale-[0.98]",
                                activeTab === tab.id
                                    ? "bg-card text-primary shadow-sm border border-border"
                                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            )}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-50'} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
                <div className="space-y-10">
                    <SessionStatsCard />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        <Card className="p-6 md:p-10 group" >
                            <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-primary/20 shadow-sm">
                                <FileText size={24} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Total Applications</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">{apps.length}</span>
                                <span className="text-xs font-semibold text-muted-foreground">Sent</span>
                            </div>
                        </Card>

                        <Card className="p-6 md:p-10 group" >
                            <div className="size-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-emerald-500/20 shadow-sm">
                                <UserCheck size={24} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Active Engagements</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">{activeEngagements}</span>
                                <span className="text-xs font-semibold text-muted-foreground">Jobs</span>
                            </div>
                        </Card>

                        <Card className="p-6 md:p-10 group col-span-2 lg:col-span-1" >
                            <div className="size-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-amber-500/20 shadow-sm">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Total Earnings</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-5xl font-bold text-foreground tracking-tighter tabular-nums">৳{totalEarnings}</span>
                                <span className="text-xs font-semibold text-muted-foreground">BDT</span>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-foreground tracking-tight mb-6">Recent Activity</h3>
                            {apps.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No recent activity detected.</p>
                            ) : (
                                <div className="space-y-4">
                                    {apps.slice(0, 3).map((app) => (
                                        <div key={app._id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                                            <div className="flex items-center gap-4">
                                                <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center">
                                                    <FileText size={14} className="text-primary/60" />
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
                    </Card>
                </div>
            )}

            {/* Applications Tab Content */}
            {activeTab === 'applications' && (
                <DataTable
                    rowKey={(row) => row._id}
                    data={apps}
                    emptyState={
                        <div className="p-32 text-center">
                            <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No applications in the pipeline.</p>
                        </div>
                    }
                    columns={[
                        {
                            key: 'tuitionId',
                            label: 'Subject',
                            render: (_, app) => (
                                <>
                                    <p className="text-sm font-bold text-foreground">{app.tuitionId?.subject}</p>
                                    <p className="text-xs text-muted-foreground font-medium mt-1">{app.studentEmail}</p>
                                </>
                            ),
                        },
                        {
                            key: 'expectedSalary',
                            label: 'Expected Fee',
                            align: 'center',
                            render: (val) => (
                                <span className="text-sm font-bold text-primary tabular-nums">৳{val}</span>
                            ),
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            align: 'center',
                            render: (val) => (
                                <Badge
                                    variant={val === 'approved' ? 'success' : val === 'rejected' ? 'error' : 'warning'}
                                    className="rounded-lg"
                                >
                                    {val}
                                </Badge>
                            ),
                        },
                        {
                            key: '_id',
                            label: 'Action',
                            align: 'right',
                            render: (_, app) => (
                                app.status === 'pending' ? (
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="text-xs font-bold text-red-600 hover:underline active:scale-[0.98]"
                                    >
                                        Recall Application
                                    </button>
                                ) : <span className="text-xs text-muted-foreground/40 italic">Locked</span>
                            ),
                        },
                    ]}
                />
            )}

            {/* ongoing engagements */}
            {activeTab === 'ongoing' && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                    {apps.filter(a => a.status === 'approved').length === 0 ? (
                        <Card className="md:col-span-2 p-32 text-center border-dashed">
                             <UserCheck size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No active engagements identified.</p>
                        </Card>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <Card key={app._id} className="p-4 md:p-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-lg -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-xs font-bold text-primary">Active Connection</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight">{app.tuitionId?.subject}</h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">Student Email</span>
                                            <span className="text-xs font-bold text-foreground">{app.studentEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">Monthly Fee</span>
                                            <span className="text-sm font-bold text-primary tabular-nums">৳{app.expectedSalary} <span className="text-xs text-muted-foreground opacity-50">/mo</span></span>
                                        </div>
                                    </div>
                                    
                                    <Button asChild variant="outline" className="w-full h-11 rounded-lg active:scale-[0.98]">
                                        <a href={`mailto:${app.studentEmail}`} className="flex items-center justify-center gap-2">
                                            Send Message <ArrowUpRight size={14} />
                                        </a>
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* revenue tab */}
            {activeTab === 'revenue' && (
                <Card className="overflow-hidden">
                    <div className="p-8 border-b border-border bg-background/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                             <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                                <div className="size-2 rounded-full bg-primary"></div>
                                Earnings Report
                            </h2>
                            <p className="text-xs font-medium text-muted-foreground mt-1">Audit trail for all completed tutor payments.</p>
                        </div>
                        <div className="bg-card px-8 py-4 rounded-xl border border-border shadow-sm">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Total Earnings</p>
                            <p className="text-2xl font-bold text-primary tracking-tight tabular-nums">৳{totalEarnings}</p>
                        </div>
                    </div>

                    <DataTable
                        rowKey={(row) => row._id}
                        data={revenue}
                        emptyState={
                            <div className="p-32 text-center">
                                <Banknote size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                                <p className="text-sm font-medium text-muted-foreground italic">No payment history found.</p>
                            </div>
                        }
                        columns={[
                            {
                                key: 'createdAt',
                                label: 'Date',
                                render: (val) => (
                                    <span className="text-xs font-bold text-muted-foreground uppercase tabular-nums tracking-widest">
                                        {new Date(val).toLocaleDateString()}
                                    </span>
                                ),
                            },
                            {
                                key: 'tuitionId',
                                label: 'Subject / Student',
                                render: (_, payment) => (
                                    <>
                                        <p className="text-sm font-bold text-foreground">{payment.tuitionId?.subject || 'Tutoring Fee'}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">{payment.studentEmail}</p>
                                    </>
                                ),
                            },
                            {
                                key: 'grossAmount',
                                label: 'Amount',
                                align: 'center',
                                render: (val) => (
                                    <span className="text-sm font-bold text-primary tabular-nums">৳{val}</span>
                                ),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                align: 'right',
                                render: (val) => (
                                    <Badge
                                        variant={val === 'confirmed' ? 'success' : 'default'}
                                        className="rounded-lg"
                                    >
                                        {val}
                                    </Badge>
                                ),
                            },
                        ]}
                    />
                </Card>
            )}
            {activeTab === 'availability' && <TutorAvailability />}
            {activeTab === 'assignments' && <Assignments />}
        </div>
    );
};

export default TutorDashboard;
