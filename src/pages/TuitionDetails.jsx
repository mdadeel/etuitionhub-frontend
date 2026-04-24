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
    Lock,
    BookOpen,
    Target
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
import { motion, AnimatePresence } from 'framer-motion';

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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background min-h-screen py-12 px-6 selection:bg-primary/20 selection:text-primary">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1100px] mx-auto"
            >
                {/* Back Link */}
                <div className="mb-10">
                    <Link to="/tuitions" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
                        Back to Tuition Jobs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* Compact Hero Card */}
                        <AppleCard className="p-10 relative overflow-hidden" hover={false}>
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <AppleBadge variant="primary" className="px-3 py-1">Class {tuition.class_name}</AppleBadge>
                                    <AppleBadge variant="success" className="px-3 py-1">Verified Opportunity</AppleBadge>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-10">
                                    {tuition.subject} Tutor Required
                                </h1>

                                <div className="grid grid-cols-3 gap-8 py-10 border-t border-border/50">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Banknote size={12} className="text-primary" /> Monthly Salary
                                        </p>
                                        <p className="text-2xl font-bold text-foreground tabular-nums">৳{tuition.salary}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <MapPin size={12} className="text-primary" /> Location
                                        </p>
                                        <p className="text-xl font-bold text-foreground">{tuition.location}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Calendar size={12} className="text-primary" /> Schedule
                                        </p>
                                        <p className="text-xl font-bold text-foreground">{tuition.days_per_week} Days/Wk</p>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>

                        {/* Summary & Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AppleCard className="p-8" hover={false}>
                                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Target size={16} className="text-primary" /> Student Profile
                                </h2>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center py-3 border-b border-border/30">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tutor Gender</span>
                                        <span className="text-sm font-bold text-foreground">{tuition.gender || 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred Days</span>
                                        <div className="flex gap-2">
                                            {tuition.available_days?.slice(0, 3).map((day, idx) => (
                                                <span key={idx} className="bg-muted px-3 py-1 rounded-lg text-[10px] font-bold text-foreground border border-border/50 uppercase tracking-tighter">{day.slice(0, 3)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AppleCard>

                            <AppleCard className="p-8" hover={false}>
                                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <BookOpen size={16} className="text-primary" /> Job Description
                                </h2>
                                <p className="text-sm text-foreground leading-relaxed font-bold">
                                    {tuition.description || "Looking for a dedicated and regular tutor to assist with academic requirements. Consistency and conceptual clarity are prioritized."}
                                </p>
                            </AppleCard>
                        </div>

                        {/* New Trust Section */}
                        <AppleCard className="p-10 bg-primary/5 border-primary/10" hover={false}>
                            <div className="flex items-start gap-8">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
                                    <ShieldCheck size={28} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-foreground">Premium Verification Guarantee</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        This recruitment process is strictly monitored by e-TuitionBD. We guarantee that all student information is authentic and the payment structure is secured against any discrepancies.
                                    </p>
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
                                            <CheckCircle size={14} /> Verified Student
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
                                            <Lock size={14} /> Privacy Protected
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
                                            <ShieldAlert size={14} /> Scam-Free Policy
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
                                <h3 className="text-2xl font-bold text-foreground mb-3">Apply for this Job</h3>
                                <p className="text-sm text-muted-foreground mb-10 leading-relaxed font-medium">
                                    Ready to teach? Submit your credentials and start your journey today.
                                </p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <AppleButton asChild variant="secondary" className="w-full h-14 text-sm font-bold">
                                            <Link to="/login">Login to Apply</Link>
                                        </AppleButton>
                                    ) : !dbUser ? (
                                        <AppleButton disabled className="w-full h-14 text-sm opacity-50">
                                            Synchronizing Profile...
                                        </AppleButton>
                                    ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                        <Dialog open={showModal} onOpenChange={setShowModal}>
                                            <DialogTrigger asChild>
                                                <AppleButton size="lg" className="w-full h-14 shadow-apple-md text-sm font-bold">
                                                    Express Interest
                                                </AppleButton>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl rounded-[2.5rem] border-border p-0 overflow-hidden bg-card shadow-2xl">
                                                <DialogHeader className="p-10 border-b border-border/50 bg-muted/20">
                                                    <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">Tutor Application</DialogTitle>
                                                    <DialogDescription className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                                                        Applying for: {tuition.subject} ({tuition.location})
                     </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                                                                Academic Qualifications
                                                            </Label>
                                                            <Textarea
                                                                name="qualifications"
                                                                value={formData.qualifications}
                                                                onChange={handleChange}
                                                                className="min-h-[120px] rounded-2xl bg-muted/30 border-border/50 text-sm focus-visible:ring-primary/20 resize-none font-medium"
                                                                placeholder="e.g. B.Sc in Physics from BUET..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                                                                Pedagogical Experience
                                                            </Label>
                                                            <Textarea
                                                                name="experience"
                                                                value={formData.experience}
                                                                onChange={handleChange}
                                                                className="min-h-[120px] rounded-2xl bg-muted/30 border-border/50 text-sm focus-visible:ring-primary/20 resize-none font-medium"
                                                                placeholder="Detail your teaching history..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                                                                Expected Compensation (৳/mo)
                                                            </Label>
                                                            <AppleInput
                                                                type="number"
                                                                name="expectedSalary"
                                                                value={formData.expectedSalary}
                                                                onChange={handleChange}
                                                                className="h-14 shadow-none text-base font-bold"
                                                                placeholder={`Starting from ৳${tuition.salary}`}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogFooter className="flex gap-4 pt-4">
                                                        <AppleButton type="button" variant="ghost" className="flex-1 h-14 text-sm font-bold" onClick={() => setShowModal(false)}>
                                                            Dismiss
                                                        </AppleButton>
                                                        <AppleButton type="submit" className="flex-1 h-14 shadow-apple-md text-sm font-bold">
                                                            Submit Application
                                                        </AppleButton>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="p-6 bg-muted/50 border border-border/50 rounded-2xl text-muted-foreground text-[11px] font-bold uppercase tracking-widest text-center leading-relaxed">
                                            {dbUser?.role !== 'tutor' ? "Specialized Tutor Profile Required" : "Applications Temporarily Closed"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AppleCard>

                        {/* Safety Tips Card */}
                        <AppleCard className="p-8 bg-muted/20 border-dashed" hover={false}>
                            <h4 className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <ShieldAlert size={16} className="text-orange-500" /> Platform Security
                            </h4>
                            <ul className="space-y-4">
                                <li className="text-xs text-muted-foreground flex gap-3 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 shrink-0"></div>
                                    Zero-tolerance policy for advance "registration fees".
                                </li>
                                <li className="text-xs text-muted-foreground flex gap-3 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 shrink-0"></div>
                                    Verify student credentials during the initial consultation.
                                </li>
                                <li className="text-xs text-muted-foreground flex gap-3 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 shrink-0"></div>
                                    Keep all initial communications within the platform.
                                </li>
                            </ul>
                        </AppleCard>
                    </div>
                </div>

                {/* Similar Jobs */}
                <div className="mt-24 pt-16 border-t border-border/50">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Recommendations</span>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">Similar Tuition Jobs</h2>
                        </div>
                        <AppleButton asChild variant="ghost" size="sm" className="group text-xs font-bold uppercase tracking-widest">
                            <Link to="/tuitions" className="flex items-center gap-2">
                                View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </AppleButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {demoTuitions
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map((item, idx) => (
                                <motion.div key={item._id} variants={itemVariants}>
                                    <TuitionCard tuition={item} />
                                </motion.div>
                            ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TuitionDetails;

