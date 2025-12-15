/**
 * Admin Dashboard - Tuition Management
 * 
 * Refactored with:
 * - Axios API service instead of raw fetch
 * - Optimistic UI updates for approve/reject actions
 * - Centralized validation from utils
 * - Cleaner component structure
 */
import { useState, useEffect, useMemo } from "react"
import toast from 'react-hot-toast'
import api from '../../services/api'

/**
 * Check if string is valid MongoDB ObjectId
 * Regex check here for quick validation before API call
 */
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id)

function DashTuitions() {
    const [tuitionList, setTuitionList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('all')

    // Fetch tuitions on mount
    useEffect(() => {
        const loadTuitions = async () => {
            try {
                const response = await api.get('/api/tuitions')
                setTuitionList(response.data)
                console.log("Tuitions loaded:", response.data.length)
            } catch (err) {
                console.error("Fetch error:", err)
                const errorMessage = err.response?.data?.error || 'server issue'
                toast.error('Could not load tuitions - ' + errorMessage)

                // Demo data fallback for development
                setTuitionList([
                    { _id: 'demo1', subject: 'Mathematics', class_name: 'Class 10', location: 'Dhanmondi', salary: 5000, student_email: 'student@demo.com', status: 'pending' },
                    { _id: 'demo2', subject: 'Physics', class_name: 'HSC', location: 'Uttara', salary: 7000, student_email: 'student2@demo.com', status: 'approved' }
                ])
            } finally {
                setIsLoading(false)
            }
        }
        loadTuitions()
    }, [])

    // Filtered tuitions - using useMemo for performance
    const filteredTuitions = useMemo(() => {
        if (activeFilter === 'all') return tuitionList
        return tuitionList.filter(t => t.status === activeFilter)
    }, [tuitionList, activeFilter])

    /**
     * Approve tuition - with optimistic UI update
     * Updates UI immediately, then syncs with server
     * Rolls back if API call fails
     */
    const handleApprove = async (tuitionId) => {
        console.log('Approving tuition:', tuitionId)

        // Validate ObjectId before making API call
        if (!isValidObjectId(tuitionId)) {
            toast.error('Cannot approve demo tuitions - invalid ID')
            return
        }

        // Store original state for rollback
        const originalList = [...tuitionList]

        // OPTIMISTIC UPDATE: Update UI immediately
        setTuitionList(prev =>
            prev.map(t => t._id === tuitionId ? { ...t, status: 'approved' } : t)
        )

        try {
            await api.patch(`/api/tuitions/${tuitionId}`, { status: 'approved' })
            toast.success("Tuition approved! Tutors can see it now")
        } catch (err) {
            // ROLLBACK: Revert to original state if API fails
            setTuitionList(originalList)
            const errorMessage = err.response?.data?.error || 'try again'
            toast.error('Approval failed - ' + errorMessage)
        }
    }

    /**
     * Reject tuition - with optimistic UI update
     */
    const handleReject = async (tuitionId) => {
        if (!confirm("Reject this tuition post?")) return

        if (!isValidObjectId(tuitionId)) {
            toast.error('Cannot reject demo tuitions - invalid ID')
            return
        }

        const originalList = [...tuitionList]

        // Optimistic update
        setTuitionList(prev =>
            prev.map(t => t._id === tuitionId ? { ...t, status: 'rejected' } : t)
        )

        try {
            await api.patch(`/api/tuitions/${tuitionId}`, { status: 'rejected' })
            toast.success('Tuition rejected')
        } catch (err) {
            // Rollback on failure
            setTuitionList(originalList)
            const errorMessage = err.response?.data?.error || 'try again'
            toast.error("Rejection failed - " + errorMessage)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Tuition Management</h2>
            <p className="text-gray-600 mb-6">Total Posts: {tuitionList.length}</p>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
                <FilterButton
                    label="All"
                    isActive={activeFilter === 'all'}
                    onClick={() => setActiveFilter('all')}
                />
                <FilterButton
                    label="Pending"
                    isActive={activeFilter === 'pending'}
                    onClick={() => setActiveFilter('pending')}
                    color="warning"
                />
                <FilterButton
                    label="Approved"
                    isActive={activeFilter === 'approved'}
                    onClick={() => setActiveFilter('approved')}
                    color="success"
                />
            </div>

            {/* Tuitions Table */}
            <TuitionTable
                tuitions={filteredTuitions}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    )
}

/**
 * Filter Button Component
 */
function FilterButton({ label, isActive, onClick, color = 'primary' }) {
    const activeClass = isActive ? `btn-${color}` : ''
    return (
        <button
            className={`btn btn-sm ${activeClass}`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

/**
 * Tuition Table Component
 * Separated for cleaner code structure
 */
function TuitionTable({ tuitions, onApprove, onReject }) {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Subject</th>
                        <th>Class</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tuitions.map((tuition, idx) => (
                        <TuitionRow
                            key={tuition._id}
                            tuition={tuition}
                            index={idx + 1}
                            onApprove={onApprove}
                            onReject={onReject}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

/**
 * Single Tuition Row Component
 */
function TuitionRow({ tuition, index, onApprove, onReject }) {
    const statusBadgeClass = {
        'approved': 'badge-success',
        'rejected': 'badge-error',
        'pending': 'badge-warning'
    }[tuition.status] || 'badge-warning'

    return (
        <tr>
            <th>{index}</th>
            <td>{tuition.subject}</td>
            <td>{tuition.class_name}</td>
            <td>{tuition.location}</td>
            <td>৳{tuition.salary}</td>
            <td className="text-sm">{tuition.student_email}</td>
            <td>
                <div className={`badge ${statusBadgeClass}`}>
                    {tuition.status}
                </div>
            </td>
            <td>
                {tuition.status === 'pending' && (
                    <div className="flex gap-2">
                        <button
                            className="btn btn-success btn-xs"
                            onClick={() => onApprove(tuition._id)}
                        >
                            Approve
                        </button>
                        <button
                            className="btn btn-error btn-xs"
                            onClick={() => onReject(tuition._id)}
                        >
                            Reject
                        </button>
                    </div>
                )}
            </td>
        </tr>
    )
}

export default DashTuitions
