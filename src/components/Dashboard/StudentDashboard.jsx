
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import demoTuitions from '../../data/demoTuitions.json'; // demo data fallback
import API_URL from '../../config/api';

var StudentDashboard = () => {
    // manual destructuring - messy style
    let auth = useAuth()
    var user = auth.user

    // tab state
    var tabState = useState('overview')
    var activeTab = tabState[0]
    var setActiveTab = tabState[1]

    var [bookings, setBookings] = useState([])
    let [myTuitions, setMyTuitions] = useState([])
    var [applications, setApplications] = useState([])

    var { register, handleSubmit, reset } = useForm();
    var [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.email) return;

        const fetchDta = async () => {
            try {
                // getting tuitions
                const r1 = await fetch(`${API_URL}/api/tuitions/student/${user.email}`);

                if (r1.ok) {
                    const d1 = await r1.json();
                    if (d1.length > 0) {
                        setMyTuitions(d1);
                    } else {
                        setMyTuitions(demoTuitions.slice(0, 3));
                    }
                } else {
                    setMyTuitions(demoTuitions.slice(0, 3));
                }

                // bookings chk
                const r2 = await fetch(`${API_URL}/api/bookings/student/${user.email}`);
                if (r2.ok) {
                    const d2 = await r2.json();
                    setBookings(d2);
                }

                // apps cleanup
                if (r1.ok) {
                    const tData = await r1.json();
                    var allApps = []
                    for (const t of tData) {
                        const aRes = await fetch(`${API_URL}/api/applications/tuition/${t._id}`);
                        if (aRes.ok) {
                            const apps = await aRes.json();
                            allApps.push(...apps);
                        }
                    }
                    setApplications(allApps);
                }
            } catch (e) {
                // fail safe
                setMyTuitions(demoTuitions.slice(0, 3));
            }
        };

        fetchDta();

    }, [user?.email]);

    const onPostTuition = async (data) => {
        setLoading(true)
        var postData = {
            ...data,
            student_name: user?.displayName,
            student_email: user?.email,
            status: 'pending',
            createdAt: new Date()
        };

        try {
            var token = Cookies.get('token');
            var headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/api/tuitions`, {
                method: 'POST',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(postData)
            });

            if (res.ok) {
                toast.success('Tuition posted successfully!');
                reset();
                setActiveTab('my-jobs');
            } else {
                const err = await res.json();
                if (res.status === 401) toast.error('Session expired - login again');
                else toast.error('Failed - ' + (err.error || 'error'));
            }
        } catch (e) {
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (id) => {
        window.location.href = `/checkout/${id}`
    };

    const handleReject = async (id) => {
        if (!confirm('Reject application?')) return;
        try {
            const res = await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            });
            if (res.ok) {
                toast.success('Rejected');
                setApplications(prev => prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a));
            }
        } catch (e) { }
    };

    const handleDeleteTuition = async (tid) => {
        if (!confirm('Delete post?')) return;
        try {
            var token = Cookies.get('token');
            var headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/api/tuitions/${tid}`, {
                method: 'DELETE',
                headers: headers,
                credentials: 'include'
            });
            if (res.ok) {
                toast.success('Deleted');
                setMyTuitions(prev => prev.filter(t => t._id !== tid));
            }
        } catch (e) {
            toast.error('Error deleting');
        }
    };

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
                        <div className="stat-title">My Posted Tuitions</div>
                        <div className="stat-value text-primary">{myTuitions.length}</div>
                        <div className="stat-desc">Tuitions you posted</div>
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

            {activeTab === 'post-job' ? (
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
            ) : null}

            {activeTab === 'my-jobs' && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">My Posted Tuitions</h2>
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
                                    <tr><td colSpan="6" className="text-center">No tuitions posted yet</td></tr>
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
                                                    <button className="btn btn-info btn-xs" onClick={() => window.location.href = `/tuition/${job._id}`}>Edit</button>
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
                                            <p><strong>Experience:</strong> {app.experiance}</p>
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
