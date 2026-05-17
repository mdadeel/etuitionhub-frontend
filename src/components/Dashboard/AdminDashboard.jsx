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
        { id: 'tuitions', label: 'Tuitions' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <div className="animate-in fade-in duration-700 space-y-10 max-w-full pb-10">
            <AppleHeader 
                title="Management" 
                subtitle="High-precision monitoring and strategic platform administration."
                badge={<span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">System Command</span>}
                action={
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-emerald-600">Protocol Active</span>
                    </div>
                }
            />

            {/* Navigation Tabs */}
            <div className="w-full overflow-hidden">
                <div className="flex bg-[#EEF2F6] p-1 rounded-2xl gap-1 overflow-x-auto border border-[rgba(15,23,46,0.08)] w-full max-w-full backdrop-blur-md scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-6 py-3 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap min-w-fit",
                                activeTab === tab.id
                                    ? "bg-white text-[#2563EB] shadow-sm border border-[rgba(15,23,46,0.08)]"
                                    : "text-[#5B6475] hover:text-[#111827] hover:bg-white/50"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <AppleCard className="p-4 md:p-12 min-h-fit" hover={false}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'analytics' && <DashAnalytics />}
                    {activeTab === 'payments' && <DashPayments />}
                    {activeTab === 'users' && <DashUsers />}
                    {activeTab === 'tuitions' && <DashTuitions />}
                    {activeTab === 'settings' && <DashSettings />}
                </div>
            </AppleCard>
        </div>
    );
};

export default AdminDashboard;
