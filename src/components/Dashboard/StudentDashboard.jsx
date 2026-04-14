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
        <div className="fade-up space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-600">Marketplace Ecosystem</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Management Dashboard</h1>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mt-3">SESSION AUTHENTICATED // {user?.email}</p>
                </div>

                <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1 border border-gray-100/50 overflow-x-auto shrink-0 max-w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-[9px] whitespace-nowrap font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-teal-600 shadow-md ring-1 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 group-hover:text-teal-600 transition-colors">Request Volume</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">{myTuitions.length}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Active Posts</span>
                        </div>
                    </div>
                    <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 group-hover:text-teal-600 transition-colors">Candidate Pipeline</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-teal-600 tracking-tighter">{applications.length}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Verified Tutors</span>
                        </div>
                    </div>
                    <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 group-hover:text-teal-600 transition-colors">Secured Tenure</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">{bookings.filter(b => b.isAccepted).length}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Booked Modes</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'post-job' && (
                <div className="bg-white border border-gray-100 p-10 rounded-2xl max-w-4xl mx-auto shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/30 rounded-full -mr-32 -mt-32"></div>
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm ring-1 ring-teal-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">Draft Strategic Requirement</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">Initialize new marketplace recruitment protocol</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onPostTuition)} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                <div className="space-y-3">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Academic Target</label>
                                    <input {...register('subject', { required: true })} placeholder="e.g. Higher Mathematics" className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-gray-300" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Complexity Level</label>
                                    <div className="relative">
                                        <select {...register('class_name', { required: true })} className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none cursor-pointer">
                                            <option>Class 6</option>
                                            <option>Class 7</option>
                                            <option>Class 8</option>
                                            <option>Class 9</option>
                                            <option>Class 10</option>
                                            <option>HSC</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Proposed Yield (BDT/mo)</label>
                                    <div className="relative">
                                        <input {...register('salary', { required: true, min: 1000 })} type="number" placeholder="5000" className="w-full h-14 px-5 pl-12 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-gray-300" />
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-teal-600">৳</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Instructional Medium</label>
                                    <div className="relative">
                                        <select {...register('medium')} className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none cursor-pointer">
                                            <option>Bangla Medium</option>
                                            <option>English Medium</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Operations Frequency</label>
                                <div className="relative">
                                    <select {...register('days_per_week', { valueAsNumber: true })} className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none cursor-pointer">
                                        <option value="3">3 days per week (Standard Engagement)</option>
                                        <option value="4">4 days per week (Intensive Engagement)</option>
                                        <option value="5">5 days per week (High Frequency)</option>
                                        <option value="6">6 days per week (Complete Immersion)</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Geographic Parameters</label>
                                <textarea {...register('location', { required: true })} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-gray-300 min-h-[140px] resize-none" placeholder="Provide precise instruction delivery coordinates..."></textarea>
                            </div>
                            <button className="w-full h-16 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Synchronizing Marketplace...
                                    </span>
                                ) : 'Finalize and Broadcast Requirement'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'my-jobs' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Requirement Target</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Financial Parameter</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">System Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {myTuitions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-24 text-center">
                                             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-sm mb-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">No active requirements registered in this infrastructure.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    myTuitions.map((job, idx) => (
                                        <tr key={job._id} className="hover:bg-teal-50/20 transition-colors">
                                            <td className="px-8 py-6 text-xs font-black text-gray-300">#REQ-0{idx + 1}</td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{job.subject}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{job.class_name}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-black text-teal-600 tracking-tighter">৳{job.salary}</span>
                                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border shadow-sm ${job.status === 'approved' 
                                                        ? 'bg-teal-50 text-teal-700 border-teal-100' 
                                                        : 'bg-amber-50 text-amber-600 border-amber-100 italic'
                                                        }`}>
                                                        {job.status === 'approved' ? 'Protocol Verified' : 'Awaiting Audit'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" onClick={() => navigate(`/tuition/${job._id}`)}>Adjust</button>
                                                    <button className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" onClick={() => handleDeleteTuition(job._id)}>Expunge</button>
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
                        <div className="col-span-full p-24 bg-white border border-dashed border-gray-100 rounded-3xl text-center">
                             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-sm mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">No incoming professional profiles in the pipeline.</p>
                        </div>
                    ) : (
                        applications.map(app => (
                            <div key={app._id} className="p-10 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <header className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-600">Verified Candidate</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{app.tutorName}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{app.tutorEmail}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border shadow-sm ${app.status === 'approved' ? 'bg-teal-50 text-teal-700 border-teal-100' : app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </header>
                                    <div className="space-y-6 text-sm text-gray-600 mb-10 leading-relaxed">
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Academic Credentials</label>
                                            <p className="font-bold text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100/50">{app.qualifications}</p>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Relevant Engagement History</label>
                                            <p className="font-bold text-gray-700 italic border-l-2 border-teal-100 pl-4">{app.experience || app.experiance}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Financial Expectation</label>
                                            <span className="text-xl font-black text-teal-600 tracking-tighter">৳{app.expectedSalary}<span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">/ cycle</span></span>
                                        </div>
                                    </div>
                                    {app.status === 'pending' && (
                                        <div className="flex gap-4">
                                            <button className="flex-1 h-14 bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all active:scale-95" onClick={() => handleReject(app._id)}>Decline</button>
                                            <button className="flex-1 h-14 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-teal-600/10 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95" onClick={() => handleApprove(app._id)}>Verify & Execute</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'booked' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target Engagement</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Assigned Professional</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Transmission Channel</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Protocol Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-24 text-center">
                                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-sm mb-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">No active verified engagements identified.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking, idx) => (
                                        <tr key={booking._id} className="hover:bg-teal-50/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{booking.subject}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">Verified Engagement</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                                    <span className="text-xs font-black text-gray-700">{booking.tutor_name || booking.tutorName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <a href={`tel:${booking.mobile}`} className="text-xs font-black text-teal-600 bg-teal-50/50 px-4 py-2 rounded-xl hover:bg-teal-100 transition-all border border-teal-100/50">
                                                    {booking.mobile}
                                                </a>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border shadow-sm ${booking.isAccepted ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                                    }`}>
                                                    {booking.isAccepted ? 'PROTOCOL ACTIVE' : 'PENDING SYNC'}
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