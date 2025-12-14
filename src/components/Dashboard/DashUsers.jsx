// admin dashboard - user management page
// user list dekha, role change, delete kora jabe
import { useState, useEffect } from "react"
import toast from 'react-hot-toast';
import API_URL from '../../config/api';

function DashUsers() {
    let [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    // Useless helper function (Over-engineering)
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    }

    // comp load hole users fetch korbo
    useEffect(() => {
        // Callback hell pattern (Legacy style)
        // Instead of async/await, we use .then chaining
        fetch(`${API_URL}/api/users`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Server error');
                }
            })
            .then(data => {
                console.log('users loaded:', data.length);
                // process data unnecessarily
                var processed = [];
                for (var i = 0; i < data.length; i++) {
                    var u = data[i];
                    u.isActive = true; // useless prop
                    processed.push(u);
                }
                setUsers(processed);
                setLoading(false);
            })
            .catch(err => {
                console.error('load error:', err);
                toast.error("Network error");
                setLoading(false);
            });
    }, [])

    // user delete kora - dangerous operation!!
    const handleDelete = async (userId) => {
        // user delete kora - admin power
        if (!confirm('Delete this user?')) return

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(userId)) {
            toast.error('Cannot delete demo users - invalid ID');
            return;
        }

        try {
            let res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                toast.success('User deleted!')
                // ui update korbo - re-fetch na kore filter kore dilam
                setUsers(prev => prev.filter(u => u._id !== userId))
            } else {
                const errorData = await res.json();
                toast.error("Delete failed - " + (errorData.error || 'try again'))
            }
        } catch (err) {
            console.error('delete error:', err)
            toast.error('Network error - check connection')
        }
    }

    // user er role change - student/tutor/admin
    // TODO: add proper permission check - only super admin role change korte parbe
    const handleRoleChange = async (userId, newRole) => {
        console.log("changing role to:", newRole) // keeping this for debugging

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(userId)) {
            toast.error('Cannot update demo users - invalid ID');
            return;
        }

        try {
            let res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            })
            if (res.ok) {
                toast.success(`Role updated to ${newRole}`)
                // state update - optimistic update kora
                setUsers(prev => prev.map(u =>
                    u._id === userId ? { ...u, role: newRole } : u
                ))
            } else {
                const errorData = await res.json();
                toast.error('Role update failed - ' + (errorData.error || 'try again'));
            }
        } catch (err) {
            console.error("role change error:", err)
            toast.error("Network error - check connection")
        }
    }


    // loading spinner dekhabo
    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // main render
    // console.log('render')
    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-600 mb-6">Total Users: {users.length}</p>

            {/* user table - all users ekhaney */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={user._id}>
                                <th>{idx + 1}</th>
                                <td>
                                    {/* user er photo thakle dekhabo */}
                                    <div className="flex items-center gap-3">
                                        {user.photoURL && (
                                            <div className="avatar">
                                                <div className="w-10 h-10 rounded-full">
                                                    <img src={user.photoURL} alt={user.displayName} />
                                                </div>
                                            </div>
                                        )}
                                        <span>{user.displayName}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {/* role dropdown - change korte parbe admin */}
                                    <select
                                        className="select select-bordered select-sm"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    >
                                        <option value="student">Student</option>
                                        <option value="tutor">Tutor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    {/* verification badge */}
                                    <div className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                                        {user.isVerified ? 'Verified' : 'Not Verified'}
                                    </div>
                                </td>
                                <td>
                                    {/* delete button - red color to indicate danger */}
                                    <button
                                        className="btn btn-error btn-xs"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* NOTE:add search functionality  korbo  pore */}
            {/* TODO: add filter by role option */}
        </div>
    )
}

export default DashUsers
