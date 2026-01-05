// tuition management dashboard - admin approve/reject
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

var isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

// demo data fallback
var demoTuitions = [
    { _id: 'demo1', subject: 'Mathematics', class_name: 'Class 10', location: 'Dhanmondi', salary: 5000, student_email: 'student@demo.com', status: 'pending' },
    { _id: 'demo2', subject: 'Physics', class_name: 'HSC', location: 'Uttara', salary: 7000, student_email: 'student2@demo.com', status: 'approved' }
];

const DashTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const loadTuitions = async () => {
            try {
                const res = await api.get('/api/tuitions');
                setTuitions(res.data);
            } catch (err) {
                console.error('Core marketplace load failed');
                toast.error('Marketplace status unavailable');
                // setTuitions(demoTuitions); // Removed demo fallback for cleaner interface
            } finally {
                setLoading(false);
            }
        };
        loadTuitions();
    }, []);

    const filtered = useMemo(() => {
        if (filter === 'all') return tuitions;
        return tuitions.filter(t => t.status === filter);
    }, [tuitions, filter]);

    const handleApprove = async (id) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Operational Integrity: Demo data is read-only');
            return;
        }

        const backup = [...tuitions];
        setTuitions(prev => prev.map(t => t._id === id ? { ...t, status: 'approved' } : t));

        try {
            await api.patch(`/api/tuitions/${id}`, { status: 'approved' });
            toast.success('Requirement verified and active.');
        } catch (err) {
            setTuitions(backup);
            toast.error('Verification failed.');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this requirement from the marketplace?')) return;

        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Operational Integrity: Demo data is read-only');
            return;
        }

        const backup = [...tuitions];
        setTuitions(prev => prev.map(t => t._id === id ? { ...t, status: 'rejected' } : t));

        try {
            await api.patch(`/api/tuitions/${id}`, { status: 'rejected' });
            toast.success('Requirement rejected.');
        } catch (err) {
            setTuitions(backup);
            toast.error('Operation failed.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <header className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Marketplace Operations</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{tuitions.length} Active Requirement Loads</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-sm gap-1 overflow-x-auto">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 ${filter === f
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'approved' ? 'Active' : f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject / Scale</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Yield</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zero operational records found.</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t, i) => (
                                <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900">{t.subject}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{t.class_name}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600 italic">{t.location}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-extrabold text-gray-900">৳{t.salary}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${t.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                            t.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {t.status === 'pending' && (
                                            <div className="flex justify-end gap-4">
                                                <button
                                                    className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-indigo-600 hover:text-indigo-800 transition-colors"
                                                    onClick={() => handleApprove(t._id)}
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-red-500 hover:text-red-700 transition-colors"
                                                    onClick={() => handleReject(t._id)}
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashTuitions;
