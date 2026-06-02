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

const TuitionDetails = () => {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    const navigate = useNavigate();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [similarTuitions, setSimilarTuitions] = useState([]);

    const [formData, setFormData] = useState({
        qualifications: "",
        experience: '',
        expectedSalary: ""
    });

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
                toast.success('Application submitted! The student will be notified.');
                setShowModal(false);
                setFormData({ qualifications: '', experience: "", expectedSalary: '' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to apply.";
            toast.error(errorMessage);
        }
    };

    if (loading) return (
        <div className="bg-background min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <div className="w-36 h-4 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <div className="flex gap-2 mb-4">
                                <div className="w-20 h-6 bg-muted rounded-full animate-pulse"></div>
                                <div className="w-16 h-6 bg-muted rounded-full animate-pulse"></div>
                            </div>
                            <div className="w-64 h-7 bg-muted rounded animate-pulse mb-6"></div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                <div className="w-20 h-14 bg-muted rounded animate-pulse"></div>
                                <div className="w-24 h-14 bg-muted rounded animate-pulse"></div>
                                <div className="w-20 h-14 bg-muted rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card p-4 rounded-lg border border-border h-32">
                                <div className="w-28 h-4 bg-muted rounded animate-pulse mb-3"></div>
                                <div className="space-y-3">
                                    <div className="w-full h-3 bg-muted rounded animate-pulse"></div>
                                    <div className="w-3/4 h-3 bg-muted rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-lg border border-border h-32">
                                <div className="w-28 h-4 bg-muted rounded animate-pulse mb-3"></div>
                                <div className="space-y-2">
                                    <div className="w-full h-3 bg-muted rounded animate-pulse"></div>
                                    <div className="w-5/6 h-3 bg-muted rounded animate-pulse"></div>
                                    <div className="w-2/3 h-3 bg-muted rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-card p-6 rounded-lg border border-border h-56">
                            <div className="w-32 h-5 bg-muted rounded animate-pulse mb-4"></div>
                            <div className="space-y-3">
                                <div className="w-full h-10 bg-muted rounded animate-pulse"></div>
                                <div className="w-full h-10 bg-muted rounded animate-pulse"></div>
                                <div className="w-full h-10 bg-[#2563EB]/20 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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
        <div className="bg-background min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/tuitions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#2563EB] transition-colors">
                        <ArrowLeft size={16} />
                        Back to Tuition Jobs
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Hero Card */}
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium rounded-full">Class {tuition.class_name}</span>
                                <span className="px-2 py-1 bg-[#059669]/10 text-[#059669] text-xs font-medium rounded-full">Verified</span>
                            </div>

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
                                <h2 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
                                    <Target size={14} className="text-[#2563EB]" /> Student Profile
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-[rgba(15,23,46,0.04)]">
                                        <span className="text-xs text-muted-foreground">Tutor Gender</span>
                                        <span className="text-sm font-medium text-foreground">{tuition.gender || 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs text-muted-foreground">Preferred Days</span>
                                        <div className="flex gap-1">
                                            {tuition.available_days?.slice(0, 3).map((day, idx) => (
                                                <span key={idx} className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">{day.slice(0, 3)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h2 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
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
                                        <Link to="/login" className="block w-full px-4 py-2.5 bg-muted text-[#374151] font-medium rounded-lg hover:bg-[#E2E8F0] text-sm text-center transition-colors">
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

                        {/* Safety Tips */}
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <h4 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
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
    );
};

export default TuitionDetails;