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
    ShieldCheck, 
    Trash2, 
    Settings,
    UserCheck,
    Phone,
    MapPin,
    Zap,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

/**
 * StudentDashboard Component
 * Refactored to "Technical Emerald Minimalism"
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
        { id: 'overview', label: 'STRATEGIC_OVERVIEW', icon: Activity },
        { id: 'post-job', label: 'DRAFT_REQUIREMENT', icon: Plus },
        { id: 'my-jobs', label: 'ACTIVE_REQUESTS', icon: Database },
        { id: 'applications', label: 'CANDIDATE_PIPELINE', icon: FileText },
        { id: 'booked', label: 'VERIFIED_ENGAGEMENTS', icon: UserCheck }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 selection:bg-primary/30 selection:text-primary">
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 bg-background border-b border-border pb-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Client Infrastructure Interface</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-none">Management Hub.</h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-6 flex items-center gap-2">
                        <Database size={12} className="text-primary" /> SESSION_ACTIVE // {user?.email}
                    </p>
                </div>

                <div className="flex flex-wrap bg-muted/20 p-1 rounded-none border border-border gap-1 overflow-x-auto shrink-0 max-w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 text-[10px] whitespace-nowrap font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-none ${activeTab === tab.id
                                ? 'bg-background text-primary shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-50'} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-border bg-border">
                    <div className="p-12 bg-background border-r border-b border-border group hover:bg-muted/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 group-hover:text-primary transition-colors">Request Volume</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-foreground tracking-tighter tabular-nums italic leading-none">{myTuitions.length}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Active Posts</span>
                        </div>
                    </div>
                    <div className="p-12 bg-background border-r border-b border-border group hover:bg-muted/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 group-hover:text-primary transition-colors">Candidate Pipeline</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-primary tracking-tighter tabular-nums italic leading-none">{applications.length}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Verified Tutors</span>
                        </div>
                    </div>
                    <div className="p-12 bg-background border-r border-b border-border group hover:bg-muted/20 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 group-hover:text-primary transition-colors">Secured Tenure</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-foreground tracking-tighter tabular-nums italic leading-none">{bookings.filter(b => b.isAccepted).length}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Engagements</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'post-job' && (
                <div className="bg-background border border-border p-12 rounded-none max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-none -mr-24 -mt-24 rotate-45 transition-transform duration-700 group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
                            <div className="w-12 h-12 rounded-none bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Draft Strategic Requirement</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Initialize new marketplace recruitment protocol</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onPostTuition)} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Academic Target</Label>
                                    <Input {...register('subject', { required: true })} placeholder="E.G. HIGHER_MATHEMATICS" className="h-14 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary uppercase text-[11px] tracking-widest" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Complexity Level</Label>
                                    <Select onValueChange={(val) => setValue('class_name', val)}>
                                        <SelectTrigger className="h-14 rounded-none border-border bg-muted/20 font-bold focus:ring-primary uppercase text-[11px] tracking-widest">
                                            <SelectValue placeholder="SELECT_CLASS" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-border">
                                            {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'HSC'].map(c => (
                                                <SelectItem key={c} value={c} className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Proposed Yield (BDT/mo)</Label>
                                    <div className="relative">
                                        <Input {...register('salary', { required: true, min: 1000 })} type="number" placeholder="5000" className="h-14 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary pl-12 tabular-nums" />
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary italic">৳</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Instructional Medium</Label>
                                    <Select onValueChange={(val) => setValue('medium', val)}>
                                        <SelectTrigger className="h-14 rounded-none border-border bg-muted/20 font-bold focus:ring-primary uppercase text-[11px] tracking-widest">
                                            <SelectValue placeholder="SELECT_MEDIUM" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-border">
                                            <SelectItem value="Bangla Medium" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">Bangla Medium</SelectItem>
                                            <SelectItem value="English Medium" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">English Medium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Operations Frequency</Label>
                                <Select onValueChange={(val) => setValue('days_per_week', Number(val))}>
                                    <SelectTrigger className="h-14 rounded-none border-border bg-muted/20 font-bold focus:ring-primary uppercase text-[11px] tracking-widest">
                                        <SelectValue placeholder="ENGAGEMENT_FREQUENCY" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-border">
                                        <SelectItem value="3" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">3 Days (Standard)</SelectItem>
                                        <SelectItem value="4" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">4 Days (Intensive)</SelectItem>
                                        <SelectItem value="5" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">5 Days (High Frequency)</SelectItem>
                                        <SelectItem value="6" className="rounded-none focus:bg-primary/10 text-[10px] font-black uppercase tracking-widest">6 Days (Complete Immersion)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Geographic Parameters</Label>
                                <Textarea {...register('location', { required: true })} className="rounded-none border-border bg-muted/20 font-medium focus-visible:ring-primary min-h-[140px] resize-none p-6 text-sm" placeholder="PROVIDE_PRECISE_INSTRUCTION_DELIVERY_COORDINATES..." />
                            </div>

                            <Button className="w-full h-16 rounded-none text-[11px] font-black uppercase tracking-[0.3em] shadow-lg flex items-center justify-center gap-3 group/btn" disabled={loading}>
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Broadcast Requirement <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'my-jobs' && (
                <div className="bg-background border border-border shadow-2xl overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted border-b border-border">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Requirement Target</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Financial Yield</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {myTuitions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-32 text-center bg-muted/10">
                                             <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">No active requirements registered in this infrastructure.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    myTuitions.map((job, idx) => (
                                        <tr key={job._id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-10 py-8 text-[10px] font-black text-muted-foreground tabular-nums tracking-widest">REQ_{idx + 1001}</td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-foreground tracking-tighter uppercase italic">{job.subject}</p>
                                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">{job.class_name}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-black text-primary tabular-nums italic">৳{job.salary}</span>
                                                    <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest border-border ${
                                                        job.status === 'approved' ? 'text-primary border-primary bg-primary/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                                                    }`}>
                                                        {job.status === 'approved' ? 'VERIFIED' : 'PENDING'}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/tuition/${job._id}`)}>Adjust</Button>
                                                    <Button variant="ghost" size="sm" className="rounded-none text-[9px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5" onClick={() => handleDeleteTuition(job._id)}>Expunge</Button>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {applications.length === 0 ? (
                        <div className="col-span-full p-32 bg-muted/10 border border-dashed border-border text-center rounded-none relative overflow-hidden">
                             <Database size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">No incoming professional profiles in the pipeline.</p>
                        </div>
                    ) : (
                        applications.map(app => (
                            <div key={app._id} className="p-12 bg-background border border-border rounded-none shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-none -mr-20 -mt-20 rotate-45 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <header className="flex justify-between items-start mb-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-1.5 bg-primary"></div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Candidate Dossier</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase italic leading-none border-l-4 border-primary pl-6">{app.tutorName}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4 ml-6">{app.tutorEmail}</p>
                                        </div>
                                        <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                            app.status === 'approved' ? 'text-primary border-primary bg-primary/5' : 
                                            app.status === 'rejected' ? 'text-destructive border-destructive/20 bg-destructive/5' : 
                                            'text-muted-foreground bg-muted'
                                        }`}>
                                            {app.status}
                                        </Badge>
                                    </header>
                                    <div className="space-y-8 mb-12">
                                        <div>
                                            <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 block">Academic Context</Label>
                                            <div className="text-[11px] font-bold text-foreground bg-muted/50 p-6 border border-border leading-relaxed uppercase tracking-wide">
                                                {app.qualifications}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 block">Specialized Background</Label>
                                            <p className="text-[11px] font-bold text-muted-foreground italic border-l-2 border-primary/20 pl-6 leading-relaxed uppercase tracking-wide">
                                                {app.experience || app.experiance}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-8 border-t border-border">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Expected Honorarium</Label>
                                            <span className="text-2xl font-black text-primary tabular-nums italic">৳{app.expectedSalary}<span className="text-[10px] text-muted-foreground font-black ml-2 uppercase not-italic">/ cycle</span></span>
                                        </div>
                                    </div>
                                    {app.status === 'pending' && (
                                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                                            <Button variant="ghost" className="flex-1 h-14 rounded-none text-[10px] font-black uppercase tracking-[0.2em] hover:bg-destructive/5 hover:text-destructive" onClick={() => handleReject(app._id)}>Decline</Button>
                                            <Button className="flex-1 h-14 rounded-none text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 group/btn" onClick={() => handleApprove(app._id)}>
                                                Approve Connection <Zap size={14} className="group-hover/btn:fill-current" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'booked' && (
                <div className="bg-background border border-border shadow-2xl overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted border-b border-border">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Target Engagement</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Assigned Specialist</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Channel</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-32 text-center bg-muted/10">
                                            <ShieldCheck size={48} className="text-muted-foreground/20 mx-auto mb-8" strokeWidth={1} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">No active verified engagements identified.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking, idx) => (
                                        <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-foreground tracking-tighter uppercase italic">{booking.subject}</p>
                                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">Verified Engagement</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <Badge variant="outline" className="rounded-none px-4 py-2 border-border bg-muted/50 text-foreground font-black text-[9px] uppercase tracking-widest">
                                                    {booking.tutor_name || booking.tutorName}
                                                </Badge>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <Button asChild variant="ghost" className="h-10 px-4 rounded-none text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/10">
                                                    <a href={`tel:${booking.mobile}`}>
                                                        <Phone size={12} className="mr-2" /> {booking.mobile}
                                                    </a>
                                                </Button>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <Badge variant="outline" className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest border-primary text-primary bg-primary/5 ${
                                                    booking.isAccepted ? 'border-primary' : 'opacity-50'
                                                }`}>
                                                    {booking.isAccepted ? 'PROTOCOL_ACTIVE' : 'AWAITING_SYNC'}
                                                </Badge>
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
