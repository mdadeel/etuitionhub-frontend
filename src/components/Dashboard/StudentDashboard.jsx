import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import demoTuitions from '../../data/demoTuitions.json';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    Activity, 
    Plus, 
    Database, 
    FileText, 
    Trash2, 
    UserCheck,
    Phone,
    Zap,
    ArrowUpRight,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppleCard, AppleBadge, AppleHeader, AppleButton } from '../shared/AppleUI';
import { cn } from '@/lib/utils';

/**
 * StudentDashboard Component — Refined Apple Aesthetic
 */
const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [bookings, setBookings] = useState([]);
    const [myTuitions, setMyTuitions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm();

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
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'post-job', label: 'Post Job', icon: Plus },
        { id: 'my-jobs', label: 'My Requests', icon: Database },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'booked', label: 'Engagements', icon: UserCheck }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            
            <AppleHeader 
                title={`Hello, ${user?.displayName?.split(' ')[0]}`}
                subtitle="Manage your tutoring requests and find the perfect match for your studies."
                badge={<AppleBadge variant="secondary">Student Dashboard</AppleBadge>}
            />

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl border border-border/40 w-fit max-w-full overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 text-xs font-semibold transition-all duration-300 rounded-xl whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-50'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AppleCard className="p-8 group">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Database size={20} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Active Requests</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{myTuitions.length}</span>
                            <span className="text-xs font-medium text-muted-foreground">posts</span>
                        </div>
                    </AppleCard>

                    <AppleCard className="p-8 group">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Tutor Pipeline</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{applications.length}</span>
                            <span className="text-xs font-medium text-muted-foreground">profiles</span>
                        </div>
                    </AppleCard>

                    <AppleCard className="p-8 group">
                        <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UserCheck size={20} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Active Sessions</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{bookings.filter(b => b.isAccepted).length}</span>
                            <span className="text-xs font-medium text-muted-foreground">verified</span>
                        </div>
                    </AppleCard>
                </div>
            )}

            {/* Post Job Tab */}
            {activeTab === 'post-job' && (
                <AppleCard className="p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground tracking-tight">Post a New Request</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Define your academic requirements to find the best tutor.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onPostTuition)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Subject / Topic</Label>
                                    <Input {...register('subject', { required: true })} placeholder="e.g. Higher Mathematics" className="h-11 rounded-xl bg-muted/20 border-border/40" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Class Level</Label>
                                    <Select onValueChange={(val) => setValue('class_name', val)}>
                                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40">
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40">
                                            {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'HSC'].map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Monthly Budget (BDT)</Label>
                                    <Input {...register('salary', { required: true })} type="number" placeholder="5000" className="h-11 rounded-xl bg-muted/20 border-border/40" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Curriculum</Label>
                                    <Select onValueChange={(val) => setValue('medium', val)}>
                                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40">
                                            <SelectValue placeholder="Select Medium" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40">
                                            <SelectItem value="Bangla Medium">Bangla Medium</SelectItem>
                                            <SelectItem value="English Medium">English Medium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Location Details</Label>
                                <Textarea {...register('location', { required: true })} className="rounded-xl bg-muted/20 border-border/40 min-h-[100px] resize-none" placeholder="Provide full address for tutor reference..." />
                            </div>

                            <AppleButton className="w-full h-12 rounded-xl shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? "Broadcasting..." : "Publish Request"}
                            </AppleButton>
                        </form>
                    </div>
                </AppleCard>
            )}

            {/* My Jobs Tab */}
            {activeTab === 'my-jobs' && (
                <AppleCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 border-b border-border/40">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Subject</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Yield</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {myTuitions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center text-sm text-muted-foreground italic">No active requests.</td>
                                    </tr>
                                ) : (
                                    myTuitions.map((job) => (
                                        <tr key={job._id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{job.subject}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">{job.class_name}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-primary tabular-nums">৳{job.salary}</td>
                                            <td className="px-8 py-6">
                                                <AppleBadge variant={job.status === 'approved' ? 'primary' : 'default'}>
                                                    {job.status === 'approved' ? 'Active' : 'Pending'}
                                                </AppleBadge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => navigate(`/tuition/${job._id}`)} className="text-[10px] font-bold text-primary hover:underline">View</button>
                                                    <button onClick={() => handleDeleteTuition(job._id)} className="text-[10px] font-bold text-destructive hover:underline">Remove</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AppleCard>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {applications.length === 0 ? (
                        <AppleCard className="col-span-full p-32 text-center border-dashed">
                             <Search size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-sm font-medium text-muted-foreground italic">No incoming applications yet.</p>
                        </AppleCard>
                    ) : (
                        applications.map(app => (
                            <AppleCard key={app._id} className="p-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground tracking-tight">{app.tutorName}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{app.tutorEmail}</p>
                                        </div>
                                        <AppleBadge variant={app.status === 'approved' ? 'primary' : app.status === 'rejected' ? 'error' : 'default'}>
                                            {app.status}
                                        </AppleBadge>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground leading-relaxed italic">
                                            "{app.qualifications}"
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-border/40">
                                            <span className="text-xs font-semibold text-muted-foreground">Expected Salary</span>
                                            <span className="text-lg font-bold text-primary tabular-nums">৳{app.expectedSalary}</span>
                                        </div>
                                    </div>

                                    {app.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <AppleButton variant="outline" className="flex-1 h-10 rounded-xl text-xs" onClick={() => handleReject(app._id)}>Decline</AppleButton>
                                            <AppleButton className="flex-1 h-10 rounded-xl text-xs" onClick={() => handleApprove(app._id)}>Approve</AppleButton>
                                        </div>
                                    )}
                                </div>
                            </AppleCard>
                        ))
                    )}
                </div>
            )}

            {/* Booked / Engagements Tab */}
            {activeTab === 'booked' && (
                <AppleCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 border-b border-border/40">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Tutor Name</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Subject</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Contact</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center text-sm text-muted-foreground italic">No verified engagements yet.</td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-foreground">{booking.tutor_name || booking.tutorName}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-semibold text-muted-foreground">{booking.subject}</td>
                                            <td className="px-8 py-6 text-center">
                                                <a href={`tel:${booking.mobile}`} className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1.5">
                                                    <Phone size={12} /> {booking.mobile}
                                                </a>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end gap-2">
                                                    <AppleBadge variant="primary" className="normal-case">Protocol Active</AppleBadge>
                                                    {booking.isAccepted && (
                                                        <AppleButton size="sm" className="h-7 px-3 text-[10px] rounded-lg" onClick={() => navigate(`/session/${booking._id}`)}>
                                                            Join Room
                                                        </AppleButton>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AppleCard>
            )}
        </div>
    );
};

export default StudentDashboard;
