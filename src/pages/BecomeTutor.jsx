import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, CheckCircle, ArrowRight, Database, GraduationCap, BookOpen, MapPin, Phone, DollarSign, ShieldCheck } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <header className="mb-16 border-b border-border pb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Tutor Registration Protocol</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] mb-8">
                        Become a <br />
                        <span className="text-muted-foreground">Tutor.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground font-bold leading-relaxed max-w-2xl uppercase tracking-tight">
                        Register your expertise and start connecting with students who need your skills.
                    </p>
                </header>

                {!user ? (
                    <div className="bg-muted/30 border border-border p-12 text-center relative">
                        <Briefcase size={48} className="mx-auto mb-6 text-primary opacity-30" />
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-4">Account Required</h2>
                        <p className="text-sm text-muted-foreground font-medium mb-8 uppercase tracking-wide">
                            Create an account to register as a tutor on our platform.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button asChild variant="outline" className="rounded-none h-12 px-8 text-xs font-black uppercase tracking-widest">
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="rounded-none h-12 px-8 text-xs font-black uppercase tracking-widest">
                                <Link to="/register">Create Account</Link>
                            </Button>
                        </div>
                    </div>
                ) : isAlreadyTutor ? (
                    <div className="bg-muted/30 border border-border p-12 text-center relative">
                        <ShieldCheck size={48} className="mx-auto mb-6 text-primary" />
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-4">You're Already a Tutor</h2>
                        <p className="text-sm text-muted-foreground font-medium mb-8 uppercase tracking-wide">
                            Your tutor profile is active. Manage it from your dashboard.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button asChild className="rounded-none h-12 px-8 text-xs font-black uppercase tracking-widest">
                                <Link to="/dashboard">Go to Dashboard <ArrowRight size={16} className="ml-2" /></Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Step indicator */}
                        <div className="flex items-center gap-4 mb-12">
                            {[1, 2].map(s => (
                                <div key={s} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 flex items-center justify-center border text-xs font-black tracking-wider ${
                                        step >= s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
                                    }`}>
                                        {step > s ? <CheckCircle size={14} /> : s}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                                        step >= s ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                        {s === 1 ? 'Basic Info' : 'Expertise & Location'}
                                    </span>
                                    {s < 2 && <div className="w-12 h-px bg-border" />}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-background border border-border relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Database size={100} className="text-foreground" />
                            </div>

                            {step === 1 && (
                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <Briefcase size={12} className="text-primary" /> Full Name *
                                        </Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="YOUR_FULL_NAME"
                                            className="h-12 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary uppercase text-sm tracking-widest"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <Phone size={12} className="text-primary" /> Mobile Number
                                        </Label>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="h-12 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary text-sm"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <GraduationCap size={12} className="text-primary" /> Qualification *
                                        </Label>
                                        <Textarea
                                            value={qualification}
                                            onChange={(e) => setQualification(e.target.value)}
                                            placeholder="e.g. BSc in Mathematics, University of Dhaka"
                                            className="min-h-[100px] rounded-none border-border bg-muted/20 font-medium focus-visible:ring-primary resize-none p-5 text-sm"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full h-14 rounded-none text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                                    >
                                        Next Step <ArrowRight size={18} />
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <BookOpen size={12} className="text-primary" /> Subjects You Teach * ({subjects.length} selected)
                                        </Label>
                                        <div className="flex flex-wrap gap-2 border border-border p-4 bg-muted/20">
                                            {SUBJECT_OPTIONS.map(subject => (
                                                <button
                                                    key={subject}
                                                    type="button"
                                                    onClick={() => toggleSubject(subject)}
                                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                                                        subjects.includes(subject)
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-border text-muted-foreground hover:border-primary/50'
                                                    }`}
                                                >
                                                    {subject}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <DollarSign size={12} className="text-primary" /> Expected Salary (BDT)
                                            </Label>
                                            <Input
                                                value={expectedSalary}
                                                onChange={(e) => setExpectedSalary(e.target.value)}
                                                type="number"
                                                placeholder="5000"
                                                className="h-12 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary text-sm"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <MapPin size={12} className="text-primary" /> Location *
                                            </Label>
                                            <Input
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g. Dhanmondi, Dhaka"
                                                className="h-12 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="h-14 px-8 rounded-none text-xs font-black uppercase tracking-[0.3em]"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 h-14 rounded-none text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg"
                                        >
                                            {submitting ? 'Publishing Profile...' : 'Activate Tutor Account'}
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
