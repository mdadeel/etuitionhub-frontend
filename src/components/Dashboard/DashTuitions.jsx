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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden border-none p-0">
            <header className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                        Marketplace Operations
                    </h2>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{tuitions.length} Requirements</p>
                </div>

                <div className="flex bg-gray-50/50 p-1 rounded-xl gap-1 border border-gray-100/50 w-fit">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${filter === f
                                ? 'bg-white text-teal-600 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'approved' ? 'Active' : f === 'all' ? 'Universal' : 'Verify'}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/30 border-b border-gray-100">
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Academic Scope</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Geography</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Yield</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">State</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">Universal records empty</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t) => (
                                <tr key={t._id} className="hover:bg-teal-50/10 transition-colors">
                                    <td className="px-6 py-3.5">
                                        <p className="text-[11px] font-black text-gray-800 leading-tight">{t.subject}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-0.5">{t.class_name}</p>
                                    </td>
                                    <td className="px-6 py-3.5 text-[10px] font-black text-gray-400 lowercase italic">{t.location}</td>
                                    <td className="px-6 py-3.5 text-center">
                                        <span className="text-xs font-black text-teal-600">৳{t.salary}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded shadow-sm border ${t.status === 'approved' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                            t.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        {t.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
                                                    onClick={() => handleApprove(t._id)}
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
                                                    onClick={() => handleReject(t._id)}
                                                >
                                                    Drop
                                                </button>
                                            </div>
                                        )}
                                        {t.status !== 'pending' && (
                                            <span className="text-[9px] font-black text-gray-200 uppercase tracking-widest">Done</span>
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
