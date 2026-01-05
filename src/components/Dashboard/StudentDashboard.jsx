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
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [bookings, setBookings] = useState([]);
    const [myTuitions, setMyTuitions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (!user?.email) return;

        const fetchData = async () => {
            try {
                let currentTuitions = [];
                try {
                    const response = await api.get(`/api/tuitions/student/${user.email}`);
                    if (response.data && response.data.length > 0) {
                        setMyTuitions(response.data);
                        currentTuitions = response.data;
                    } else {
                        setMyTuitions(demoTuitions.slice(0, 3));
                        currentTuitions = demoTuitions.slice(0, 3);
                    }
                } catch (err) {
                    setMyTuitions(demoTuitions.slice(0, 3));
                    currentTuitions = demoTuitions.slice(0, 3);
                }

                try {
                    const response = await api.get(`/api/bookings/student/${user.email}`);
                    setBookings(response.data);
                } catch (err) {
                    console.error('Booking fetch fail');
                }

                if (currentTuitions.length > 0) {
                    const allApps = [];
                    for (const t of currentTuitions) {
                        try {
                            const appResponse = await api.get(`/api/applications/tuition/${t._id}`);
                            allApps.push(...appResponse.data);
                        } catch (appErr) {
                            // bypass failures
                        }
                    }
                    setApplications(allApps);
                }
            } catch (e) {
                console.error('Core fetch failure', e);
            }
        };

        fetchData();
    }, [user?.email]);

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
            toast.success('Marketplace request registered.');
            reset();
            setActiveTab('my-jobs');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (id) => navigate(`/checkout/${id}`);

    const handleReject = async (id) => {
        if (!confirm('Reject this professional profile?')) return;
        try {
            await api.patch(`/api/applications/${id}`, { status: 'rejected' });
            toast.success('Profile rejected.');
            setApplications(prev => prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a));
        } catch (error) {
            toast.error('Operation failed.');
        }
    };

    const handleDeleteTuition = async (tid) => {
        if (!confirm('Permanently remove this requirement?')) return;
        try {
            await api.delete(`/api/tuitions/${tid}`);
            toast.success('Requirement expunged.');
            setMyTuitions(prev => prev.filter(t => t._id !== tid));
        } catch (error) {
            toast.error('System error.');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Management Overview' },
        { id: 'post-job', label: 'Draft Requirement' },
        { id: 'my-jobs', label: 'Active Requests' },
        { id: 'applications', label: 'Candidate Pipeline' },
        { id: 'booked', label: 'Verified Engagements' }
    ];

    return (
        <div className="fade-up">
            <header className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Client Interface</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Requirement Dashboard</h1>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-sm gap-1 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Request Volume</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-gray-900">{myTuitions.length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Posts</span>
                        </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Candidate Pipeline</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-indigo-600">{applications.length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Verified Tutors</span>
                        </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Active Tenure</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-gray-900">{bookings.filter(b => b.isAccepted).length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Booked</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'post-job' && (
                <div className="bg-white border border-gray-200 p-8 rounded-sm max-w-3xl mx-auto shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Draft New Requirement</h2>
                    <form onSubmit={handleSubmit(onPostTuition)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Academic Subject</label>
                                <input {...register('subject', { required: true })} placeholder="e.g. Higher Mathematics" className="input-quiet w-full h-12 px-4" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Academic Level</label>
                                <select {...register('class_name', { required: true })} className="input-quiet w-full h-12 px-4 appearance-none bg-white cursor-pointer">
                                    <option>Class 6</option>
                                    <option>Class 7</option>
                                    <option>Class 8</option>
                                    <option>Class 9</option>
                                    <option>Class 10</option>
                                    <option>HSC</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Proposed Yield (BDT/mo)</label>
                                <input {...register('salary', { required: true, min: 1000 })} type="number" placeholder="5000" className="input-quiet w-full h-12 px-4" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Instructional Medium</label>
                                <select {...register('medium')} className="input-quiet w-full h-12 px-4 appearance-none bg-white cursor-pointer">
                                    <option>Bangla Medium</option>
                                    <option>English Medium</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Operations Frequency</label>
                            <select {...register('days_per_week', { valueAsNumber: true })} className="input-quiet w-full h-12 px-4 appearance-none bg-white cursor-pointer">
                                <option value="3">3 days per week</option>
                                <option value="4">4 days per week</option>
                                <option value="5">5 days per week</option>
                                <option value="6">6 days per week</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Geographic Parameters</label>
                            <textarea {...register('location', { required: true })} className="input-quiet w-full p-4 min-h-[120px] resize-none" placeholder="Primary instruction location..."></textarea>
                        </div>
                        <button className="btn-quiet-primary w-full h-14" disabled={loading}>
                            {loading ? 'Processing System...' : 'Finalize and Post Requirement'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'my-jobs' && (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ref</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Position</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Parameters</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {myTuitions.length === 0 ? (
                                    <tr><td colSpan="4" className="p-20 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Zero requirements registered.</td></tr>
                                ) : (
                                    myTuitions.map((job, idx) => (
                                        <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-gray-400">#0{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{job.subject}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{job.class_name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-gray-600">৳{job.salary}</span>
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${job.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-6">
                                                    <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-600" onClick={() => navigate(`/tuition/${job._id}`)}>Adjust</button>
                                                    <button className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700" onClick={() => handleDeleteTuition(job._id)}>Remove</button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {applications.length === 0 ? (
                        <div className="col-span-full p-20 bg-white border border-dashed border-gray-200 rounded-sm text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pipeline currently inactive.</p>
                        </div>
                    ) : (
                        applications.map(app => (
                            <div key={app._id} className="p-8 bg-white border border-gray-200 shadow-sm rounded-sm">
                                <header className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-gray-900">{app.tutorName}</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{app.tutorEmail}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                        }`}>
                                        {app.status}
                                    </span>
                                </header>
                                <div className="space-y-4 text-sm text-gray-600 mb-8 max-w-lg leading-relaxed">
                                    <p><strong className="text-gray-900 border-b border-gray-100 pb-1 inline-block mb-1 font-bold text-[10px] uppercase tracking-widest">Qualifications</strong><br />{app.qualifications}</p>
                                    <p><strong className="text-gray-900 border-b border-gray-100 pb-1 inline-block mb-1 font-bold text-[10px] uppercase tracking-widest">Relevant Experience</strong><br />{app.experience || app.experiance}</p>
                                    <p><strong className="text-gray-900 border-b border-gray-100 pb-1 inline-block mb-1 font-bold text-[10px] uppercase tracking-widest">Proposed Yield</strong><br /><span className="text-indigo-600 font-extrabold text-lg">৳{app.expectedSalary}</span></p>
                                </div>
                                {app.status === 'pending' && (
                                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                                        <button className="btn-quiet-secondary flex-1 h-12" onClick={() => handleReject(app._id)}>Decline</button>
                                        <button className="btn-quiet-primary flex-1 h-12" onClick={() => handleApprove(app._id)}>Verify & Execute</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'booked' && (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Engagement</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Professional</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Communication</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.length === 0 ? (
                                    <tr><td colSpan="4" className="p-20 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">No active confirmed engagements.</td></tr>
                                ) : (
                                    bookings.map((booking, idx) => (
                                        <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{booking.subject}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{booking.tutor_name || booking.tutorName}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-indigo-600 tracking-wider transition-colors hover:text-indigo-800 cursor-pointer">{booking.mobile}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${booking.isAccepted ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                                    }`}>
                                                    {booking.isAccepted ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;