// tutor dashboard - revenue tracking and stuff
import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast'
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const TutorDashboard = () => {
    const { user, dbUser } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState([]);

    useEffect(() => {
        if (user?.email) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            const appResponse = await api.get(`/api/applications/tutor/${user.email}`);
            setApps(appResponse.data || []);

            try {
                const revenueRes = await api.get(`/api/payments/tutor/${user.email}`);
                setRevenue(revenueRes.data || []);
            } catch (e) {
                // Revenue fetch may fail if no payments yet
                console.log('Revenue fetch:', e.message);
            }
        } catch (e) {
            console.error("Dashboard Load Error:", e);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = revenue.reduce((sum, p) => sum + (p.amount || 0), 0);
    const activeStudents = apps.filter(a => a.status === 'approved').length;

    const handleDelete = async (id) => {
        if (!confirm('Permanently remove this application documentation?')) return;

        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(id)) {
            toast.error('System Integrity: Demo data is read-only.');
            return;
        }

        try {
            await api.delete(`/api/applications/${id}`);
            toast.success("Record expunged.");
            setApps(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed.');
        }
    };

    if (loading) return <LoadingSpinner />;

    const tabs = [
        { id: 'overview', label: 'Strategic Overview' },
        { id: 'applications', label: 'Active Pipeline' },
        { id: 'ongoing', label: 'Ongoing Engagements' },
        { id: 'revenue', label: 'Financial History' }
    ];

    return (
        <div className="fade-up">
            <header className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Management Interface</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Professional Dashboard</h1>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-sm gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Pipeline Volume</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-gray-900">{apps.length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Requests</span>
                        </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Active Tenure</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-indigo-600">{activeStudents}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Engagements</span>
                        </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Accumulated Yield</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-gray-900">৳{totalEarnings}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">BDT</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                    {apps.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zero active pipeline records found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Reference</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Valuation</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {apps.map((app, idx) => (
                                        <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-gray-400">#0{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{app.tuitionId?.subject}</p>
                                                <p className="text-[10px] text-gray-400">{app.studentEmail}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">৳{app.expectedSalary}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-gray-50 text-gray-400 border-gray-100'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {app.status === 'pending' && (
                                                    <button
                                                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                                        onClick={() => handleDelete(app._id)}
                                                    >
                                                        Recall
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'ongoing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {apps.filter(a => a.status === 'approved').length === 0 ? (
                        <div className="col-span-full p-20 bg-white border border-dashed border-gray-200 rounded-sm text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No active engagements on record.</p>
                        </div>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <div key={app._id} className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-4 block">Verified Engagement</span>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{app.tuitionId?.subject}</h3>
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 uppercase tracking-widest font-bold">Client</span>
                                        <span className="text-gray-900 font-bold">{app.studentEmail}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 uppercase tracking-widest font-bold">Location</span>
                                        <span className="text-gray-900 font-bold">{app.tuitionId?.location}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 uppercase tracking-widest font-bold">Yield</span>
                                        <span className="text-indigo-600 font-bold">৳{app.expectedSalary} / mo</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Yield Logs</h2>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Accumulation</p>
                            <p className="text-xl font-extrabold text-indigo-600">৳{totalEarnings}</p>
                        </div>
                    </div>

                    {revenue.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No financial history logs available.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/30 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {revenue.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-gray-400">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{payment.tuitionId?.subject || 'Direct Payment'}</p>
                                                <p className="text-[10px] text-gray-400">From {payment.studentEmail}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-extrabold text-gray-900">৳{payment.amount}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${payment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorDashboard
