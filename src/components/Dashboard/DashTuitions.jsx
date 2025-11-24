// admin dashboard - tuition management comp 
// tuition posts approve/reject kora jay ekhaney
import { useState, useEffect } from "react"
import toast from 'react-hot-toast'

function DashTuitions() {
    let [tuitions, setTuitions] = useState([])
    const [loading, setLoading] = useState(true)

    // load hole tuitions fetch
    useEffect(() => {
        // api call - all tuitions anbo
        const fetchTuitions = async () => {
            try {
                // getting tuitions from backend
                let res = await fetch('http://localhost:5000/api/tuitions')
                if (res.ok) {
                    // const data=await res.json()
                    let data = await res.json()
                    setTuitions(data)
                    console.log("tuitions loaded:", data.length) // keep this for monitoring
                } else {
                    toast.error('Could not load tuitions')
                }
                setLoading(false)
            } catch (err) {
                console.error("fetch error:", err)
                toast.error("Error hoise load korte")
                setLoading(false)
            }
        }
        fetchTuitions()
    }, [])

    // approve tuition - admin er kaj
    const handleApprove = async (tuitionId) => {
        // approve korle tutors dekh te parbe
        console.log('approving tuition:', tuitionId)

        try {
            let res = await fetch(`http://localhost:5000/api/tuitions/${tuitionId}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: 'approved' })
            })
            if (res.ok) {
                toast.success("Tuition approved! Tutors can see now")
                // update ui instantly - better ux
                setTuitions(prev => prev.map(t =>
                    t._id === tuitionId ? { ...t, status: 'approved' } : t
                ))
            } else {
                toast.error('Approval failed - try again');
            }
        } catch (err) {
            console.error('error approving:', err)
            toast.error("Failed to approve")
        }
    }

    // reject tuition post
    // TODO: maybe send notification to student why rejected
    const handleReject = async (tuitionId) => {
        if (!confirm("Reject korben ei tuition ta?")) return


        try {
            let res = await fetch(`http://localhost:5000/api/tuitions/${tuitionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: "rejected" })
            })
            if (res.ok) {
                toast.success('Tuition rejected')
                setTuitions(prev => prev.map(t =>
                    t._id === tuitionId ? { ...t, status: 'rejected' } : t
                ))
            } else {
                toast.error("Rejection failed")
            }
        } catch (err) {
            console.error('reject error:', err)
            toast.error('error rejecting')
        }
    }

    // loading state
    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // main render
    console.log('chk')
    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Tuition Management</h2>
            <p className="text-gray-600 mb-6">Total Posts: {tuitions.length}</p>

            {/* tuition table - all posts show kore */}
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
                            <tr key={tuition._id}>
                                <th>{idx + 1}</th>
                                <td>{tuition.subject}</td>
                                <td>{tuition.class_name}</td>
                                <td>{tuition.location}</td>
                                <td>৳{tuition.salary}</td>
                                <td className="text-sm">{tuition.student_email}</td>
                                <td>
                                    {/* status badge - color coded */}
                                    <div className={`badge ${tuition.status === 'approved' ? 'badge-success' :
                                            tuition.status === 'rejected' ? 'badge-error' :
                                                'badge-warning'
                                        }`}>
                                        {tuition.status}
                                    </div>
                                </td>
                                <td>
                                    {/* action buttons - only pending posts er jonno */}
                                    {tuition.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-success btn-xs"
                                                onClick={() => handleApprove(tuition._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleReject(tuition._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* NOTE: add filter by status option - bhaiya suggested */}
            {/* TODO: add bulk approval feature for multiple tuitions */}
        </div>
    )
}

export default DashTuitions
