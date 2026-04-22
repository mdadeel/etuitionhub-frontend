import { useState } from 'react';
import DashUsers from './DashUsers';
import DashTuitions from './DashTuitions';
import DashAnalytics from './DashAnalytics';
import DashPayments from './DashPayments';
import DashSettings from './DashSettings';
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
        <div className="animate-in fade-in duration-700 space-y-10 max-w-full pb-10">
            <AppleHeader 
                title="Management" 
                subtitle="High-precision monitoring and strategic platform administration."
                badge={<AppleBadge variant="primary">Administrator</AppleBadge>}
                action={
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Protocol Active</span>
                    </div>
                }
            />

            {/* Navigation Tabs */}
            <div className="flex bg-muted/50 p-1.5 rounded-2xl gap-1 overflow-x-auto border border-border/50 w-fit backdrop-blur-md">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-8 py-3 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap uppercase tracking-widest",
                            activeTab === tab.id
                                ? "bg-background text-primary shadow-apple-sm ring-1 ring-border/50"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AppleCard className="p-10 min-h-[600px] bg-muted/20" hover={false}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
