// user management dashboard
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

// TODO: add bulk operations later
var isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await api.get('/api/users');
                setUsers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.error || 'System access failed');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const filtered = useMemo(() => {
        if (filter === 'all') return users;
        return users.filter(u => u.role === filter);
    }, [users, filter]);

    const handleDelete = async (id) => {
        if (!confirm('Permanently remove this identity from the infrastructure?')) return;

        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Identity Integrity: Demo data is read-only');
            return;
        }

        const backup = [...users];
        setUsers(prev => prev.filter(u => u._id !== id));

        try {
            await api.delete(`/api/users/${id}`);
            toast.success('Identity expunged.');
        } catch (err) {
            setUsers(backup);
            toast.error('Operation failed.');
        }
    };

    const handleRoleChange = async (id, role) => {
        const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidId(id)) {
            toast.error('Identity Integrity: Demo data is read-only');
            return;
        }

        const backup = [...users];
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));

        try {
            await api.patch(`/api/users/${id}`, { role });
            toast.success(`Identity reclassified as ${role}.`);
        } catch (err) {
            setUsers(backup);
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
                        Identity Management
                    </h2>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{users.length} System Nodes</p>
                </div>

                <div className="flex bg-gray-50/50 p-1 rounded-xl gap-1 border border-gray-100/50 w-fit">
                    {['all', 'student', 'tutor', 'admin'].map(f => (
                        <button
                            key={f}
                            className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${filter === f
                                ? 'bg-white text-teal-600 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'Universal' : f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/30 border-b border-gray-100">
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Node Profile</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Security</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Permission</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map((user) => (
                            <tr key={user._id} className="hover:bg-teal-50/10 transition-colors">
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100 p-0.5">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[9px] font-black text-teal-600 bg-white rounded-md">
                                                    {user.displayName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-gray-800 leading-tight">{user.displayName}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={`w-1 h-1 rounded-full ${user.isVerified ? 'bg-teal-500' : 'bg-amber-400'}`}></span>
                                                <span className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                                                    {user.isVerified ? 'Verified' : 'Node'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-[10px] font-black text-gray-400 lowercase">{user.email}</td>
                                <td className="px-6 py-3.5">
                                    <div className="relative w-fit">
                                        <select
                                            className="bg-gray-50/50 border border-gray-100 text-[8px] font-black uppercase tracking-widest pl-3 pr-7 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500/20 cursor-pointer hover:bg-white transition-all appearance-none"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            <option value="student">Client</option>
                                            <option value="tutor">Pro</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    <button
                                        className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors px-2 py-1"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Drop
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashUsers;
