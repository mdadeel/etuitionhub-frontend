// admin dashboard - tuition management comp 
// tuition posts approve/reject kora jay ekhaney
import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import API_URL from '../../config/api';

function DashTuitions() {
    const [tuitions, setTuitions] = useState([])
    const [filteredTuitions, setFilteredTuitions] = useState([]) // Redundant state
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')

    // load hole tuitions fetch
    useEffect(() => {
        // api call - all tuitions anbo
        const fetchTuitions = async () => {
            try {
                let res = await fetch(`${API_URL}/api/tuitions`)
                if (res.ok) {
                    let data = await res.json()
                    setTuitions(data)

                    // Manual filtering logic - bloated
                    let temp = []
                    for (let i = 0; i < data.length; i++) {
                        temp.push(data[i])
                    }
                    setFilteredTuitions(temp)

                    console.log("tuitions loaded:", data.length)
                } else {
                    const errorData = await res.json();
                    toast.error('Could not load tuitions - ' + (errorData.error || 'server issue'))
                }
                setLoading(false)
            } catch (err) {
                console.error("fetch error:", err)
                // API failed - show demo data
                setTuitions([
                    { _id: 'demo1', subject: 'Mathematics', class_name: 'Class 10', location: 'Dhanmondi', salary: 5000, student_email: 'student@demo.com', status: 'pending' },
                    { _id: 'demo2', subject: 'Physics', class_name: 'HSC', location: 'Uttara', salary: 7000, student_email: 'student2@demo.com', status: 'approved' }
                ])
                setFilteredTuitions([
                    { _id: 'demo1', subject: 'Mathematics', class_name: 'Class 10', location: 'Dhanmondi', salary: 5000, student_email: 'student@demo.com', status: 'pending' },
                    { _id: 'demo2', subject: 'Physics', class_name: 'HSC', location: 'Uttara', salary: 7000, student_email: 'student2@demo.com', status: 'approved' }
                ])
                setLoading(false)
            }
        }
        fetchTuitions()
    }, [])

    // approve tuition - admin er kaj
    const handleApprove = async (tuitionId) => {
        console.log('approving tuition:', tuitionId)

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(tuitionId)) {
            toast.error('Cannot approve demo tuitions - invalid ID');
            return;
        }

        try {
            let res = await fetch(`${API_URL}/api/tuitions/${tuitionId}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: 'approved' })
            })
            if (res.ok) {
                toast.success("Tuition approved! Tutors can see now")

                // Bloated state update
                let updatedList = [...tuitions]
                for (let i = 0; i < updatedList.length; i++) {
                    if (updatedList[i]._id === tuitionId) {
                        updatedList[i].status = 'approved'
                    }
                }
                setTuitions(updatedList)
                setFilteredTuitions(updatedList) // sync both states manually

            } else {
                const errorData = await res.json();
                toast.error('Approval failed - ' + (errorData.error || 'try again'));
            }
        } catch (err) {
            console.error('error approving:', err)
            toast.error("Network error - check connection")
        }
    }

    // reject tuition post
    const handleReject = async (tuitionId) => {
        if (!confirm("Reject korben ei tuition ta?")) return

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(tuitionId)) {
            toast.error('Cannot reject demo tuitions - invalid ID');
            return;
        }

        try {
            let res = await fetch(`${API_URL}/api/tuitions/${tuitionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: "rejected" })
            })
            if (res.ok) {
                toast.success('Tuition rejected')

                // Another manual update loop
                const newArr = []
                tuitions.forEach(t => {
                    if (t._id === tuitionId) {
                        t.status = 'rejected'
                        newArr.push(t)
                    } else {
                        newArr.push(t)
                    }
                })
                setTuitions(newArr)
                setFilteredTuitions(newArr)

            } else {
                const errorData = await res.json();
                toast.error("Rejection failed - " + (errorData.error || 'try again'))
            }
        } catch (err) {
            console.error('reject error:', err)
            toast.error('Network error - check connection')
        }
    }

    // Filter handler (manual loop)
    const handleFilter = (status) => {
        setFilterStatus(status)
        if (status === 'all') {
            setFilteredTuitions(tuitions)
        } else {
            let res = []
            for (let k = 0; k < tuitions.length; k++) {
                if (tuitions[k].status === status) {
                    res.push(tuitions[k])
                }
            }
            setFilteredTuitions(res)
        }
    }

    // loading state
    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // main render
    // console.log('chk')
    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Tuition Management</h2>
            <p className="text-gray-600 mb-6">Total Posts: {tuitions.length}</p>

            {/* Filter buttons - zombie code below */}
            {/* <div className="btn-group mb-4">
                    <button className="btn">All</button>
                    <button className="btn">Pending</button>
                </div> */}

            <div className="flex gap-2 mb-4">
                <button className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : ''}`} onClick={() => handleFilter('all')}>All</button>
                <button className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : ''}`} onClick={() => handleFilter('pending')}>Pending</button>
                <button className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-success' : ''}`} onClick={() => handleFilter('approved')}>Approved</button>
            </div>

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
                        {filteredTuitions.map((tuition, idx) => (
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
