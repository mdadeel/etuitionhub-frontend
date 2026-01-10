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
        <div className="fade-up space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-600">Professional Architecture</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Strategic Dashboard</h1>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mt-3">{dbUser?.displayName} // SESSION: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1 border border-gray-100/50 overflow-x-auto shrink-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-teal-600 shadow-md ring-1 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 group-hover:text-teal-600 transition-colors">Pipeline Volume</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">{apps.length}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Active Requests</span>
                        </div>
                    </div>
                    <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 group-hover:text-teal-600 transition-colors">Current Tenure</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-teal-600 tracking-tighter">{activeStudents}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Engagements</span>
                        </div>
                    </div>
                    <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 group-hover:text-teal-600 transition-colors">Cumulative Yield</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">৳{totalEarnings}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Protocol BDT</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {apps.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-sm mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">No pipeline records available within this infrastructure.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reference</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Academic Target</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Protocol Yield</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Verification</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {apps.map((app, idx) => (
                                        <tr key={app._id} className="hover:bg-teal-50/20 transition-colors">
                                            <td className="px-8 py-6 text-xs font-black text-gray-400">#PROTO-0{idx + 1}</td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{app.tuitionId?.subject}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">{app.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                 <p className="text-sm font-black text-teal-600 tracking-tighter">৳{app.expectedSalary}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border shadow-sm ${app.status === 'approved' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                    app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-gray-50 text-gray-400 border-gray-100'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {app.status === 'pending' && (
                                                    <button
                                                        className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-all px-4 py-2 hover:bg-red-50 rounded-lg"
                                                        onClick={() => handleDelete(app._id)}
                                                    >
                                                        Recall
                                                    </button>
                                                )}
                                                {app.status !== 'pending' && (
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">— FINALIZED —</span>
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
                        <div className="col-span-full p-24 bg-white border border-dashed border-gray-100 rounded-3xl text-center">
                             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-sm mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">No active engagements identified within system nodes.</p>
                        </div>
                    ) : (
                        apps.filter(a => a.status === 'approved').map(app => (
                            <div key={app._id} className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">Verified Protocol</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight leading-none">{app.tuitionId?.subject}</h3>
                                    <div className="space-y-4 pt-6 border-t border-gray-50">
                                        <div className="flex justify-between items-center group/row">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Identity</span>
                                            <span className="text-xs font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{app.studentEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center group/row">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployment Locale</span>
                                            <span className="text-xs font-black text-gray-500 italic lowercase">{app.tuitionId?.location}</span>
                                        </div>
                                        <div className="flex justify-between items-center group/row">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Rate</span>
                                            <span className="text-sm font-black text-teal-600 tracking-tighter">৳{app.expectedSalary} <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">/ cycle</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-gray-100 bg-gray-50/20 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                Yield Manifest
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mt-1">Audit of financial protocol transmissions</p>
                        </div>
                        <div className="text-right bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Total System Yield</p>
                            <p className="text-2xl font-black text-teal-600 tracking-tighter">৳{totalEarnings}</p>
                        </div>
                    </div>

                    {revenue.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-sm mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">No financial history logs identified.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Timestamp</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Allocation Target</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Yield Amount</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {revenue.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-teal-50/20 transition-colors">
                                            <td className="px-8 py-6 text-xs font-black text-gray-400">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{payment.tuitionId?.subject || 'External Transmission'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">Source: {payment.studentEmail}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-black text-teal-600 tracking-tighter">৳{payment.amount}</td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border shadow-sm ${payment.status === 'completed' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-amber-50 text-amber-700 border-amber-100'
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
