// admin dashboard - user management page
// user list dekha, role change, delete kora jabe
import { useState, useEffect } from "react"
import toast from 'react-hot-toast';

function DashUsers() {
    let [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    // comp load hole users fetch korbo
    useEffect(() => {
        // api theke users load kori
        const fetchUsers = async () => {
            try {
                let res = await fetch("http://localhost:5000/api/users")
                if (res.ok) {
                    let data = await res.json()
                    if (data.length > 0) {
                        setUsers(data)
                        console.log('total users:', data.length)
                    } else {
                        // No users - show demo data
                        console.log('📋 Using demo users')
                        setUsers([
                            { _id: 'demo1', displayName: 'Demo Student', email: 'student@demo.com', role: 'student', isVerified: true },
                            { _id: 'demo2', displayName: 'Demo Tutor', email: 'tutor@demo.com', role: 'tutor', isVerified: false },
                            { _id: 'demo3', displayName: 'Admin User', email: 'admin@etuition.com', role: 'admin', isVerified: true }
                        ])
                    }
                } else {
                    toast.error("Failed to load users - server issue")
                }
                setLoading(false)
            } catch (err) {
                console.error('fetch users error:', err)
                // API failed - show demo data
                setUsers([
                    { _id: 'demo1', displayName: 'Demo Student', email: 'student@demo.com', role: 'student', isVerified: true },
                    { _id: 'demo2', displayName: 'Demo Tutor', email: 'tutor@demo.com', role: 'tutor', isVerified: false }
                ])
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    // user delete kora - dangerous operation!!
    const handleDelete = async (userId) => {
        // confirm newa ta important - accidental delete theke bachbe
        if (!confirm("Ei user ke delete korben? Undo kora jabena!")) return

        try {
            let res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                toast.success('User deleted successfully')
                // ui update korbo - re-fetch na kore filter kore dilam
                setUsers(prev => prev.filter(u => u._id !== userId))
            } else {
                toast.error("Delete hoinai - maybe permission issue")
            }
        } catch (err) {
            console.error('error deleting:', err)
            toast.error('Error aise deletion e')
        }
    }

    // user er role change - student/tutor/admin
    // TODO: add proper permission check - only super admin role change korte parbe
    const handleRoleChange = async (userId, newRole) => {
        console.log("changing role to:", newRole) // keeping this for debugging

        try {
            let res = await fetch(`http://localhost:5000/api/users/${userId}`, {
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
                toast.error('Role update failed');
            }
        } catch (err) {
            console.error("role change error:", err)
            toast.error("failed to update role - try again")
        }
    }


    // loading spinner dekhabo
    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // main render
    console.log('render')
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

            {/* NOTE: bhaiya suggested add search functionality - korbo  pore */}
            {/* TODO: add filter by role option */}
        </div>
    )
}

export default DashUsers
