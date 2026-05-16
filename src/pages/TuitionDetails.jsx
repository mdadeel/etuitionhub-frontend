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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner />
        </div>
    );

    if (!tuition) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Post Unavailable</h2>
                <p className="text-sm text-slate-600 mb-6">This tuition post doesn't exist or was removed.</p>
                <Link to="/tuitions" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Back to Jobs
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/tuitions" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                        <ArrowLeft size={16} />
                        Back to Tuition Jobs
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Hero Card */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">Class {tuition.class_name}</span>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">Verified</span>
                            </div>

                            <h1 className="text-xl font-semibold text-slate-900 mb-6">
                                {tuition.subject} Tutor Required
                            </h1>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                                <div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                        <Banknote size={12} className="text-blue-600" /> Salary
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900">৳{tuition.salary}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                        <MapPin size={12} className="text-blue-600" /> Location
                                    </p>
                                    <p className="text-base font-medium text-slate-900">{tuition.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                        <Calendar size={12} className="text-blue-600" /> Schedule
                                    </p>
                                    <p className="text-base font-medium text-slate-900">{tuition.days_per_week} Days/Wk</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                    <Target size={14} className="text-blue-600" /> Student Profile
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs text-slate-500">Tutor Gender</span>
                                        <span className="text-sm font-medium text-slate-900">{tuition.gender || 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs text-slate-500">Preferred Days</span>
                                        <div className="flex gap-1">
                                            {tuition.available_days?.slice(0, 3).map((day, idx) => (
                                                <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600">{day.slice(0, 3)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                    <BookOpen size={14} className="text-blue-600" /> Job Description
                                </h2>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {tuition.description || "Looking for a dedicated and regular tutor to assist with academic requirements."}
                                </p>
                            </div>
                        </div>

                        {/* Trust Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center text-blue-600 rounded-lg shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium text-slate-900">Verification Guarantee</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        This recruitment is monitored by e-TuitionBD. Student information is verified and payment is secured.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                                            <CheckCircle size={12} /> Verified
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                                            <Lock size={12} /> Privacy
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                                            <ShieldAlert size={12} /> Safe
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <div>
                                <h3 className="text-base font-medium text-slate-900 mb-2">Apply for this Job</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Ready to teach? Submit your credentials and start today.
                                </p>

                                <div className="space-y-2">
                                    {!user ? (
                                        <Link to="/login" className="block w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200 text-sm text-center">
                                            Login to Apply
                                        </Link>
                                    ) : !dbUser ? (
                                        <button disabled className="w-full px-4 py-2.5 bg-slate-100 text-slate-400 rounded-md text-sm">
                                            Loading...
                                        </button>
                                    ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                        <Dialog open={showModal} onOpenChange={setShowModal}>
                                            <DialogTrigger asChild>
                                                <button className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-sm">
                                                    Express Interest
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md rounded-lg border-slate-200 p-4 bg-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-lg font-semibold">Tutor Application</DialogTitle>
                                                    <DialogDescription className="text-sm text-slate-600">
                                                        Applying for: {tuition.subject} ({tuition.location})
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium text-slate-600">
                                                                Qualifications
                                                            </Label>
                                                            <Textarea
                                                                name="qualifications"
                                                                value={formData.qualifications}
                                                                onChange={handleChange}
                                                                className="min-h-[80px] rounded-md"
                                                                placeholder="e.g. B.Sc in Physics..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium text-slate-600">
                                                                Experience
                                                            </Label>
                                                            <Textarea
                                                                name="experience"
                                                                value={formData.experience}
                                                                onChange={handleChange}
                                                                className="min-h-[80px] rounded-md"
                                                                placeholder="Your teaching history..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium text-slate-600">
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
                                                        <button type="button" className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 text-sm" onClick={() => setShowModal(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-600 text-center">
                                            {dbUser?.role !== 'tutor' ? "Tutor profile required" : "Applications closed"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Safety Tips */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                <ShieldAlert size={14} className="text-orange-500" /> Safety Tips
                            </h4>
                            <ul className="space-y-2">
                                <li className="text-xs text-slate-600 flex gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>
                                    No advance registration fees
                                </li>
                                <li className="text-xs text-slate-600 flex gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>
                                    Verify student credentials
                                </li>
                                <li className="text-xs text-slate-600 flex gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>
                                    Keep communications on platform
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Similar Jobs */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Similar Tuition Jobs</h2>
                        </div>
                        <Link to="/tuitions" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {demoTuitions
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map((item) => (
                                <TuitionCard key={item._id} tuition={item} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuitionDetails;