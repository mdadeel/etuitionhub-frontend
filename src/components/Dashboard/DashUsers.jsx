// user management dashboard
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

// TODO: add bulk operations later
var isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

function DashUsers() {
    let [users, setUsers] = useState([]);
    let [loading, setLoading] = useState(true);
    let [filter, setFilter] = useState('all');

    useEffect(() => {
        var loadUsers = async () => {
            console.log('loading users...'); // debug
            try {
                var res = await api.get('/api/users');
                setUsers(res.data);
            } catch (err) {
                console.error('failed:', err.message);
                toast.error(err.response?.data?.error || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    // filter users
    var filtered = useMemo(() => {
        if (filter === 'all') return users;
        return users.filter(u => u.role === filter);
    }, [users, filter]);

    // delete handler
    var handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;

        if (!isValidId(id)) {
            toast.error('Cannot delete demo users');
            return;
        }

        var backup = [...users];
        setUsers(prev => prev.filter(u => u._id !== id));

        try {
            await api.delete(`/api/users/${id}`);
            toast.success('Deleted');
        } catch (err) {
            setUsers(backup); // rollback
            toast.error('Delete failed');
        }
    };

    // role change
    var handleRoleChange = async (id, role) => {
        if (!isValidId(id)) {
            toast.error('Cannot update demo users');
            return;
        }

        var backup = [...users];
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));

        try {
            await api.patch(`/api/users/${id}`, { role });
            toast.success(`Role updated to ${role}`);
        } catch (err) {
            setUsers(backup);
            toast.error('Update failed');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-600 mb-6">Total: {users.length}</p>

            {/* filter buttons */}
            <div className="flex gap-2 mb-4">
                <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All</button>
                <button className={`btn btn-sm ${filter === 'student' ? 'btn-primary' : ''}`} onClick={() => setFilter('student')}>Students</button>
                <button className={`btn btn-sm ${filter === 'tutor' ? 'btn-primary' : ''}`} onClick={() => setFilter('tutor')}>Tutors</button>
                <button className={`btn btn-sm ${filter === 'admin' ? 'btn-primary' : ''}`} onClick={() => setFilter('admin')}>Admins</button>
            </div>

            {/* table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map((user, i) => (
                            <tr key={user._id}>
                                <th>{i + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        {user.photoURL && <div className="avatar"><div className="w-10 h-10 rounded-full"><img src={user.photoURL} alt="" /></div></div>}
                                        <span>{user.displayName}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <select className="select select-bordered select-sm" value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                                        <option value="student">Student</option>
                                        <option value="tutor">Tutor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                                        {user.isVerified ? 'Verified' : 'Not Verified'}
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-error btn-xs" onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashUsers;
