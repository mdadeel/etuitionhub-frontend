// tuition details page - showing single tuition post details
// tutors can apply from this page - application form modal ekta ache

import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import toast from "react-hot-toast"
import demoTuitions from '../data/demoTuitions.json';

// main comp
function TuitionDetails() {
    let { id } = useParams()
    let { user, dbUser } = useAuth()
    const navigate = useNavigate()

    const [tuition, setTuition] = useState(null)
    let [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    // application form er data
    const [formData, setFormData] = useState({
        qualifications: "",
        experiance: '', // spelling ta emon e rakhbo - already database e evabe ache
        expectedSalary: ""
    })

    // page load hole tuition details fetch korbo
    useEffect(() => {
        // fetch kori tuition details - api theke naile demo data
        const fetchTuitionDetails = async () => {
            try {
                // api call try kortesi
                let res = await fetch(`http://localhost:5000/api/tuitions/${id}`)
                if (res.ok) {
                    // const data = await res.json()
                    let data = await res.json()
                    setTuition(data)
                    console.log('tuition loaded from api:', data) // debugging - helpful
                } else {
                    // api fail hoile demo data use korbo
                    console.log("api failed, using demo data") // keeping this
                    const demoTuition = demoTuitions.find(t => t._id === id)
                    if (demoTuition) {
                        setTuition(demoTuition)
                    } else {
                        toast.error('Tuition ta paoa jasse na!') // bangla toast!
                    }
                }
                setLoading(false)
            } catch (error) {
                console.error("error aise tuition fetch korte:", error)
                // error hoile demo data dekhai
                const demoTuition = demoTuitions.find(t => t._id === id)
                if (demoTuition) {
                    setTuition(demoTuition)
                } else {
                    toast.error("failed to load - server issue maybe")
                }
                setLoading(false)
            }
        }
        fetchTuitionDetails()
    }, [id])

    // debug logging - checking values
    useEffect(() => {
        console.log('=== TUITION DETAILS DEBUG ===')
        console.log('user:', user ? 'logged in' : 'not logged in')
        console.log('dbUser:', dbUser)
        console.log('dbUser.role:', dbUser?.role)
        console.log('tuition:', tuition)
        console.log('tuition.status:', tuition?.status)
        console.log('Can show apply?', dbUser?.role === 'tutor' && tuition?.status === 'approved')
        console.log('============================')
    }, [user, dbUser, tuition])

    // form input change handle
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // application submit - post request
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check if user is logged in and dbUser is loaded
        if (!user || !dbUser) {
            toast.error('Please login first!')
            navigate('/login')
            return
        }

        // Check if dbUser has _id
        if (!dbUser._id) {
            toast.error('User data not loaded - please refresh page')
            return
        }

        // validation - basic check only
        // TODO: add more validation like phone number, nid etc
        if (!formData.qualifications || !formData.experiance || !formData.expectedSalary) {
            toast.error("sob field fill koren!") // bangla instruction
            return
        }

        // salary validation - bhaiya suggested this
        if (formData.expectedSalary < 1000) {
            toast.error('Salary too low! Minimum 1000 tk')
            return
        }

        // Check if this is a demo tuition (invalid ObjectId)
        // Demo tuitions have IDs like "tuition001" which aren't valid MongoDB IDs
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(id)) {
            toast.error('Cannot apply to demo tuitions! Please select a real tuition post')
            return
        }

        // application data ready kori
        let applicationData = {
            tutorId: dbUser._id,
            tutorEmail: user.email,
            tutorName: user.displayName,
            tuitionId: id,
            studentEmail: tuition.student_email,
            qualifications: formData.qualifications,
            experiance: formData.experiance, // misspelling intentional
            expectedSalary: Number(formData.expectedSalary)
        }

        console.log("submitting application:", applicationData) // debugging aid

        try {
            let res = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(applicationData)
            })

            if (res.ok) {
                toast.success("application submit hoise! wait koren approval er jonno")
                setShowModal(false)
                // reset form
                setFormData({ qualifications: '', experiance: "", expectedSalary: '' })
                // TODO: maybe redirect to applications page?
            } else {
                let errorData = await res.json()
                toast.error('submit hoinai - ' + (errorData.error || errorData.message || "try again"))
            }
        } catch (error) {
            console.error('submission error:', error)
            toast.error("something went wrong - check internet connection")
        }
    }

    // loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    // tuition na paile
    if (!tuition) {
        return <div className="text-center mt-10">tuition post ta paoa jaini - maybe deleted</div>
    }

    // main render
    console.log('rendering details...')
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* main tuition details card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-3xl mb-4">{tuition.subject}</h2>

                        {/* grid layout for details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600"><strong>Class:</strong> {tuition.class_name}</p>
                                <p className="text-gray-600"><strong>Location:</strong> {tuition.location}</p>
                                <p className="text-gray-600"><strong>Salary:</strong> ৳{tuition.salary}/month</p>
                                <p className="text-gray-600"><strong>Gender Preference:</strong> {tuition.gender || 'Any'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600"><strong>Days per Week:</strong> {tuition.days_per_week}</p>
                                <p className="text-gray-600"><strong>Available Days:</strong> {tuition.available_days?.join(", ") || "not specified"}</p>
                                <p className="text-gray-600"><strong>Status:</strong>
                                    <span className={`badge ml-2 ${tuition.status === 'approved' ? 'badge-success' :
                                        tuition.status === "pending" ? 'badge-warning' :
                                            'badge-info'
                                        }`}>
                                        {tuition.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* description jodi thake */}
                        {tuition.description && (
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Description:</h3>
                                <p className="text-gray-700">{tuition.description}</p>
                            </div>
                        )}

                        {/* apply button - only tutors can see, only if approved */}
                        {!dbUser ? (
                            // loading state while dbUser is being fetched
                            <div className="text-center py-4">
                                <span className="loading loading-spinner loading-sm"></span>
                                <p className="text-sm text-gray-500 mt-2">Loading user info...</p>
                            </div>
                        ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                            <div className="card-actions justify-end mt-6">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowModal(true)}
                                >
                                    Apply for this Tuition
                                </button>
                            </div>
                        ) : dbUser?.role !== 'tutor' ? (
                            <div className="alert alert-info mt-4">
                                <span>Only tutors can apply. Please login with a tutor account to apply for this tuition.</span>
                            </div>
                        ) : tuition.status !== 'approved' ? (
                            <div className="alert alert-warning mt-4">
                                <span>This tuition is pending admin approval and not accepting applications yet.</span>
                            </div>
                        ) : null}

                        {/* pending alert - backup message */}
                        {tuition.status === 'pending' && (
                            <div className="alert alert-warning mt-4">
                                <span>ei tuition post ta admin approve korenai ekhono</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* application modal - form submit korar jonno */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Apply for Tuition</h3>

                        <form onSubmit={handleSubmit}>
                            {/* readonly fields - change kora jabena */}
                            <div className="form-control mb-3">
                                <label className="label"><span className="label-text">Name</span></label>
                                <input
                                    type="text"
                                    value={user?.displayName || ''}
                                    className="input input-bordered"
                                    readOnly
                                />
                            </div>

                            <div className="form-control mb-3">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    className="input input-bordered"
                                    readOnly
                                />
                            </div>

                            {/* editable fields - user fill korbe */}
                            <div className="form-control mb-3">
                                <label className="label"><span className="label-text">Qualifications* (educational background)</span></label>
                                <textarea
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered"
                                    placeholder="E.g., BSc in Mathematics from DU, 3.5 cgpa"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control mb-3">
                                <label className="label"><span className="label-text">Experience* (teaching experiance)</span></label>
                                <textarea
                                    name="experiance"
                                    value={formData.experiance}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered"
                                    placeholder="e.g., 2 years teaching class 8-10 students"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Expected Salary (bdt/month)*</span></label>
                                <input
                                    type="number"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="enter amount in taka"
                                    min="1000"
                                    required
                                />
                            </div>

                            {/* modal actions */}
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TuitionDetails
