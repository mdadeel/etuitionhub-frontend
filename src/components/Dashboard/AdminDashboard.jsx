// Admin Dashboard - main component with tabs
import { useState } from 'react';
import DashUsers from './DashUsers';
import DashTuitions from './DashTuitions';
import DashAnalytics from './DashAnalytics';
import DashPayments from './DashPayments';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const tabs = [
        { id: 'analytics', label: 'Systems Intelligence' },
        { id: 'payments', label: 'Payment Verification' },
        { id: 'users', label: 'Identity Management' },
        { id: 'tuitions', label: 'Marketplace Operations' }
    ];

    return (
        <div className="fade-up space-y-6 max-w-full overflow-hidden px-1">
            <header className="bg-white p-7 rounded-[1.5rem] border border-gray-100 shadow-xl shadow-teal-500/5 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50/50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100/50">System Control</span>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-100">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-green-600">Live Status</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Administrative <span className="text-teal-600">Control</span></h1>
                        <p className="mt-2 text-xs font-medium text-gray-400 max-w-2xl">Global ecosystem orchestration and real-time marketplace intelligence.</p>
                    </div>

                    <div className="flex bg-gray-100/80 backdrop-blur-md p-1 rounded-xl gap-1 overflow-x-auto border border-white shadow-inner scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 text-[9px] whitespace-nowrap font-black uppercase tracking-[0.12em] rounded-lg transition-all duration-500 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-white text-teal-600 shadow-sm ring-1 ring-teal-100'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/40'
                                    }`}
                            >
                                {activeTab === tab.id && <span className="w-1 h-1 rounded-full bg-teal-500"></span>}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <div className="bg-white rounded-[1.8rem] border border-gray-100 shadow-lg shadow-teal-900/5 p-8 min-h-[600px] relative">
                <div className="absolute top-8 right-8 opacity-5 pointer-events-none">
                    <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" className="text-teal-600" />
                    </svg>
                </div>
                {activeTab === 'analytics' && <DashAnalytics />}
                {activeTab === 'payments' && <DashPayments />}
                {activeTab === 'users' && <DashUsers />}
                {activeTab === 'tuitions' && <DashTuitions />}
            </div>
        </div>
    );
};

export default AdminDashboard;

