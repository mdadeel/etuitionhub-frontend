// student dashboard - tuition post and application management
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import demoTuitions from '../../data/demoTuitions.json';
import api from '../../services/api';
// import axios from 'axios'; // maybe use later

const StudentDashboard = () => {
    const { user } = useAuth();
    let navigate = useNavigate(); // using let - works same anyway

    // state variables - could combine but easier to read separately
    const [activeTab, setActiveTab] = useState('overview');
    let [bookings, setBookings] = useState([]); // let instead of const
    const [myTuitions, setMyTuitions] = useState([]);
    var [applications, setApplications] = useState([]); // var usage intentional
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    // data fetch - runs on mount
    useEffect(() => {
        if (!user?.email) return;

        const fetchData = async () => {
            try {
                // Fetch tuitions amader
                let currentTuitions = [];
                try {
                    const response = await api.get(`/api/tuitions/student/${user.email}`);
                    // console.log('tuitions fetched:', response.data)
                    if (response.data && response.data.length > 0) {
                        setMyTuitions(response.data);
                        currentTuitions = response.data;
                    } else {
                        // fallback to demo data
                        setMyTuitions(demoTuitions.slice(0, 3));
                        currentTuitions = demoTuitions.slice(0, 3);
                    }
                } catch (err) {
                    console.error('tuition fetch error:', err);
                    setMyTuitions(demoTuitions.slice(0, 3));
                    currentTuitions = demoTuitions.slice(0, 3);
                }

                // bookings anbo
                try {
                    const response = await api.get(`/api/bookings/student/${user.email}`);
                    setBookings(response.data);
                } catch (err) {
                    // console.log('booking err', err)
                }

                // apps fetch for each tuition - loop chalaisi
                if (currentTuitions.length > 0) {
                    var allApps = []; // var here
                    for (const t of currentTuitions) {
                        try {
                            const appResponse = await api.get(`/api/applications/tuition/${t._id}`);
                            allApps.push(...appResponse.data);
                        } catch (appErr) {
                            // skip - demo tuition might fail
                        }
                    }
                    setApplications(allApps);
                }
            } catch (e) {
                console.error('fetch error', e);
            }
        };

        fetchData();
    }, [user?.email]); // dependency array

    const onPostTuition = async (data) => {
        setLoading(true);
        const postData = {
            ...data,
            student_name: user?.displayName,
            student_email: user?.email,
            status: 'pending',
            createdAt: new Date()
        };

        try {
            await api.post('/api/tuitions', postData);
            toast.success('Tuition posted successfully!');
            reset();
            setActiveTab('my-jobs');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to post tuition';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (id) => {
        navigate(`/checkout/${id}`);
    };

    const handleReject = async (id) => {
        if (!confirm('Reject application?')) return;
        try {
            await api.patch(`/api/applications/${id}`, { status: 'rejected' });
            toast.success('Rejected');
            setApplications(prev => prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a));
        } catch (error) {
            toast.error('Failed to reject application');
        }
    };

    const handleDeleteTuition = async (tid) => {
        if (!confirm('Delete post?')) return;
        try {
            await api.delete(`/api/tuitions/${tid}`);
            toast.success('Deleted');
            setMyTuitions(prev => prev.filter(t => t._id !== tid));
        } catch (error) {
            toast.error('Error deleting tuition');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'post-job', label: 'Post Tuition' },
        { id: 'my-jobs', label: 'My Tuitions' },
        { id: 'applications', label: 'Applied Tutors' },
        { id: 'booked', label: 'Booked' },
        { id: 'payments', label: 'Payments' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <div className="tabs tabs-boxed flex-wrap">
                    {tabs.map(tab => (
                        <a
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </a>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">My Posted Tuitions</div>
                        <div className="stat-value text-primary">{myTuitions.length}</div>
                        <div className="stat-desc">Tuitions you posted</div>
                    </div>
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Applications</div>
                        <div className="stat-value text-secondary">{applications.length}</div>
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
                            <select {...register('days_per_week', { valueAsNumber: true })} className="select select-bordered">
                                <option value="3">3 days</option>
                                <option value="4">4 days</option>
                                <option value="5">5 days</option>
                                <option value="6">6 days</option>
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
                    <h2 className="text-xl font-bold mb-4">My Posted Tuitions</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Class</th>
                                    <th>Subject</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTuitions.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center">No tuitions posted yet</td></tr>
                                ) : (
                                    myTuitions.map((job, idx) => (
                                        <tr key={job._id}>
                                            <th>{idx + 1}</th>
                                            <td>{job.class_name}</td>
                                            <td>{job.subject}</td>
                                            <td>{job.salary}</td>
                                            <td><div className="badge badge-info">{job.status}</div></td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button className="btn btn-info btn-xs" onClick={() => navigate(`/tuition/${job._id}`)}>Edit</button>
                                                    <button className="btn btn-error btn-xs" onClick={() => handleDeleteTuition(job._id)}>Delete</button>
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
                                            <div className={`badge ${app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                                                {app.status}
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p><strong>Qualifications:</strong> {app.qualifications}</p>
                                            <p><strong>Experience:</strong> {app.experience || app.experiance}</p>
                                            <p><strong>Expected Salary:</strong> ৳{app.expectedSalary}/month</p>
                                        </div>
                                        {app.status === 'pending' && (
                                            <div className="card-actions justify-end mt-4">
                                                <button className="btn btn-error btn-sm" onClick={() => handleReject(app._id)}>Reject</button>
                                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(app._id)}>Accept & Pay</button>
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
                                            <td>{booking.tutor_name || booking.tutorName}</td>
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
                        <a href="/payment-history" className="btn btn-primary">View Full Payment History</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;