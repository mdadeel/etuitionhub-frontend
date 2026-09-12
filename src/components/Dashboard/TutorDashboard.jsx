import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/ui/data-table";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from '../../contexts/ChatContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useTutorApplicationsQuery, useTutorRevenueQuery, useDeleteTutorApplicationMutation } from '@/hooks/queries/useTutorQuery';
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import TutorAvailability from './TutorAvailability';
import Assignments from './Assignments';
import DashboardPageHeader from "@/components/shared/DashboardPageHeader";
import { computeProjectedThisMonth } from '@/lib/earningsForecast';
import { 
    FileText, 
    Banknote, 
    UserCheck, 
    MessageSquare, 
    Activity, 
    Calendar, 
    BookOpen,
    Search,
    ArrowRight,
    TrendingUp,
    Wallet
} from "lucide-react";
import { cn } from '@/lib/utils';
import OnboardingChecklist from './widgets/OnboardingChecklist';
import ConfirmModal from '@/components/shared/ConfirmModal';
 
/**
 * TutorDashboard Component — High Signal-to-Noise Tutor Workspace
 */
const TutorDashboard = () => {
    const { user } = useAuth();
    const { conversations, openChatWith, fetchConversations } = useChat();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const initialTab = pathname.includes('/applications') ? 'applications' : (searchParams.get('tab') || 'overview');
    const [activeTab, setActiveTab] = useState(initialTab);
    // Batch 7: hidden tabs don't fetch — enabled only where rendered.
    const { data: apps = [], isLoading: loadingApps } = useTutorApplicationsQuery(user?.email, activeTab === 'overview' || activeTab === 'applications' || activeTab === 'ongoing');
    const { data: revenue = [], isLoading: loadingRevenue } = useTutorRevenueQuery(user?.email, activeTab === 'overview' || activeTab === 'revenue');
    const deleteAppMutation = useDeleteTutorApplicationMutation(user?.email);

    const loading = loadingApps || loadingRevenue;

    const totalEarnings = revenue.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
    const projectedThisMonth = computeProjectedThisMonth(revenue);
    const activeEngagements = apps.filter(a => a.status === 'approved').length;

    const handleDelete = (id) => setDeleteTarget(id);

    // Batch 2 (audit Exec #6): arm-then-confirm instead of native confirm().
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirming, setConfirming] = useState(false);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setConfirming(true);
        try {
            await deleteAppMutation.mutateAsync(deleteTarget);
            toast.success(t('tutorDashboard.app_deleted'));
            setDeleteTarget(null);
        } catch (err) {
            toast.error(err.response?.data?.error || t('tutorDashboard.delete_failed'));
        } finally {
            setConfirming(false);
        }
    };

    const handleContactStudent = async (app) => {
        try {
            let conv = conversations.find(c =>
                c.participants?.some(p => p._id === app.studentId || p.email === app.studentEmail)
            );
            if (conv) {
                openChatWith(conv);
                return;
            }
            await api.post('/api/messages', {
                receiverId: app.studentId || app.tuitionId?.studentId,
                text: t('tutorDashboard.first_message', "Hi! I am interested in discussing your tuition requirement.")
            });
            await fetchConversations();
            conv = conversations.find(c =>
                c.participants?.some(p => p._id === app.studentId || p.email === app.studentEmail)
            );
            if (conv) openChatWith(conv);
        } catch {
            toast.error(t('tutorDashboard.contact_failed'));
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                {/* Batch 5: keep the header mounted so the page shell never blanks */}
                <DashboardPageHeader
                    title={t('tutorDashboard.loading_title', 'Loading workspace')}
                    subtitle={t('tutorDashboard.loading_subtitle', 'Fetching your overview.')}
                />
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
        { id: 'overview', label: 'overview', icon: Activity },
        { id: 'applications', label: 'applications', icon: FileText },
        { id: 'ongoing', label: 'engagements', icon: UserCheck },
        { id: 'revenue', label: 'earnings', icon: Banknote },
        { id: 'availability', label: 'availability', icon: Calendar },
        { id: 'assignments', label: 'assignments', icon: BookOpen },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            <DashboardPageHeader
                title={t('tutorDashboard.hello', { name: user?.displayName?.split(' ')[0] || "Tutor" })}
                subtitle={t('tutorDashboard.subtitle', "Manage your applications, active engagements, schedule, and earnings.")}
                category={t('tutorDashboard.dashboard_badge', "Tutor Workspace")}
            />

            {/* Segmented Tab Navigation */}
            <div className="w-full overflow-hidden border-b border-border pb-px">
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all shrink-0",
                                activeTab === tab.id
                                    ? "border-primary text-primary bg-primary/5"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            )}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-60'} />
                            <span>{t(`tutorDashboard.tab_${tab.label}`)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <OnboardingChecklist />

                    {/* Metric Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-5 bg-card border-border" hover={false}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t('tutorDashboard.total_applications')}
                                </span>
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                                    <FileText size={15} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold font-mono text-foreground tabular-nums">{apps.length}</span>
                                <span className="text-xs text-muted-foreground">{t('tutorDashboard.sent')}</span>
                            </div>
                        </Card>

                        <Card className="p-5 bg-card border-border" hover={false}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t('tutorDashboard.active_engagements')}
                                </span>
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                                    <UserCheck size={15} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold font-mono text-foreground tabular-nums">{activeEngagements}</span>
                                <span className="text-xs text-muted-foreground">{t('tutorDashboard.jobs')}</span>
                            </div>
                        </Card>

                        <Card className="p-5 bg-card border-border" hover={false}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t('tutorDashboard.projected_month')}
                                </span>
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                                    <TrendingUp size={15} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold font-mono text-foreground tabular-nums">৳{projectedThisMonth.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">projected</span>
                            </div>
                        </Card>

                        <Card className="p-5 bg-card border-border" hover={false}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t('tutorDashboard.total_earnings')}
                                </span>
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                                    <Wallet size={15} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold font-mono text-foreground tabular-nums">৳{totalEarnings.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">withdrawn &amp; settled</span>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Applications Activity */}
                    <Card className="p-6 bg-card border-border space-y-4" hover={false}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-foreground">{t('tutorDashboard.recent_activity')}</h3>
                            {apps.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('applications')}
                                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                                >
                                    <span>View all ({apps.length})</span>
                                    <ArrowRight size={12} />
                                </button>
                            )}
                        </div>

                        {apps.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic py-4">{t('tutorDashboard.no_recent_activity')}</p>
                        ) : (
                            <div className="divide-y divide-border/60">
                                {apps.slice(0, 3).map((app) => (
                                    <div key={app._id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                                                <FileText size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-foreground">{app.tuitionId?.subject || "Tuition"}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    Status: <span className="font-semibold text-foreground">{app.status}</span> · {app.studentEmail}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Quick Actions Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-foreground">Find New Tuition Jobs</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Browse open tuition posts in your area.</p>
                            </div>
                            <Button size="sm" asChild className="shrink-0 text-xs font-semibold gap-1.5">
                                <Link to="/tuitions">
                                    <span>Browse Jobs</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </Button>
                        </div>

                        <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-foreground">Withdraw Earnings</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Transfer available balance to bKash/Nagad.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/withdraw')} className="shrink-0 text-xs font-semibold gap-1.5">
                                <Banknote size={14} />
                                <span>Withdraw</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applications Tab Content */}
            {activeTab === 'applications' && (
                <DataTable
                    rowKey={(row) => row._id}
                    data={apps}
                    emptyState={
                        <div className="p-16 text-center">
                            <Search size={36} className="text-muted-foreground/30 mx-auto mb-4" strokeWidth={1.5} />
                            <p className="text-xs font-medium text-muted-foreground italic">{t('tutorDashboard.no_pipeline_apps')}</p>
                        </div>
                    }
                    columns={[
                        {
                            key: 'tuitionId',
                            label: t('tutorDashboard.subject'),
                            render: (_, app) => (
                                <>
                                    <p className="text-xs font-bold text-foreground">{app.tuitionId?.subject || "Tuition"}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{app.studentEmail}</p>
                                </>
                            ),
                        },
                        {
                            key: 'expectedSalary',
                            label: t('tutorDashboard.expected_fee'),
                            align: 'center',
                            render: (val) => (
                                <span className="text-xs font-bold font-mono text-primary">৳{val}</span>
                            ),
                        },
                        {
                            key: 'status',
                            label: t('tutorDashboard.status'),
                            align: 'center',
                            render: (val) => (
                                <Badge 
                                    variant={val === 'approved' ? 'success' : val === 'rejected' ? 'error' : 'warning'} 
                                    className="rounded-md text-[11px]"
                                >
                                    {val}
                                </Badge>
                            ),
                        },
                        {
                            key: '_id',
                            label: t('tutorDashboard.actions'),
                            align: 'right',
                            render: (_, app) => (
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-2.5 text-xs gap-1"
                                        onClick={() => handleContactStudent(app)}
                                    >
                                        <MessageSquare size={12} />
                                        <span>Message</span>
                                    </Button>
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="text-xs font-semibold text-destructive hover:underline ml-2"
                                    >
                                        {t('tutorDashboard.delete')}
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            )}

            {/* Engagements Tab */}
            {activeTab === 'ongoing' && (
                <DataTable
                    rowKey={(row) => row._id}
                    data={apps.filter((a) => a.status === 'approved')}
                    emptyState={
                        <p className="italic py-8 text-center text-muted-foreground text-xs">{t('tutorDashboard.no_active_engagements')}</p>
                    }
                    columns={[
                        {
                            key: 'tuitionId',
                            label: t('tutorDashboard.subject'),
                            render: (_, app) => (
                                <p className="text-xs font-bold text-foreground">{app.tuitionId?.subject || "Tuition"}</p>
                            ),
                        },
                        {
                            key: 'studentEmail',
                            label: t('tutorDashboard.student_contact'),
                            render: (val) => (
                                <span className="text-xs text-muted-foreground">{val}</span>
                            ),
                        },
                        {
                            key: '_id',
                            label: t('tutorDashboard.session_actions'),
                            align: 'right',
                            render: (_, app) => (
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        size="sm"
                                        className="h-8 px-3 text-xs"
                                        onClick={() => navigate(`/session/${app.tuitionId?._id || app._id}`)}
                                    >
                                        Enter Classroom
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-5 bg-card border-border" hover={false}>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('tutorDashboard.total_settled_earnings')}</p>
                            <p className="text-2xl font-bold font-mono text-foreground mt-2">৳{totalEarnings.toLocaleString()}</p>
                        </Card>
                        <Card className="p-5 bg-card border-border" hover={false}>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('tutorDashboard.projected_this_month')}</p>
                            <p className="text-2xl font-bold font-mono text-primary mt-2">৳{projectedThisMonth.toLocaleString()}</p>
                        </Card>
                    </div>

                    <DataTable
                        rowKey={(row) => row._id}
                        data={revenue}
                        emptyState={<p className="italic py-8 text-center text-muted-foreground text-xs">{t('tutorDashboard.no_earnings_records')}</p>}
                        columns={[
                            {
                                key: 'createdAt',
                                label: t('tutorDashboard.date'),
                                render: (val) => (
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {new Date(val).toLocaleDateString()}
                                    </span>
                                ),
                            },
                            {
                                key: 'paymentMethod',
                                label: t('tutorDashboard.method'),
                                render: (val) => (
                                    <span className="text-xs font-semibold text-foreground uppercase">{val || 'bKash'}</span>
                                ),
                            },
                            {
                                key: 'grossAmount',
                                label: t('tutorDashboard.amount'),
                                render: (val) => (
                                    <span className="text-xs font-bold font-mono text-primary">৳{val}</span>
                                ),
                            },
                            {
                                key: 'status',
                                label: t('tutorDashboard.status'),
                                align: 'right',
                                render: (val) => (
                                    <Badge variant="success" className="rounded-md text-[11px]">
                                        {val}
                                    </Badge>
                                ),
                            },
                        ]}
                    />
                </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && <TutorAvailability />}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && <Assignments />}

            <ConfirmModal
                open={!!deleteTarget}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
                title={t('tutorDashboard.confirm_delete_title', 'Delete this application?')}
                description={t('tutorDashboard.confirm_delete')}
                confirmLabel={t('common.delete', 'Delete')}
                loadingLabel={t('common.working', 'Working...')}
                loading={confirming}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default TutorDashboard;
