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
                badge={<span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-blue-50 text-blue-600 border border-blue-100">System Command</span>}
                action={
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Protocol Active</span>
                    </div>
                }
            />

            {/* Navigation Tabs */}
            <div className="w-full overflow-hidden">
                <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 overflow-x-auto border border-slate-200 w-full max-w-full backdrop-blur-md scrollbar-hide flex-nowrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-6 py-3 text-[10px] font-bold rounded-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap uppercase tracking-widest min-w-fit",
                                activeTab === tab.id
                                    ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <AppleCard className="p-4 md:p-12 min-h-fit bg-white border border-slate-200 shadow-xl rounded-3xl md:rounded-[2.5rem]" hover={false}>
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
