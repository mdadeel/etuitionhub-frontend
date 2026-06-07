import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
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
    Save,
    Wallet,
    Briefcase,
    Star,
    User,
    Compass
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImportantMails from './ImportantMails';
import { cn } from '@/lib/utils';
import {
    BANGLADESH_DIVISIONS,
    GENDER_OPTIONS,
    LANGUAGE_OPTIONS,
    WEEK_DAYS,
    SUBJECT_OPTIONS
} from '../../utils/constants';

const Profile = () => {
    const { user, dbUser, refreshUserFromDB, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('account');
    const fileInputRef = useRef(null);

    // Form states
    const [photoInput, setPhotoInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');
    
    // Tutor specific states
    const [qualification, setQualification] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [expectedSalary, setExpectedSalary] = useState('');
    const [location, setLocation] = useState('');
    const [gender, setGender] = useState('');
    const [languagePreference, setLanguagePreference] = useState('both');
    const [availableDays, setAvailableDays] = useState([]);
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState('');

    const isTutor = dbUser?.role?.toLowerCase() === 'tutor';

    useEffect(() => {
        if (dbUser || user) {
            setNameInput(dbUser?.displayName || user?.displayName || '');
            setPhotoInput(dbUser?.photoURL || user?.photoURL || '');
            setMobileInput(dbUser?.mobileNumber || '');
            
            if (isTutor) {
                setQualification(dbUser.qualification || '');
                setSubjects(dbUser.subjects || []);
                setExpectedSalary(dbUser.expectedSalary || '');
                setLocation(dbUser.location || '');
                setGender(dbUser.gender || '');
                setLanguagePreference(dbUser.languagePreference || 'both');
                setAvailableDays(dbUser.availableDays || []);
                setBio(dbUser.bio || '');
                setExperience(dbUser.experience || '');
            }
        }
    }, [dbUser, user, isTutor]);

    const toggleDay = (day) => {
        setAvailableDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const toggleSubject = (subject) => {
        setSubjects((prev) =>
            prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
        );
    };

    const onSubmitAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (nameInput.length < 3) {
            toast.error('Please use a name with at least 3 characters');
            setLoading(false);
            return;
        }

        try {
            await api.patch(`/api/users/by-email/${user?.email}`, {
                displayName: nameInput,
                photoURL: photoInput,
                mobileNumber: mobileInput
            });

            toast.success('Account profile updated successfully');
            await refreshUserFromDB(user?.email);
            await updateUserProfile({ displayName: nameInput, photoURL: photoInput });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const onSubmitTutor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                displayName: nameInput,
                photoURL: photoInput,
                mobileNumber: mobileInput,
                qualification,
                subjects,
                expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
                location,
                gender,
                languagePreference,
                availableDays,
                bio,
                experience,
            };

            await api.patch(`/api/users/by-email/${user?.email}`, updateData);
            toast.success('Tutor professional profile updated successfully');
            await refreshUserFromDB(user?.email);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update professional profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-20 px-4 md:px-6 lg:px-0">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account Settings</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your personal information and profile details.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-none bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
                            {dbUser?.role?.charAt(0).toUpperCase() + dbUser?.role?.slice(1) || 'User'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tutor Profile Toggle Tabs */}
            {isTutor && (
                <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-none border border-border/40 w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-all duration-300 rounded-none whitespace-nowrap",
                            activeTab === 'account'
                                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <User size={14} className={activeTab === 'account' ? "text-primary" : "opacity-60"} />
                        Account Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('tutor')}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-all duration-300 rounded-none whitespace-nowrap",
                            activeTab === 'tutor'
                                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <GraduationCap size={14} className={activeTab === 'tutor' ? "text-primary" : "opacity-60"} />
                        Professional Tutor Profile
                    </button>
                </div>
            )}

            {activeTab === 'account' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Profile Photo Section */}
                    <div className="lg:col-span-4">
                        <Card className="p-8 md:p-10 flex flex-col items-center text-center space-y-6 md:space-y-8" hover={false}>
                            <div className="relative group">
                                <Avatar className="size-32 md:h-44 md:w-44 rounded-none border border-border shadow-none overflow-hidden bg-slate-950 transition-all duration-500 group-hover:scale-105">
                                    <AvatarImage 
                                        src={photoInput} 
                                        alt={nameInput || user?.displayName}
                                        gender={dbUser?.gender}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
                                </Avatar>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        try {
                                            const res = await api.post('/api/upload', formData);
                                            setPhotoInput(res.data.url);
                                            toast.success('Photo uploaded');
                                        } catch {
                                            toast.error('Upload failed');
                                        }
                                    }}
                                />
                                <div
                                    className="absolute bottom-1 right-1 size-12 bg-card rounded-none flex items-center justify-center shadow-lg border border-border cursor-pointer hover:scale-110 transition-transform text-muted-foreground hover:text-[#2563EB]"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera size={20} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-foreground tracking-tight">{nameInput || 'Guest User'}</h3>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Edit Form Section */}
                    <div className="lg:col-span-8">
                        <Card className="p-8 md:p-12" hover={false}>
                            <form onSubmit={onSubmitAccount} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-heading font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-background border border-border px-4 py-3.5 rounded-none text-xs font-semibold text-foreground transition-all focus:outline-none focus:ring-0 focus:border-[#2563EB]"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-heading font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                        <div className="relative group">
                                            <input 
                                                type="email"
                                                className="w-full bg-muted border border-border px-4 py-3.5 rounded-none text-xs font-semibold text-muted-foreground cursor-not-allowed transition-all"
                                                value={user?.email || ''}
                                                readOnly
                                            />
                                            <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#2563EB] opacity-30" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground/50 ml-1">Email cannot be changed.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-heading font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                        <input 
                                            type="tel"
                                            className="w-full bg-background border border-border px-4 py-3.5 rounded-none text-xs font-semibold text-foreground transition-all focus:outline-none focus:ring-0 focus:border-[#2563EB]"
                                            value={mobileInput}
                                            onChange={(e) => setMobileInput(e.target.value)}
                                            placeholder="e.g. 01700000000"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-heading font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Image URL</label>
                                        <div className="relative group">
                                            <input 
                                                type="url"
                                                className="w-full bg-background border border-border px-4 py-3.5 rounded-none text-xs font-semibold text-foreground transition-all focus:outline-none focus:ring-0 focus:border-[#2563EB]"
                                                value={photoInput}
                                                onChange={(e) => setPhotoInput(e.target.value)}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                            <Camera className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-[#2563EB] transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-xs text-muted-foreground">Changes sync automatically</span>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto h-12 min-w-[200px] text-xs font-bold rounded-none"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="size-4 animate-spin mr-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        {/* Security Tip */}
                        <div className="mt-8">
                            <Card className="p-6 bg-[#2563EB]/5 border border-[#2563EB]/10" hover={false}>
                                <div className="flex items-start gap-4">
                                    <div className="size-10 rounded-none bg-card flex items-center justify-center shrink-0 shadow-sm border border-border">
                                        <ShieldCheck className="text-[#2563EB]" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">Account Security</h4>
                                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                            Your account is protected by industry-standard encryption. 
                                            Keep your information accurate to ensure seamless verification.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                // Tutor professional profile form
                <form onSubmit={onSubmitTutor} className="space-y-8">
                    {/* Tutor Overview Card */}
                    <div className="bg-card border border-border rounded-none shadow-none">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                            {/* Left: Avatar */}
                            <div className="relative shrink-0 mx-auto md:mx-0">
                                <div className="size-48 md:w-56 md:h-56 rounded-none overflow-hidden border border-border bg-slate-950">
                                    <img
                                        src={photoInput || "https://i.ibb.co/4pDNDk1/default-avatar.png"}
                                        className="size-full object-cover"
                                        alt="Profile Preview"
                                    />
                                </div>
                            </div>

                            {/* Right: Summary */}
                            <div className="flex-1 flex flex-col justify-center space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted text-muted-foreground rounded-none text-[9px] font-black uppercase tracking-widest border border-border">
                                        <MapPin size={10} />
                                        {location || "Location not set"}
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
                                    {nameInput || "Tutor Name"}
                                </h2>

                                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-tight">
                                    <GraduationCap className="text-blue-600" size={18} />
                                    <span className="text-xs">
                                        {qualification || "Qualifications not specified"}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-muted-foreground text-xs font-bold leading-relaxed max-w-2xl italic uppercase tracking-tight">
                                        "{bio || 'No bio added yet'}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Strip */}
                        <div className="bg-background border-t border-border px-6 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-none bg-muted border border-border flex items-center justify-center text-foreground">
                                    <Wallet size={16} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Monthly Fee
                                    </p>
                                    <p className="text-lg font-black text-foreground tracking-tighter">
                                        ৳{parseInt(expectedSalary || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-none bg-muted border border-border flex items-center justify-center text-foreground">
                                    <Briefcase size={16} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Experience
                                    </p>
                                    <p className="text-lg font-black text-foreground tracking-tighter">
                                        {experience || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 col-span-2">
                                <div className="size-10 rounded-none bg-muted border border-border flex items-center justify-center text-foreground">
                                    <Star size={16} className="fill-blue-600 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Rating
                                    </p>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-lg font-black text-foreground tracking-tighter">
                                            4.9
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-bold">
                                            (128 reviews)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form Fields */}
                    <div className="space-y-6">
                        {/* Profile Info */}
                        <div className="p-8 bg-card border border-border rounded-none shadow-none">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
                                <ShieldCheck className="text-blue-600" size={16} />
                                Basic Tutor Contact Info
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        value={mobileInput}
                                        onChange={(e) => setMobileInput(e.target.value)}
                                        placeholder="01700000000"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Profile Photo URL
                                    </label>
                                    <input
                                        type="url"
                                        className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        value={photoInput}
                                        onChange={(e) => setPhotoInput(e.target.value)}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Division
                                    </label>
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full h-11 bg-background border border-border px-4 text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                    >
                                        <option value="">Select division</option>
                                        {BANGLADESH_DIVISIONS.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="p-8 bg-card border border-border rounded-none shadow-none">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
                                <GraduationCap className="text-blue-600" size={16} />
                                Academic & Teaching Details
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Qualification
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        value={qualification}
                                        onChange={(e) => setQualification(e.target.value)}
                                        placeholder="e.g. B.Sc in Engineering, HSC with GPA 5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Experience Details
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full h-11 bg-background border border-border px-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="e.g. 3 years teaching HSC Physics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Short Bio
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-background border border-border px-4 py-3 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all resize-none"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Describe your teaching methodology and style..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Subjects You Can Teach
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {SUBJECT_OPTIONS.map((subject) => (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => toggleSubject(subject)}
                                                className={cn(
                                                    "px-4 py-2 text-[10px] font-black rounded-none border transition-all uppercase tracking-widest",
                                                    subjects.includes(subject)
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-background border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                                                )}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        Available Days
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {WEEK_DAYS.map((day) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={cn(
                                                    "px-4 py-2 text-[10px] font-black rounded-none border transition-all uppercase tracking-widest",
                                                    availableDays.includes(day)
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-background border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                                                )}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                            Gender
                                        </label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full h-11 bg-background border border-border px-4 text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        >
                                            <option value="">Select gender</option>
                                            {GENDER_OPTIONS.map((g) => (
                                                <option key={g} value={g}>
                                                    {g}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                            Language Preference
                                        </label>
                                        <select
                                            value={languagePreference}
                                            onChange={(e) => setLanguagePreference(e.target.value)}
                                            className="w-full h-11 bg-background border border-border px-4 text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                        >
                                            {LANGUAGE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                            Expected Monthly Salary (BDT)
                                        </label>
                                        <div className="relative">
                                            <DollarSign
                                                size={14}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            />
                                            <input
                                                type="number"
                                                className="w-full h-11 bg-background border border-border pl-11 pr-4 rounded-none text-xs font-bold text-foreground focus:border-blue-600 outline-none transition-all"
                                                value={expectedSalary}
                                                onChange={(e) => setExpectedSalary(e.target.value)}
                                                placeholder="5000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-blue-600 hover:bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-none transition-all shadow-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Save Tutor Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Account Settings sub-components (like ImportantMails) should always display at the bottom of the Account tab */}
            {activeTab === 'account' && (
                <div className="mt-10">
                    <ImportantMails />
                </div>
            )}
        </div>
    );
};

export default Profile;
