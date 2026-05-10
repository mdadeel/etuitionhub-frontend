import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, CheckCircle, ArrowRight, ArrowLeft, GraduationCap, BookOpen, MapPin, Phone, DollarSign, ShieldCheck } from "lucide-react";

const SUBJECT_OPTIONS = [
    'Mathematics', 'English', 'Bangla', 'Physics', 'Chemistry',
    'Biology', 'Higher Math', 'General Science', 'ICT',
    'Accounting', 'Finance', 'Economics', 'History', 'Geography'
];

const BecomeTutor = () => {
    const { user, dbUser, userRole, loading: authLoading, refreshUserFromDB } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(dbUser?.displayName || user?.displayName || '');
    const [phone, setPhone] = useState(dbUser?.mobileNumber || '');
    const [qualification, setQualification] = useState(dbUser?.qualification || '');
    const [subjects, setSubjects] = useState(dbUser?.subjects || []);
    const [expectedSalary, setExpectedSalary] = useState(dbUser?.expectedSalary || '');
    const [location, setLocation] = useState(dbUser?.location || '');

    const isAlreadyTutor = userRole === 'tutor';

    const toggleSubject = (subject) => {
        setSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/register');
            return;
        }

        if (!name || !qualification || subjects.length === 0 || !location) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.patch(`/api/users/by-email/${user.email}`, {
                displayName: name,
                mobileNumber: phone,
                qualification,
                subjects,
                expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
                location,
                role: 'tutor'
            });

            toast.success('Tutor profile created successfully!');
            await refreshUserFromDB(user.email);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create tutor profile');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-500">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Become a tutor</h1>
                    <p className="text-slate-600">Create your tutor profile and connect with students</p>
                </div>

                {!user ? (
                    <div className="bg-white border border-slate-200 p-8 rounded-xl text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase size={28} className="text-slate-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Create an account first</h2>
                        <p className="text-slate-600 mb-6">You need an account to register as a tutor</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                to="/login"
                                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                ) : isAlreadyTutor ? (
                    <div className="bg-white border border-slate-200 p-8 rounded-xl text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={28} className="text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">You're already a tutor</h2>
                        <p className="text-slate-600 mb-6">Your tutor profile is active. Manage it from your dashboard.</p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                        >
                            Go to Dashboard <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Step indicator */}
                        <div className="flex items-center gap-4 mb-8">
                            {[1, 2].map(s => (
                                <div key={s} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                        step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        {step > s ? <CheckCircle size={14} /> : s}
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        step >= s ? 'text-slate-900' : 'text-slate-400'
                                    }`}>
                                        {s === 1 ? 'Basic Info' : 'Subjects & Location'}
                                    </span>
                                    {s < 2 && <div className="w-8 h-0.5 bg-slate-200" />}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                            {step === 1 && (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Full Name *</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Phone Number</Label>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Qualification *</Label>
                                        <Textarea
                                            value={qualification}
                                            onChange={(e) => setQualification(e.target.value)}
                                            placeholder="e.g. BSc in Mathematics, University of Dhaka"
                                            className="min-h-[100px] resize-none"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full h-11"
                                    >
                                        Next Step <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">
                                            Subjects You Teach * ({subjects.length} selected)
                                        </Label>
                                        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            {SUBJECT_OPTIONS.map(subject => (
                                                <button
                                                    key={subject}
                                                    type="button"
                                                    onClick={() => toggleSubject(subject)}
                                                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                                        subjects.includes(subject)
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    {subject}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700">Expected Salary</Label>
                                            <Input
                                                value={expectedSalary}
                                                onChange={(e) => setExpectedSalary(e.target.value)}
                                                type="number"
                                                placeholder="5000"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700">Location *</Label>
                                            <Input
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g. Dhanmondi, Dhaka"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="h-11 px-5"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 h-11"
                                        >
                                            {submitting ? 'Creating Profile...' : 'Create Tutor Profile'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BecomeTutor;