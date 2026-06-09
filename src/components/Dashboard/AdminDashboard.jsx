import { useState } from 'react';
import DashUsers from './DashUsers';
import DashTuitions from './DashTuitions';
import DashAnalytics from './DashAnalytics';
import DashPayments from './DashPayments';
import DashSettings from './DashSettings';
import AdminVerifications from './AdminVerifications';
import { 
    AppleCard, 
    AppleBadge,
    AppleHeader 
} from '../shared/AppleUI';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const tabs = [
        { id: 'analytics', label: 'Overview' },
        { id: 'payments', label: 'Payments' },
        { id: 'users', label: 'Users' },
        { id: 'tuitions', label: 'Tuitions' },
        { id: 'verifications', label: 'Verifications' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <div className="animate-in fade-in duration-700 space-y-10 max-w-full pb-10 animate-fade-in-up">
            <AppleHeader 
                title="Management" 
                subtitle="High-precision monitoring and strategic platform administration."
                badge={<AppleBadge variant="primary">System Command</AppleBadge>}
                action={
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-none">
                        <span className="size-2 bg-emerald-500 animate-pulse rounded-lg"></span>
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Protocol Active</span>
                    </div>
                }
            />

            {/* Navigation Tabs */}
            <div className="w-full overflow-hidden">
                <div className="flex bg-background p-1.5 rounded-lg gap-2 overflow-x-auto border border-border w-full max-w-full backdrop-blur-md scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-6 py-3 text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap min-w-fit border active:scale-[0.98]",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-transparent hover:text-accent-foreground hover:bg-accent"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <AppleCard className="p-4 md:p-10 min-h-fit" hover={false}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'analytics' && <DashAnalytics />}
                    {activeTab === 'payments' && <DashPayments />}
                    {activeTab === 'users' && <DashUsers />}
                    {activeTab === 'tuitions' && <DashTuitions />}
                    {activeTab === 'verifications' && <AdminVerifications />}
                    {activeTab === 'settings' && <DashSettings />}
                </div>
            </AppleCard>
        </div>
    );
};

export default AdminDashboard;
