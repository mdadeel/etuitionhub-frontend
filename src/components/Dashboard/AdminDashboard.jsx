import { useState } from 'react';
import DashUsers from './DashUsers';
import DashTuitions from './DashTuitions';
import DashAnalytics from './DashAnalytics';
import DashPayments from './DashPayments';
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
        { id: 'tuitions', label: 'Tuitions' }
    ];

    return (
        <div className="animate-in fade-in duration-700 space-y-8 max-w-full pb-10">
            <AppleHeader 
                title="Dashboard" 
                subtitle="Track platform performance and manage users effectively."
                badge={<AppleBadge variant="primary">Administrator</AppleBadge>}
                action={
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">System Live</span>
                    </div>
                }
            />

            {/* Navigation Tabs */}
            <div className="flex bg-black/[0.03] dark:bg-white/[0.05] p-1.5 rounded-2xl gap-1 overflow-x-auto border border-black/[0.02] dark:border-white/[0.02] w-fit backdrop-blur-md">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-6 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 hover:bg-white/50 dark:hover:bg-zinc-800/50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AppleCard className="p-8 min-h-[600px] bg-white/40 dark:bg-black/20" hover={false}>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {activeTab === 'analytics' && <DashAnalytics />}
                    {activeTab === 'payments' && <DashPayments />}
                    {activeTab === 'users' && <DashUsers />}
                    {activeTab === 'tuitions' && <DashTuitions />}
                </div>
            </AppleCard>
        </div>
    );
};

export default AdminDashboard;

