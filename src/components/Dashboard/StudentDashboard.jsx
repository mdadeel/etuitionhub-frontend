import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import StudentPayments from './StudentPayments';
import { 
    Activity, 
    Plus, 
    Database, 
    FileText, 
    Trash2, 
    UserCheck,
    Phone,
    RefreshCw,
    Search,
    Banknote
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppleCard, AppleHeader, AppleButton } from '../shared/AppleUI';
import FilterSelect from '../shared/FilterSelect';
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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

    // Fetch tuitions for this student
    const fetchMyTuitions = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await api.get(`/api/tuitions/student/${user.email}`);
            setMyTuitions(res.data || []);
        } catch (err) {
            console.error('Failed to fetch tuitions:', err);
            toast.error('Failed to load your requests');
            setMyTuitions([]);
        }
    }, [user?.email]);

    // Fetch bookings for this student
    const fetchBookings = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await api.get(`/api/bookings/student/${user.email}`);
            setBookings(res.data || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setBookings([]);
        }
    }, [user?.email]);

    // Fetch applications for student's tuitions
    const fetchApplications = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await api.get(`/api/applications/student/${user.email}`);
            setApplications(res.data || []);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            setApplications([]);
        }
    }, [user?.email]);

    // Initial data fetch
    useEffect(() => {
        if (!user?.email) return;
        
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchMyTuitions(),
                    fetchBookings(),
                    fetchApplications()
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user?.email, fetchMyTuitions, fetchBookings, fetchApplications]);

    // Refresh data after any mutation
    const refreshData = useCallback(async () => {
        await Promise.all([
            fetchMyTuitions(),
            fetchBookings(),
            fetchApplications()
        ]);
    }, [fetchMyTuitions, fetchBookings, fetchApplications]);

    const onPostTuition = async (data) => {
        setSubmitting(true);
        const postData = {
            ...data,
            student_email: user?.email,
            status: 'pending'
        };

        try {
            await api.post('/api/tuitions', postData);
            toast.success('Request posted successfully!');
            reset();
            await refreshData();
            setActiveTab('my-jobs');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to post request';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = (id) => navigate(`/checkout/${id}`);

    const handleReject = async (id) => {
        if (!confirm('Reject this application?')) return;
        try {
            await api.patch(`/api/applications/${id}`, { status: 'rejected' });
            toast.success('Application rejected');
            setApplications(prev => prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a));
        } catch {
            toast.error('Failed to reject application');
        }
    };

    const handleDeleteTuition = async (tid) => {
        if (!confirm('Delete this request?')) return;
        try {
            await api.delete(`/api/tuitions/${tid}`);
            toast.success('Request deleted');
            await refreshData();
        } catch {
            toast.error('Failed to delete request');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'post-job', label: 'Post Job', icon: Plus },
        { id: 'my-jobs', label: 'My Requests', icon: Database },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'booked', label: 'Engagements', icon: UserCheck },
        { id: 'payments', label: 'Payments', icon: Banknote }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            
            <AppleHeader 
                title={`Hello, ${user?.displayName?.split(' ')[0]}`}
                subtitle="Manage your tutoring requests and find the perfect match for your studies."
                badge={<span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-secondary/10 text-secondary">Student Dashboard</span>}
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
                loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : (
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
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Tutor Applications</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{applications.length}</span>
                                <span className="text-xs font-medium text-muted-foreground">applications</span>
                            </div>
                        </AppleCard>

                        <AppleCard className="p-8 group">
                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <UserCheck size={20} />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Active Engagements</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground tracking-tight tabular-nums">{bookings.filter(b => b.isAccepted).length}</span>
                                <span className="text-xs font-medium text-muted-foreground">sessions</span>
                            </div>
                        </AppleCard>
                    </div>
                )
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
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Subject / Topic *</Label>
                                    <Input 
                                        {...register('subject', { required: 'Subject is required' })} 
                                        placeholder="e.g. Higher Mathematics" 
                                        className="h-11 rounded-xl bg-muted/20 border-border/40" 
                                    />
                                    {errors.subject && (
                                        <p className="text-xs text-destructive ml-1">{errors.subject.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Class Level *</Label>
                                    <Controller
                                        name="class_name"
                                        control={control}
                                        rules={{ required: 'Class level is required' }}
                                        render={({ field }) => (
                                            <FilterSelect 
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                placeholder="Select Class"
                                                options={['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'HSC']}
                                            />
                                        )}
                                    />
                                    {errors.class_name && (
                                        <p className="text-xs text-destructive ml-1">{errors.class_name.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Monthly Budget (BDT) *</Label>
                                    <Input 
                                        {...register('salary', { required: 'Budget is required' })} 
                                        type="number" 
                                        placeholder="5000" 
                                        className="h-11 rounded-xl bg-muted/20 border-border/40" 
                                    />
                                    {errors.salary && (
                                        <p className="text-xs text-destructive ml-1">{errors.salary.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Curriculum *</Label>
                                    <Controller
                                        name="medium"
                                        control={control}
                                        rules={{ required: 'Curriculum is required' }}
                                        render={({ field }) => (
                                            <FilterSelect 
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                placeholder="Select Medium"
                                                options={['Bangla Medium', 'English Medium']}
                                            />
                                        )}
                                    />
                                    {errors.medium && (
                                        <p className="text-xs text-destructive ml-1">{errors.medium.message}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Location Details *</Label>
                                <Textarea 
                                    {...register('location', { required: 'Location is required' })} 
                                    className="rounded-xl bg-muted/20 border-border/40 min-h-[100px] resize-none" 
                                    placeholder="Provide full address for tutor reference..." 
                                />
                                {errors.location && (
                                    <p className="text-xs text-destructive ml-1">{errors.location.message}</p>
                                )}
                            </div>

                            <AppleButton 
                                type="submit" 
                                className="w-full h-12 rounded-xl shadow-lg shadow-primary/20" 
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                        Publishing...
                                    </>
                                ) : (
                                    "Publish Request"
                                )}
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
                                                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${job.status === 'approved' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                    {job.status === 'approved' ? 'Active' : 'Pending'}
                                                </span>
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
                                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${app.status === 'approved' ? 'bg-primary/10 text-primary' : app.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-muted text-muted-foreground'}`}>
                                            {app.status}
                                        </span>
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
                                                    <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary">Protocol Active</span>
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

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <StudentPayments />
            )}
        </div>
    );
};

export default StudentDashboard;
