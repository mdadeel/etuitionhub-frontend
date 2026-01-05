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
        <div className="fade-up">
            <header className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2 block">Administrative Interface</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Infrastructure</h1>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-sm gap-1 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* tab content */}
            {activeTab === 'analytics' && <DashAnalytics />}
            {activeTab === 'payments' && <DashPayments />}
            {activeTab === 'users' && <DashUsers />}
            {activeTab === 'tuitions' && <DashTuitions />}
        </div>
    );
};

export default AdminDashboard;

