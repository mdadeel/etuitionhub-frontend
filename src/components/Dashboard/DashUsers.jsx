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
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <header className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Identity Management</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{users.length} Registered Nodes</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-sm gap-1 overflow-x-auto">
                    {['all', 'student', 'tutor', 'admin'].map(f => (
                        <button
                            key={f}
                            className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 ${filter === f
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Node</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Classification</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map((user, i) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-sm bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="" className="w-full h-full object-cover grayscale" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-300">
                                                    {user.displayName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user.displayName}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-600 italic">{user.email}</td>
                                <td className="px-6 py-4">
                                    <select
                                        className="bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 focus:outline-none cursor-pointer hover:bg-white transition-colors"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    >
                                        <option value="student">Client</option>
                                        <option value="tutor">Professional</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Expunge
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
