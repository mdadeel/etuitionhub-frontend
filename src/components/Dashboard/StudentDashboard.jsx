// Student Dashboard - student er main overview with tabs
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import demoTuitions from '../../data/demoTuitions.json'; // demo data fallback

const StudentDashboard = () => {
    let { user, dbUser } = useAuth();
    let [activeTab, setActiveTab] = useState('overview');
    let [bookings, setBookings] = useState([]);
    let [myTuitions, setMyTuitions] = useState([]);
    let [applications, setApplications] = useState([]); // tutor applications amar posts er jonno
    let { register, handleSubmit, reset } = useForm();
    let [loading, setLoading] = useState(false);

    // student er posted tuitions and bookings fetch korbo
    useEffect(() => {
        if (!user?.email) return;

        const fetchData = async () => {
            try {
                // Fetch posted tuitions
                const resTuitions = await fetch(`http://localhost:5000/api/tuitions/student/${user.email}`);
                if (resTuitions.ok) {
                    const data = await resTuitions.json();
                    if (data.length > 0) {
                        setMyTuitions(data);
                    } else {
                        // no tuitions from API - show demo
                        console.log('📋 No tuitions found - using demo data');
                        setMyTuitions(demoTuitions.slice(0, 3));
                    }
                } else {
                    // API failed - use demo data
                    console.log('❌ API failed - using demo tuitions');
                    setMyTuitions(demoTuitions.slice(0, 3));
                }

                // Fetch bookings (Tutors I've booked)
                const resBookings = await fetch(`http://localhost:5000/api/bookings/student/${user.email}`);
                if (resBookings.ok) {
                    const data = await resBookings.json();
                    setBookings(data);
                } else {
                    // demo bookings nai - empty rakhbo for now
                    console.log('no bookings data')
                }

                // fetch applications for my tuitions
                // API theke try korbo first
                const resTuition = await fetch(`http://localhost:5000/api/tuitions/student/${user.email}`);
                if (resTuition.ok) {
                    const tuitionData = await resTuition.json();
                    // get all application for all my tuitions
                    const allApps = [];
                    for (const tuit of tuitionData) {
                        const appRes = await fetch(`http://localhost:5000/api/applications/tuition/${tuit._id}`);
                        if (appRes.ok) {
                            const apps = await appRes.json();
                            allApps.push(...apps);
                        }
                    }
                    console.log('📋 Total applications fetched:', allApps.length, allApps);
                    setApplications(allApps);
                } else {
                    // demo applications create kori - testing jonno
                    console.log('using demo applications')
                    const demoApps = [
                        {
                            _id: 'app001',
                            tutorName: 'Md. Rahman',
                            tutorEmail: 'rahman@test.com',
                            qualifications: 'BSc in Mathematics from DU',
                            experiance: '3 years teaching SSC/HSC students',
                            expectedSalary: 8000,
                            status: 'pending'
                        },
                        {
                            _id: 'app002',
                            tutorName: 'Fatima Akter',
                            tutorEmail: 'fatima@test.com',
                            qualifications: 'MSc in Physics from BUET',
                            experiance: '5 years experiance',
                            expectedSalary: 10000,
                            status: 'pending'
                        }
                    ];
                    setApplications(demoApps);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                // total API fail - use demo data
                const studentTuitions = demoTuitions.slice(0, 3);
                setMyTuitions(studentTuitions);
            }
        };

        fetchData();
        // Commented out to prevent infinite loop if API is weird
        // const interval = setInterval(fetchData, 10000);
        // return () => clearInterval(interval);
    }, [user?.email]);

    // Handle posting new tuition job
    const onPostTuition = async (data) => {
        setLoading(true);
        // console.log("posting job:", data);
        const tuitionData = {
            ...data,
            student_name: user?.displayName,
            student_email: user?.email,
            status: 'pending',
            createdAt: new Date()
        };

        try {
            const res = await fetch('http://localhost:5000/api/tuitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tuitionData)
            });

            if (res.ok) {
                toast.success('Tuition job posted successfully!');
                reset();
                setActiveTab('my-jobs');
                // refetch logic here
            } else {
                const errorData = await res.json();
                toast.error('Failed to post job - ' + (errorData.error || 'try again'));
            }
        } catch (error) {
            console.error(error);
            toast.error('Server error - check connection');
        } finally {
            setLoading(false);
        }
    };

    // application approve - checkout redirect for payment
    const handleApprove = (appId) => {
        // checkout page e jabo payment er jonno
        console.log('approving app:', appId) // chk
        window.location.href = `/checkout/${appId}`
    };

    // reject application  
    const handleReject = async (appId) => {
        if (!confirm('Are you sure you want to reject this application?')) return;

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(appId)) {
            toast.error('Cannot reject demo data - invalid ID');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/applications/${appId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            });
            if (res.ok) {
                toast.success('Application rejected');
                setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: 'rejected' } : a));
            } else {
                const errorData = await res.json();
                toast.error('Rejection failed - ' + (errorData.error || 'try again'));
            }
        } catch (err) {
            toast.error('Network error - check connection');
        }
    };

    // delete my tuition post
    const handleDeleteTuition = async (tuitionId) => {
        if (!confirm('Delete this tuition post?')) return;

        // Validate ObjectId
        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
        if (!isValidObjectId(tuitionId)) {
            toast.error('Cannot delete demo data - invalid ID');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/tuitions/${tuitionId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Tuition deleted');
                setMyTuitions(prev => prev.filter(t => t._id !== tuitionId));
            } else {
                const errorData = await res.json();
                toast.error('Delete failed - ' + (errorData.error || 'try again'));
            }
        } catch (err) {
            console.error('error:', err);
            toast.error('Network error - check connection');
        }
    };

    //  Move this to a utility file, it's cluttering the component
    const calculateStats = () => {
        let hired = bookings.filter(b => b.isAccepted).length;
        let posted = myTuitions.length;
        return { hired, posted };
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <div className="tabs tabs-boxed flex-wrap">
                    <a className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</a>
                    <a className={`tab ${activeTab === 'post-job' ? 'tab-active' : ''}`} onClick={() => setActiveTab('post-job')}>Post Tuition</a>
                    <a className={`tab ${activeTab === 'my-jobs' ? 'tab-active' : ''}`} onClick={() => setActiveTab('my-jobs')}>My Tuitions</a>
                    <a className={`tab ${activeTab === 'applications' ? 'tab-active' : ''}`} onClick={() => setActiveTab('applications')}>Applied Tutors</a>
                    <a className={`tab ${activeTab === 'booked' ? 'tab-active' : ''}`} onClick={() => setActiveTab('booked')}>Booked</a>
                    <a className={`tab ${activeTab === 'payments' ? 'tab-active' : ''}`} onClick={() => setActiveTab('payments')}>Payments</a>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">My Posted Jobs</div>
                        <div className="stat-value text-primary">{myTuitions.length}</div>
                        <div className="stat-desc">Jobs you posted</div>
                    </div>
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Applications</div>
                        <div className="stat-value text-secondary">0</div>
                        <div className="stat-desc">Tutors applied</div>
                    </div>
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Hired Tutors</div>
                        <div className="stat-value">{bookings.filter(b => b.isAccepted).length}</div>
                        <div className="stat-desc">Confirmed bookings</div>
                    </div>
                </div>
            )}

            {activeTab === 'post-job' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Post a Tuition Requirement</h2>
                    <form onSubmit={handleSubmit(onPostTuition)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">Subject *</label>
                            <input {...register('subject', { required: true })} placeholder="Mathematics, Physics, English" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">Class *</label>
                            <select {...register('class_name', { required: true })} className="select select-bordered">
                                <option>Class 6</option>
                                <option>Class 7</option>
                                <option>Class 8</option>
                                <option>Class 9</option>
                                <option>Class 10</option>
                                <option>HSC</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">Salary (Monthly) *</label>
                            <input {...register('salary', { required: true, min: 1000 })} placeholder="5000" type="number" min="1000" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">Medium</label>
                            <select {...register('medium')} className="select select-bordered">
                                <option>Bangla Medium</option>
                                <option>English Medium</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">Days per week</label>
                            <select {...register('days_per_week')} className="select select-bordered">
                                <option>3 days</option>
                                <option>4 days</option>
                                <option>5 days</option>
                            </select>
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label">Location Details *</label>
                            <textarea {...register('location', { required: true })} className="textarea textarea-bordered h-24" placeholder="Full address details..."></textarea>
                        </div>
                        <div className="md:col-span-2 mt-4">
                            <button className="btn btn-primary w-full" disabled={loading}>
                                {loading ? 'Posting...' : 'Post Requirement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'my-jobs' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">My Posted Jobs</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Subject</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTuitions.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center">No jobs posted yet</td></tr>
                                ) : (
                                    myTuitions.map((job, idx) => (
                                        <tr key={job._id}>
                                            <th>{idx + 1}</th>
                                            <td>{job.title}</td>
                                            <td>{job.subject}</td>
                                            <td>{job.salary}</td>
                                            <td><div className="badge badge-info">{job.status}</div></td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-info btn-xs"
                                                        onClick={() => window.location.href = `/tuition/${job._id}`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleDeleteTuition(job._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Tutor Applications</h2>
                    {applications.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No applications yet</p>
                    ) : (
                        <div className="grid gap-4">
                            {applications.map(app => (
                                <div key={app._id} className="card bg-base-200 shadow">
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">{app.tutorName}</h3>
                                                <p className="text-sm text-gray-600">{app.tutorEmail}</p>
                                            </div>
                                            <div className={`badge ${app.status === 'approved' ? 'badge-success' :
                                                app.status === 'rejected' ? 'badge-error' :
                                                    'badge-warning'
                                                }`}>
                                                {app.status}
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p><strong>Qualifications:</strong> {app.qualifications}</p>
                                            <p><strong>Experience:</strong> {app.experiance}</p>
                                            <p><strong>Expected Salary:</strong> ৳{app.expectedSalary}/month</p>
                                        </div>

                                        {app.status === 'pending' && (
                                            <div className="card-actions justify-end mt-4">
                                                <button
                                                    className="btn btn-error btn-sm"
                                                    onClick={() => handleReject(app._id)}
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleApprove(app._id)}
                                                >
                                                    Accept & Pay
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'booked' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Booked Tutors</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tutor Name</th>
                                    <th>Subject</th>
                                    <th>Mobile</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center">No tutors booked yet</td></tr>
                                ) : (
                                    bookings.map((booking, idx) => (
                                        <tr key={booking._id}>
                                            <th>{idx + 1}</th>
                                            <td>{booking.tutor_name}</td>
                                            <td>{booking.subject}</td>
                                            <td>{booking.mobile}</td>
                                            <td>
                                                <div className={`badge ${booking.isAccepted ? 'badge-success' : 'badge-warning'}`}>
                                                    {booking.isAccepted ? 'Accepted' : 'Pending'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Payment History</h2>
                    <p className="text-gray-600 mb-4">View all your payment transactions for tutor bookings.</p>

                    <div className="stats shadow w-full mb-6">
                        <div className="stat">
                            <div className="stat-title">Total Paid</div>
                            <div className="stat-value text-primary">৳0</div>
                            <div className="stat-desc">All time payments</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Pending</div>
                            <div className="stat-value text-warning">৳0</div>
                            <div className="stat-desc">Awaiting payment</div>
                        </div>
                    </div>

                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No payment records found</p>
                        <a href="/payment-history" className="btn btn-primary">
                            View Full Payment History
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
