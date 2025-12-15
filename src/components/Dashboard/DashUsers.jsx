/**
 * Admin Dashboard - User Management
 * 
 * Refactored with:
 * - Axios API service instead of raw fetch/.then chains
 * - Optimistic UI updates for role changes and deletes
 * - Cleaner component separation
 */
import { useState, useEffect, useMemo } from "react"
import toast from 'react-hot-toast'
import api from '../../services/api'

// Validate MongoDB ObjectId format
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id)

function DashUsers() {
    const [userList, setUserList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [roleFilter, setRoleFilter] = useState('all')

    // Fetch users on mount
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await api.get('/api/users')
                console.log('Users loaded:', response.data.length)
                setUserList(response.data)
            } catch (err) {
                console.error('Load error:', err)
                toast.error(err.response?.data?.error || 'Failed to load users')
            } finally {
                setIsLoading(false)
            }
        }
        loadUsers()
    }, [])

    // Filtered users based on role filter
    const filteredUsers = useMemo(() => {
        if (roleFilter === 'all') return userList
        return userList.filter(u => u.role === roleFilter)
    }, [userList, roleFilter])

    /**
     * Delete user - with optimistic UI update
     * Removes from list immediately, rolls back if API fails
     */
    const handleDelete = async (userId) => {
        if (!confirm('Delete this user?')) return

        if (!isValidObjectId(userId)) {
            toast.error('Cannot delete demo users - invalid ID')
            return
        }

        const originalList = [...userList]

        // Optimistic removal
        setUserList(prev => prev.filter(u => u._id !== userId))

        try {
            await api.delete(`/api/users/${userId}`)
            toast.success('User deleted!')
        } catch (err) {
            // Rollback on failure
            setUserList(originalList)
            toast.error("Delete failed - " + (err.response?.data?.error || 'try again'))
        }
    }

    /**
     * Change user role - with optimistic UI update
     */
    const handleRoleChange = async (userId, newRole) => {
        console.log("Changing role to:", newRole)

        if (!isValidObjectId(userId)) {
            toast.error('Cannot update demo users - invalid ID')
            return
        }

        const originalList = [...userList]

        // Optimistic update
        setUserList(prev => prev.map(u =>
            u._id === userId ? { ...u, role: newRole } : u
        ))

        try {
            await api.patch(`/api/users/${userId}`, { role: newRole })
            toast.success(`Role updated to ${newRole}`)
        } catch (err) {
            // Rollback on failure
            setUserList(originalList)
            toast.error('Role update failed - ' + (err.response?.data?.error || 'try again'))
        }
    }

    if (isLoading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-600 mb-6">Total Users: {userList.length}</p>

            {/* Role Filter */}
            <div className="flex gap-2 mb-4">
                <FilterButton label="All" isActive={roleFilter === 'all'} onClick={() => setRoleFilter('all')} />
                <FilterButton label="Students" isActive={roleFilter === 'student'} onClick={() => setRoleFilter('student')} />
                <FilterButton label="Tutors" isActive={roleFilter === 'tutor'} onClick={() => setRoleFilter('tutor')} />
                <FilterButton label="Admins" isActive={roleFilter === 'admin'} onClick={() => setRoleFilter('admin')} />
            </div>

            <UserTable
                users={filteredUsers}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
            />
        </div>
    )
}

/**
 * Filter Button Component
 */
function FilterButton({ label, isActive, onClick }) {
    return (
        <button
            className={`btn btn-sm ${isActive ? 'btn-primary' : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

/**
 * User Table Component
 */
function UserTable({ users, onRoleChange, onDelete }) {
    return (
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
                        <UserRow
                            key={user._id}
                            user={user}
                            index={idx + 1}
                            onRoleChange={onRoleChange}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

/**
 * Single User Row Component
 */
function UserRow({ user, index, onRoleChange, onDelete }) {
    return (
        <tr>
            <th>{index}</th>
            <td>
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
                <select
                    className="select select-bordered select-sm"
                    value={user.role}
                    onChange={(e) => onRoleChange(user._id, e.target.value)}
                >
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
                <button
                    className="btn btn-error btn-xs"
                    onClick={() => onDelete(user._id)}
                >
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default DashUsers
