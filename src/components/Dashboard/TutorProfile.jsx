import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    ShieldCheck, 
    RefreshCw,
    Camera,
    Phone,
    GraduationCap,
    BookOpen,
    Calendar,
    DollarSign,
    MapPin,
    Save
} from "lucide-react";
import { 
    AppleCard, 
    AppleButton, 
    AppleBadge, 
    AppleHeader 
} from '../shared/AppleUI';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

const SUBJECT_OPTIONS = [
    'Mathematics', 'English', 'Bangla', 'Physics', 'Chemistry', 
    'Biology', 'Higher Math', 'General Science', 'ICT', 
    'Accounting', 'Finance', 'Economics', 'History', 'Geography'
];

const TutorProfile = () => {
    const { user, dbUser, loading: authLoading, refreshUserFromDB } = useAuth();
    const [loading, setLoading] = useState(false);
    const [mobileInput, setMobileInput] = useState('');
    const [qualification, setQualification] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [expectedSalary, setExpectedSalary] = useState('');
    const [location, setLocation] = useState('');
    const [photoInput, setPhotoInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    useEffect(() => {
        if (dbUser) {
            setNameInput(dbUser.displayName || user?.displayName || '');
            setPhotoInput(dbUser.photoURL || user?.photoURL || '');
            setMobileInput(dbUser.mobileNumber || '');
            setQualification(dbUser.qualification || '');
            setSubjects(dbUser.subjects || []);
            setExpectedSalary(dbUser.expectedSalary || '');
            setLocation(dbUser.location || '');
        }
    }, [dbUser, user]);

    const toggleSubject = (subject) => {
        setSubjects(prev => 
            prev.includes(subject) 
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleSave = async () => {
        if (nameInput.length < 3) {
            toast.error('Name must be at least 3 characters');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                displayName: nameInput,
                photoURL: photoInput,
                mobileNumber: mobileInput,
                qualification,
                subjects,
                expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
                location
            };

            await api.patch(`/api/users/by-email/${user?.email}`, updateData);
            toast.success('Profile updated successfully');
            await refreshUserFromDB(user?.email);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <LoadingSpinner />;

    return (
        <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
            <AppleHeader 
                title="Tutor Profile" 
                subtitle="Manage your professional tutoring profile and qualifications."
                badge={<AppleBadge variant="primary">Specialist Account</AppleBadge>}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Photo & Basic Info */}
                <div className="lg:col-span-4">
                    <AppleCard className="p-8 flex flex-col items-center text-center space-y-6" hover={false}>
                        <div className="relative group">
                            <Avatar className="h-36 w-36 rounded-[2rem] border-4 border-background shadow-apple-md overflow-hidden bg-muted transition-all duration-500 group-hover:scale-105">
                                <AvatarImage 
                                    src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                                    {nameInput?.charAt(0) || 'T'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-xl text-foreground tracking-tight">{nameInput || 'Tutor'}</h3>
                            <p className="text-xs font-medium text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {subjects.slice(0, 4).map(sub => (
                                <span key={sub} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary">
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </AppleCard>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Basic Info */}
                    <AppleCard className="p-8" hover={false}>
                        <h3 className="text-lg font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-primary" size={20} />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text"
                                    className="w-full bg-muted/50 border-none ring-1 ring-border/50 px-4 py-3 rounded-xl text-sm font-medium"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                    type="tel"
                                    className="w-full bg-muted/50 border-none ring-1 ring-border/50 px-4 py-3 rounded-xl text-sm font-medium"
                                    value={mobileInput}
                                    onChange={(e) => setMobileInput(e.target.value)}
                                    placeholder="01700000000"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Profile Photo URL</label>
                                <input 
                                    type="url"
                                    className="w-full bg-muted/50 border-none ring-1 ring-border/50 px-4 py-3 rounded-xl text-sm font-medium"
                                    value={photoInput}
                                    onChange={(e) => setPhotoInput(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Location</label>
                                <input 
                                    type="text"
                                    className="w-full bg-muted/50 border-none ring-1 ring-border/50 px-4 py-3 rounded-xl text-sm font-medium"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Dhanmondi, Dhaka"
                                />
                            </div>
                        </div>
                    </AppleCard>

                    {/* Professional Info */}
                    <AppleCard className="p-8" hover={false}>
                        <h3 className="text-lg font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
                            <GraduationCap className="text-primary" size={20} />
                            Professional Details
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Qualification</label>
                                <input 
                                    type="text"
                                    className="w-full bg-muted/50 border-none ring-1 ring-border/50 px-4 py-3 rounded-xl text-sm font-medium"
                                    value={qualification}
                                    onChange={(e) => setQualification(e.target.value)}
                                    placeholder="e.g. B.Sc in Engineering, HSC with GPA 5"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Subjects You Can Teach</label>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECT_OPTIONS.map(subject => (
                                        <button
                                            key={subject}
                                            type="button"
                                            onClick={() => toggleSubject(subject)}
                                            className={cn(
                                                "px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200",
                                                subjects.includes(subject)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/30 border-border/50 hover:border-primary/50 hover:bg-muted/50"
                                            )}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Expected Monthly Salary (BDT)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input 
                                            type="number"
                                            className="w-full bg-muted/50 border-none ring-1 ring-border/50 pl-10 pr-4 py-3 rounded-xl text-sm font-medium"
                                            value={expectedSalary}
                                            onChange={(e) => setExpectedSalary(e.target.value)}
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AppleCard>

                    {/* Save Button */}
                    <AppleButton 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full h-14 rounded-xl shadow-apple-md"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Profile
                            </>
                        )}
                    </AppleButton>
                </div>
            </div>
        </div>
    );
};

export default TutorProfile;