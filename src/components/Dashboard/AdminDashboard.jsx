import { Card } from "@/components/ui/card";
import { useState } from 'react';
import DashUsers from './DashUsers';
import DashTuitions from './DashTuitions';
import DashAnalytics from './DashAnalytics';
import DashPayments from './DashPayments';
import DashSettings from './DashSettings';
import AdminVerifications from './AdminVerifications';
import DisputeWorkspace from './DisputeWorkspace';
import AdminTutors from './AdminTutors';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const tabs = [
        { id: 'analytics', label: 'Overview' },
        { id: 'payments', label: 'Payments' },
        { id: 'users', label: 'Users' },
        { id: 'tutors', label: 'Tutors' },
        { id: 'tuitions', label: 'Tuitions' },
        { id: 'verifications', label: 'Verifications' },
        { id: 'disputes', label: 'Disputes' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <div className="space-y-6 max-w-full pb-6">
            {/* Navigation Tabs */}
            <div className="w-full overflow-hidden">
                <div className="flex bg-background p-1 rounded-lg gap-1 overflow-x-auto border border-border w-full max-w-full backdrop-blur-md scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-2.5 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap min-w-fit border active:scale-[0.98]",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-transparent hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <Card className="p-4 md:p-6 min-h-fit" >
                <div className="space-y-4">
                    {activeTab === 'analytics' && <DashAnalytics />}
                    {activeTab === 'payments' && <DashPayments />}
                    {activeTab === 'users' && <DashUsers />}
                    {activeTab === 'tutors' && <AdminTutors />}
                    {activeTab === 'tuitions' && <DashTuitions />}
                    {activeTab === 'verifications' && <AdminVerifications />}
                    {activeTab === 'disputes' && <DisputeWorkspace isAdminView />}
                    {activeTab === 'settings' && <DashSettings />}
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
