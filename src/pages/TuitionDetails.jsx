import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";

import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import TuitionCard from '../components/shared/TuitionCard';
import {
    ArrowLeft,
    Banknote,
    MapPin,
    Calendar,
    Clock,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoginRequiredModal from '../components/shared/LoginRequiredModal';
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "@/components/shared/skeletons";
import SEO from '../components/shared/SEO';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function TuitionDetailsSkeleton() {
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Skeleton className="w-36 h-4 rounded-full" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton className="p-6">
              <div className="flex gap-2 mb-4">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="w-64 h-7 rounded-lg mb-6" />
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <Skeleton className="w-20 h-14 rounded-lg" />
                <Skeleton className="w-24 h-14 rounded-lg" />
                <Skeleton className="w-20 h-14 rounded-lg" />
              </div>
            </CardSkeleton>
            <CardSkeleton className="p-6 space-y-3">
              <Skeleton className="w-32 h-5 rounded-lg" />
              <Skeleton className="w-full h-3 rounded-lg" />
              <Skeleton className="w-5/6 h-3 rounded-lg" />
              <Skeleton className="w-4/5 h-3 rounded-lg" />
            </CardSkeleton>
          </div>
          <div className="space-y-4">
            <CardSkeleton className="p-6">
              <Skeleton className="w-32 h-5 rounded-lg mb-4" />
              <div className="space-y-3">
                <Skeleton className="w-full h-10 rounded-xl" />
                <Skeleton className="w-full h-10 rounded-xl" />
                <Skeleton className="w-full h-10 bg-primary/20 rounded-xl" />
              </div>
            </CardSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

const TuitionDetails = () => {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [similarTuitions, setSimilarTuitions] = useState([]);

    const [formData, setFormData] = useState({
        qualifications: "",
        experience: '',
        expectedSalary: ""
    });

    const [showReachOutModal, setShowReachOutModal] = useState(false);
    const [reachOutMessage, setReachOutMessage] = useState('');
    const [reachOutRate, setReachOutRate] = useState('');
    const [submittingReachOut, setSubmittingReachOut] = useState(false);

    useEffect(() => {
        const fetchTuitionDetails = async () => {
            const trimmedId = id?.trim();
            if (!trimmedId) return;

            try {
                const response = await api.get(`/api/tuitions/${trimmedId}`);
                setTuition(response.data);
            } catch (error) {
                console.error('Failed to fetch tuition:', error);
                toast.error('Tuition post not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchTuitionDetails();
    }, [id]);

    useEffect(() => {
        if (tuition?._id) {
            api.get(`/api/tuitions/similar/${tuition._id}`)
                .then(res => setSimilarTuitions(res.data))
                .catch(err => console.error(err));
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
            setShowLoginModal(true);
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
                toast.success('Application submitted! The student will be notified.');
                setShowModal(false);
                setFormData({ qualifications: '', experience: "", expectedSalary: '' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to apply.";
            toast.error(errorMessage);
        }
    };

    const handleReachOut = async (e) => {
        e.preventDefault();
        if (!user || !dbUser) {
            setShowLoginModal(true);
            return;
        }
        if (!reachOutMessage.trim()) {
            toast.error('Please provide a message.');
            return;
        }

        setSubmittingReachOut(true);
        try {
            await api.post('/api/hire-requests', {
                toUserId: tuition.postedById,
                message: reachOutMessage,
                proposedRate: reachOutRate ? Number(reachOutRate) : undefined,
                tuitionPostId: id,
                subjects: [tuition.subject]
            });
            toast.success('Request sent to student!');
            setShowReachOutModal(false);
            setReachOutMessage('');
            setReachOutRate('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send request');
        } finally {
            setSubmittingReachOut(false);
        }
    };

    if (loading) return <TuitionDetailsSkeleton />;

    if (!tuition) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-heading text-foreground mb-2">Post Unavailable</h2>
                <p className="text-sm text-muted-foreground mb-6">This tuition post doesn't exist or was removed.</p>
                <Link to="/tuitions" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]">
                    Back to Jobs
                </Link>
            </div>
        );
    }

    return (
        <>
        <SEO title={`${tuition?.subject || 'Tuition'} in ${tuition?.location || 'Bangladesh'} | eTuitionBD`} description={`Find a verified ${tuition?.subject || 'tutor'} in ${tuition?.location || 'Bangladesh'}. View qualifications, experience, fees, and contact directly.`} />
        <div className="bg-background min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">


                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Hero Card */}
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium rounded-full">Class {tuition.class_name}</span>
                                <span className="px-2 py-1 bg-[#059669]/10 text-[#059669] text-xs font-medium rounded-full">Verified</span>
                                {tuition.curriculum && (
                                    <span className="px-2 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium rounded-full capitalize">{tuition.curriculum.replace(/_/g, ' ')}</span>
                                )}
                                {tuition.mode && (
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                        tuition.mode === 'online' ? 'bg-blue-500/10 text-blue-500' :
                                        tuition.mode === 'home' ? 'bg-emerald-500/10 text-emerald-500' :
                                        'bg-teal-500/10 text-teal-500'
                                    }`}>{tuition.mode}</span>
                                )}
                            </div>

                            {tuition.poster && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Avatar size="xs" className="size-6 rounded-full">
                                        <AvatarImage src={tuition.poster.photoURL} alt={tuition.poster.name} />
                                        <AvatarFallback className="text-[10px] font-medium rounded-full">
                                            {tuition.poster.name?.charAt(0)?.toUpperCase() || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">Posted by <span className="font-medium text-foreground">{tuition.poster.name || 'Unknown'}</span></span>
                                </div>
                            )}

                            <h1 className="text-xl font-heading text-foreground mb-6">
                                {tuition.subject} Tutor Required
                            </h1>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <Banknote size={12} className="text-[#2563EB]" /> Salary
                                    </p>
                                    <p className="text-lg font-heading text-foreground">৳{tuition.salary}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <MapPin size={12} className="text-[#2563EB]" /> Location
                                    </p>
                                    <p className="text-base font-medium text-foreground">{tuition.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <Calendar size={12} className="text-[#2563EB]" /> Schedule
                                    </p>
                                    <p className="text-base font-medium text-foreground">{tuition.days_per_week} Days/Wk</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                    <Target size={14} className="text-[#2563EB]" /> Tutor Requirements
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-xs text-muted-foreground">Preferred Gender</span>
                                        <span className="text-sm font-medium text-foreground capitalize">{tuition.preferredGender || 'Any'}</span>
                                    </div>
                                    {tuition.gender && (
                                        <div className="flex justify-between items-center py-2 border-b border-border/40">
                                            <span className="text-xs text-muted-foreground">Student Gender</span>
                                            <span className="text-sm font-medium text-foreground capitalize">{tuition.gender}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs text-muted-foreground">Preferred Days</span>
                                        <div className="flex gap-1 flex-wrap justify-end">
                                            {tuition.available_days?.slice(0, 4).map((day, idx) => (
                                                <span key={idx} className="bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-100 border border-border/40 dark:border-neutral-800 px-2 py-0.5 rounded text-xs font-medium capitalize">{day}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                    <BookOpen size={14} className="text-[#2563EB]" /> Job Description
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {tuition.description || "Looking for a dedicated and regular tutor to assist with academic requirements."}
                                </p>
                            </div>
                        </div>

                        {/* Trust Section */}
                        <div className="bg-[#2563EB]/5 p-4 rounded-lg border border-[#2563EB]/20">
                            <div className="flex items-start gap-4">
                                <div className="size-10 bg-[#2563EB]/15 flex items-center justify-center text-[#2563EB] rounded-lg shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium text-foreground">Verification Guarantee</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        This recruitment is monitored by e-TuitionBD. Student information is verified and payment is secured.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-1 text-xs font-medium text-[#2563EB]">
                                            <CheckCircle size={12} /> Verified
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-[#2563EB]">
                                            <Lock size={12} /> Privacy
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-[#2563EB]">
                                            <ShieldAlert size={12} /> Safe
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <div>
                                <h3 className="text-base font-heading text-foreground mb-2">Apply for this Job</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Ready to teach? Submit your credentials and start today.
                                </p>

                                <div className="space-y-2">
                                    {!user ? (
                                        <Link to="/login" className="block w-full px-4 py-2.5 bg-muted hover:bg-muted/80 text-neutral-800 dark:text-neutral-200 font-semibold rounded-lg text-sm text-center transition-colors border border-border/50">
                                            Login to Apply
                                        </Link>
                                    ) : !dbUser ? (
                                        <button disabled className="w-full px-4 py-2.5 bg-muted text-[#9CA3AF] rounded-lg text-sm">
                                            Loading...
                                        </button>
                                    ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                        <Dialog open={showModal} onOpenChange={setShowModal}>
                                            <DialogTrigger asChild>
                                                <button className="w-full px-4 py-2.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] text-sm transition-colors">
                                                    Express Interest
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md rounded-lg border-border p-4 bg-card">
                                                <DialogHeader>
                                                    <DialogTitle className="text-lg font-heading">Tutor Application</DialogTitle>
                                                    <DialogDescription className="text-sm text-muted-foreground">
                                                        Applying for: {tuition.subject} ({tuition.location})
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                Qualifications
                                                            </Label>
                                                            <Textarea
                                                                name="qualifications"
                                                                value={formData.qualifications}
                                                                onChange={handleChange}
                                                                className="min-h-[80px] rounded-lg"
                                                                placeholder="e.g. B.Sc in Physics..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                Experience
                                                            </Label>
                                                            <Textarea
                                                                name="experience"
                                                                value={formData.experience}
                                                                onChange={handleChange}
                                                                className="min-h-[80px] rounded-lg"
                                                                placeholder="Your teaching history..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                Expected Salary (৳/mo)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                name="expectedSalary"
                                                                value={formData.expectedSalary}
                                                                onChange={handleChange}
                                                                placeholder={`Min ৳${tuition.salary}`}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-2">
                                                        <button type="button" className="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-background text-sm transition-colors" onClick={() => setShowModal(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="submit" className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] text-sm transition-colors">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground text-center">
                                            {dbUser?.role !== 'tutor' ? "Tutor profile required" : "Applications closed"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reach Out Button (for tutors) */}
                        {dbUser?.role === 'tutor' && tuition.status === 'approved' && (
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h3 className="text-base font-heading text-foreground mb-2">Contact Student</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Interested in this tuition? Reach out directly.
                                </p>
                                <button
                                    onClick={() => setShowReachOutModal(true)}
                                    className="w-full px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 text-sm transition-colors"
                                >
                                    Reach Out to Student
                                </button>
                            </div>
                        )}

                        {/* Safety Tips */}
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                <ShieldAlert size={14} className="text-[#D97706]" /> Safety Tips
                            </h4>
                            <ul className="space-y-2">
                                <li className="text-xs text-muted-foreground flex gap-2">
                                    <span className="size-1 bg-[#D97706] rounded-full mt-1.5 shrink-0"></span>
                                    No advance registration fees
                                </li>
                                <li className="text-xs text-muted-foreground flex gap-2">
                                    <span className="size-1 bg-[#D97706] rounded-full mt-1.5 shrink-0"></span>
                                    Verify student credentials
                                </li>
                                <li className="text-xs text-muted-foreground flex gap-2">
                                    <span className="size-1 bg-[#D97706] rounded-full mt-1.5 shrink-0"></span>
                                    Keep communications on platform
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Similar Jobs */}
                <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-heading text-foreground">Similar Tuition Jobs</h2>
                        </div>
                        <Link to="/tuitions" className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarTuitions.slice(0, 3).map((item) => (
                            <TuitionCard key={item._id} tuition={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="apply for this tuition" />
        {showReachOutModal && (
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-heading text-foreground">Reach Out to Student</h3>
                        <button onClick={() => setShowReachOutModal(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground text-xl leading-none">&times;</button>
                    </div>
                    <form onSubmit={handleReachOut}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Message</label>
                                <textarea
                                    value={reachOutMessage}
                                    onChange={(e) => setReachOutMessage(e.target.value)}
                                    placeholder="Hi, I'm interested in this tuition..."
                                    maxLength={500}
                                    className="w-full h-24 bg-background border border-border rounded-xl p-3 text-sm text-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1 text-right">{reachOutMessage.length}/500</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Proposed Rate (৳/mo)</label>
                                <input
                                    type="number"
                                    value={reachOutRate}
                                    onChange={(e) => setReachOutRate(e.target.value)}
                                    placeholder={tuition.salary ? `e.g. ${tuition.salary}` : 'e.g. 5000'}
                                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button type="button" onClick={() => setShowReachOutModal(false)} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all">
                                Cancel
                            </button>
                            <button type="submit" disabled={submittingReachOut || !reachOutMessage.trim()} className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all">
                                {submittingReachOut ? 'Sending…' : 'Send Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default TuitionDetails;