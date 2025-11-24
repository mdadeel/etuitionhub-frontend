// Admin Dashboard - main component with tabs
import { useState } from 'react';
import DashUsers from './DashUsers';
import DashTuitions from './DashTuitions';
import DashAnalytics from './DashAnalytics';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* tabs */}
            <div className="tabs tabs-boxed mb-6">
                <a
                    className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </a>
                <a
                    className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </a>
                <a
                    className={`tab ${activeTab === 'tuitions' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('tuitions')}
                >
                    Tuitions
                </a>
            </div>

            {/* tab content */}
            {activeTab === 'analytics' && <DashAnalytics />}
            {activeTab === 'users' && <DashUsers />}
            {activeTab === 'tuitions' && <DashTuitions />}
        </div>
    );
};

export default AdminDashboard;
