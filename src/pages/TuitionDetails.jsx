import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";
import demoTuitions from '../data/demoTuitions.json';
import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TuitionCard from '../components/shared/TuitionCard';
import { 
    ArrowLeft, 
    Banknote, 
    MapPin, 
    Calendar, 
    Clock, 
    User, 
    ShieldCheck, 
    Send,
    ArrowRight,
    Award,
    CheckCircle,
    Info,
    ShieldAlert,
    Lock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { AppleBadge, AppleCard, AppleButton, AppleInput } from '../components/shared/AppleUI';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AOS from 'aos';

const TuitionDetails = () => {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    const navigate = useNavigate();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        qualifications: "",
        experience: '',
        expectedSalary: ""
    });

    useEffect(() => {
        const fetchTuitionDetails = async () => {
            try {
                const response = await api.get(`/api/tuitions/${id}`);
                setTuition(response.data);
            } catch (error) {
                const demoTuition = demoTuitions.find(t => t._id === id);
                if (demoTuition) {
                    setTuition(demoTuition);
                } else {
                    toast.error('Tuition post not found.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTuitionDetails();
    }, [id]);

    useEffect(() => {
        if (typeof AOS !== 'undefined' && AOS.refresh) {
            AOS.refresh();
        }
    }, [tuition]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !dbUser) {
            toast.error('Please login first.');
            navigate('/login');
            return;
        }

        if (!formData.qualifications || !formData.experience || !formData.expectedSalary) {
            toast.error("Please fill all fields.");
            return;
        }

        if (formData.expectedSalary < 1000) {
            toast.error('Salary is too low.');
            return;
        }

        if (!isValidObjectId(id)) {
            toast.error('Cannot apply to demo data.');
            return;
        }

        const applicationData = {
            tutorId: dbUser._id,
            tutorEmail: user.email,
            tutorName: user.displayName,
            tuitionId: id,
            studentEmail: tuition.student_email,
            qualifications: formData.qualifications,
            experience: formData.experience,
            expectedSalary: Number(formData.expectedSalary)
        };

        try {
            const response = await api.post('/api/applications', applicationData);
            if (response.status === 201) {
                toast.success("Applied successfully! Wait for approval.");
                setShowModal(false);
                setFormData({ qualifications: '', experience: "", expectedSalary: '' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to apply.";
            toast.error(errorMessage);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner />
        </div>
    );

    if (!tuition) {
        return (
            <div className="max-w-xl mx-auto px-6 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Post Unavailable</h1>
                <p className="text-muted-foreground mb-8 text-sm">This tuition post doesn't exist or was removed.</p>
                <AppleButton asChild variant="primary">
                    <Link to="/tuitions">Back to Jobs</Link>
                </AppleButton>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-8 px-6 selection:bg-primary/20 selection:text-primary">
            <div className="max-w-[1100px] mx-auto">
                {/* Simple Breadcrumb */}
                <div className="mb-6">
                    <Link to="/tuitions" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
                        Back to Tuition Jobs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Compact Hero Card */}
                        <AppleCard className="p-8 relative overflow-hidden" hover={false}>
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <AppleBadge variant="primary" className="text-[9px]">Class {tuition.class_name}</AppleBadge>
                                    <AppleBadge variant="success" className="text-[9px]">Verified Job</AppleBadge>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
                                    {tuition.subject} Tutor Needed
                                </h1>

                                <div className="grid grid-cols-3 gap-4 py-6 border-t border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <Banknote size={10} className="text-primary" /> Monthly Salary
                                        </p>
                                        <p className="text-xl font-bold text-foreground tabular-nums">৳{tuition.salary}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <MapPin size={10} className="text-primary" /> Location
                                        </p>
                                        <p className="text-lg font-bold text-foreground">{tuition.location}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <Calendar size={10} className="text-primary" /> Schedule
                                        </p>
                                        <p className="text-lg font-bold text-foreground">{tuition.days_per_week} Days/Wk</p>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>

                        {/* Summary & Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AppleCard className="p-6" hover={false}>
                                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Info size={14} className="text-primary" /> Student Profile
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                                        <span className="text-xs font-medium text-muted-foreground">Tutor Gender</span>
                                        <span className="text-xs font-bold text-foreground">{tuition.gender || 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs font-medium text-muted-foreground">Preferred Days</span>
                                        <div className="flex gap-1">
                                            {tuition.available_days?.slice(0, 3).map((day, idx) => (
                                                <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[9px] font-bold text-foreground">{day.slice(0, 3)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AppleCard>

                            <AppleCard className="p-6" hover={false}>
                                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Clock size={14} className="text-primary" /> Job Description
                                </h2>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                    {tuition.description || "The student needs help with their studies. Looking for a tutor who is regular and has good knowledge in the subject."}
                                </p>
                            </AppleCard>
                        </div>

                        {/* New Trust Section */}
                        <AppleCard className="p-8 bg-primary/5 border-primary/10" hover={false}>
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-foreground">Safe & Secure Process</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        This job is verified by e-TuitionBD. We ensure that the student info is real and your payment is safe. 
                                        Apply with confidence and grow your career.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                                            <CheckCircle size={12} /> Verified Student
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                                            <Lock size={12} /> Privacy Protected
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                                            <ShieldAlert size={12} /> No Advance Payment Needed
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>
                    </div>

                    {/* Right Column: Sticky Action Profile */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <AppleCard className="p-8 bg-card shadow-xl border-border/50 relative overflow-hidden" hover={false}>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-foreground mb-2">Apply for this Job</h3>
                                <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                                    Ready to teach? Send your application to the student now.
                                </p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <AppleButton asChild variant="secondary" className="w-full h-12 text-xs">
                                            <Link to="/login">Login to Apply</Link>
                                        </AppleButton>
                                    ) : !dbUser ? (
                                        <AppleButton disabled className="w-full h-12 text-xs opacity-50">
                                            Please wait...
                                        </AppleButton>
                                    ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                        <Dialog open={showModal} onOpenChange={setShowModal}>
                                            <DialogTrigger asChild>
                                                <AppleButton size="lg" className="w-full h-14 shadow-apple-md">
                                                    Apply Now
                                                </AppleButton>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl rounded-[2rem] border-border p-0 overflow-hidden bg-card shadow-2xl">
                                                <DialogHeader className="p-8 border-b border-border/50 bg-muted/20">
                                                    <DialogTitle className="text-2xl font-bold text-foreground">Apply as Tutor</DialogTitle>
                                                    <DialogDescription className="text-xs font-semibold text-muted-foreground mt-1">
                                                        You are applying for: {tuition.subject}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                                    <div className="space-y-5">
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                                Your Education
                                                            </Label>
                                                            <Textarea
                                                                name="qualifications"
                                                                value={formData.qualifications}
                                                                onChange={handleChange}
                                                                className="min-h-[100px] rounded-xl bg-muted/30 border-border/50 text-sm focus-visible:ring-primary/20 resize-none"
                                                                placeholder="e.g. BSc in Math from DU..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                                Experience
                                                            </Label>
                                                            <Textarea
                                                                name="experience"
                                                                value={formData.experience}
                                                                onChange={handleChange}
                                                                className="min-h-[100px] rounded-xl bg-muted/30 border-border/50 text-sm focus-visible:ring-primary/20 resize-none"
                                                                placeholder="e.g. 2 years of teaching experience..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                                Monthly Salary (৳)
                                                            </Label>
                                                            <AppleInput
                                                                type="number"
                                                                name="expectedSalary"
                                                                value={formData.expectedSalary}
                                                                onChange={handleChange}
                                                                className="h-12 shadow-none"
                                                                placeholder={`Min: ৳${tuition.salary}`}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogFooter className="flex gap-3 pt-4">
                                                        <AppleButton type="button" variant="ghost" className="flex-1 h-12" onClick={() => setShowModal(false)}>
                                                            Cancel
                                                        </AppleButton>
                                                        <AppleButton type="submit" className="flex-1 h-12 shadow-apple-md">
                                                            Send Application
                                                        </AppleButton>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="p-4 bg-muted/50 border border-border/50 rounded-xl text-muted-foreground text-[10px] font-bold uppercase tracking-widest text-center">
                                            {dbUser?.role !== 'tutor' ? "Tutor Profile Required" : "Applications Closed"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AppleCard>

                        {/* Safety Tips Card */}
                        <AppleCard className="p-6 bg-muted/20 border-dashed" hover={false}>
                            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldAlert size={14} className="text-orange-500" /> Safety Tips
                            </h4>
                            <ul className="space-y-3">
                                <li className="text-[11px] text-muted-foreground flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1 shrink-0"></div>
                                    Never pay any "matching fee" or "registration fee" in advance.
                                </li>
                                <li className="text-[11px] text-muted-foreground flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1 shrink-0"></div>
                                    Always teach in a safe and public location for the first trial.
                                </li>
                                <li className="text-[11px] text-muted-foreground flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1 shrink-0"></div>
                                    Report any suspicious activity to our support team immediately.
                                </li>
                            </ul>
                        </AppleCard>
                    </div>
                </div>

                {/* Similar Jobs */}
                <div className="mt-20 pt-12 border-t border-border/50">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">Recommendations</span>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">Similar Tuition Jobs</h2>
                        </div>
                        <AppleButton asChild variant="ghost" size="sm" className="group text-xs">
                            <Link to="/tuitions" className="flex items-center gap-2">
                                View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </AppleButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {demoTuitions
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map((item, idx) => (
                                <div key={item._id} data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <TuitionCard tuition={item} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuitionDetails;
