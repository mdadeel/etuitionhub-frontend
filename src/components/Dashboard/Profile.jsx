import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { 
    Camera,
    GraduationCap,
    DollarSign,
    MapPin,
    Save,
    Wallet,
    Briefcase,
    Star,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    User,
    ShieldCheck,
    Bell,
    Check,
    RefreshCw
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RoleBadge from '@/components/shared/RoleBadge';
import PasswordStrength from '../shared/PasswordStrength';
import NotificationPreferences from './NotificationPreferences';
import { cn } from '@/lib/utils';
import {
    BANGLADESH_DIVISIONS,
    GENDER_OPTIONS,
    LANGUAGE_OPTIONS,
    WEEK_DAYS,
    SUBJECT_OPTIONS
} from '../../utils/constants';

const Profile = () => {
    const { user, dbUser, refreshUserFromDB, updateUserProfile, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'notifications'
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const isGoogleOnly = user?.providerData?.length > 0 &&
        user.providerData.every((p) => p.providerId === 'google.com');

    const fileInputRef = useRef(null);

    // Form states
    const [photoInput, setPhotoInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');
    
    // Tutor specific states
    const [qualification, setQualification] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [subjectSearch, setSubjectSearch] = useState('');
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
                setExpectedSalary(dbUser.expectedSalary ? String(dbUser.expectedSalary) : '');
                setLocation(dbUser.location || '');
                setGender(dbUser.gender || '');
                setLanguagePreference(dbUser.languagePreference || 'both');
                setAvailableDays(dbUser.availableDays || []);
                setBio(dbUser.bio || '');
                setExperience(dbUser.experience || '');
            }
        }
    }, [dbUser, user, isTutor]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setUploadingPhoto(true);
        try {
            const res = await api.post('/api/upload', formData);
            setPhotoInput(res.data.url);
            toast.success('Photo uploaded');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploadingPhoto(false);
        }
    };

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

    const onSubmitProfile = async (e) => {
        e.preventDefault();
        if (!user?.email) { toast.error('Not signed in'); return; }
        if (nameInput.trim().length < 3) {
            toast.error('Please provide a full name with at least 3 characters');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                displayName: nameInput.trim(),
                photoURL: photoInput,
                mobileNumber: mobileInput.trim(),
            };

            if (isTutor) {
                payload.qualification = qualification.trim();
                payload.subjects = subjects;
                payload.expectedSalary = expectedSalary ? parseInt(expectedSalary, 10) : undefined;
                payload.location = location;
                payload.gender = gender;
                payload.languagePreference = languagePreference;
                payload.availableDays = availableDays;
                payload.bio = bio.trim();
                payload.experience = experience.trim();
            }

            await api.patch(`/api/users/by-email/${encodeURIComponent(user.email)}`, payload);
            toast.success(isTutor ? 'Tutor profile updated successfully' : 'Account profile updated successfully');
            await refreshUserFromDB(user.email);
            await updateUserProfile({ displayName: nameInput, photoURL: photoInput });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const onSubmitPasswordChange = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            toast.error("Please enter your current password");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            toast.success("Password changed successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const filteredSubjects = SUBJECT_OPTIONS.filter(s => 
        s.toLowerCase().includes(subjectSearch.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Header / Identity Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                        {isTutor ? "Tutor Profile & Settings" : "Account Settings"}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isTutor 
                            ? "Manage your verified teaching credentials, subjects, schedule, and account security." 
                            : "Manage your personal information, contact details, and account security."
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <RoleBadge globalRole={dbUser?.globalRole} role={dbUser?.role} />
                </div>
            </div>

            {/* Segmented Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto custom-scrollbar">
                <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all shrink-0",
                        activeTab === 'profile'
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <User size={15} />
                    <span>{isTutor ? "Teaching Profile & Bio" : "Personal Profile"}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all shrink-0",
                        activeTab === 'security'
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <Lock size={15} />
                    <span>Account Security</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('notifications')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all shrink-0",
                        activeTab === 'notifications'
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                >
                    <Bell size={15} />
                    <span>Notification Preferences</span>
                </button>
            </div>

            {/* TAB 1: PROFILE & CREDENTIALS */}
            {activeTab === 'profile' && (
                <form onSubmit={onSubmitProfile} className="space-y-6">
                    {/* Compact Identity Card */}
                    <Card className="p-6 bg-card border-border" hover={false}>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group shrink-0">
                                <Avatar className="size-24 rounded-xl border border-border bg-muted overflow-hidden">
                                    <AvatarImage 
                                        src={photoInput} 
                                        alt={nameInput || user?.displayName}
                                        gender={dbUser?.gender}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-base font-bold bg-muted text-muted-foreground">
                                        {(nameInput || user?.displayName || 'U').charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                />
                                <button
                                    type="button"
                                    disabled={uploadingPhoto}
                                    className="absolute -bottom-1 -right-1 size-8 bg-card rounded-lg flex items-center justify-center shadow-md border border-border cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                    aria-label="Upload profile photo"
                                >
                                    {uploadingPhoto ? <RefreshCw className="size-3.5 animate-spin" /> : <Camera size={14} />}
                                </button>
                            </div>

                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">{nameInput || "Your Name"}</h2>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                    {isTutor && (
                                        <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 sm:pt-0">
                                            <div className="text-center sm:text-right">
                                                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Monthly Fee</p>
                                                <p className="text-base font-bold text-foreground font-mono">
                                                    ৳{parseInt(expectedSalary || 0, 10).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-center sm:text-right border-l border-border pl-4">
                                                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Rating</p>
                                                <p className="text-base font-bold text-foreground flex items-center gap-1">
                                                    <Star size={14} className="fill-primary text-primary" />
                                                    {dbUser?.ratings > 0 ? Number(dbUser.ratings).toFixed(1) : "New"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Basic Info Section */}
                    <Card className="p-6 bg-card border-border space-y-4" hover={false}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <User size={14} className="text-primary" />
                            Basic Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="Full Name"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                    value={mobileInput}
                                    onChange={(e) => setMobileInput(e.target.value)}
                                    placeholder="01700000000"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">Location / Division</label>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                >
                                    <option value="">Select division</option>
                                    {BANGLADESH_DIVISIONS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">Profile Photo URL</label>
                                <input
                                    type="url"
                                    className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                    value={photoInput}
                                    onChange={(e) => setPhotoInput(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Tutor Professional Details Section */}
                    {isTutor && (
                        <Card className="p-6 bg-card border-border space-y-5" hover={false}>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <GraduationCap size={14} className="text-primary" />
                                Professional Teaching Credentials
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Academic Qualification</label>
                                    <input
                                        type="text"
                                        className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                        value={qualification}
                                        onChange={(e) => setQualification(e.target.value)}
                                        placeholder="e.g. B.Sc in CSE (BUET), HSC GPA 5.0"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Teaching Experience</label>
                                    <input
                                        type="text"
                                        className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="e.g. 3+ years teaching HSC Science"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Expected Monthly Salary (BDT)</label>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="number"
                                            className="w-full h-10 bg-background border border-border pl-9 pr-3 rounded-lg text-xs font-medium text-foreground font-mono focus:border-primary outline-none transition-colors"
                                            value={expectedSalary}
                                            onChange={(e) => setExpectedSalary(e.target.value)}
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Language Medium</label>
                                    <select
                                        value={languagePreference}
                                        onChange={(e) => setLanguagePreference(e.target.value)}
                                        className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                    >
                                        {LANGUAGE_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full h-10 bg-background border border-border px-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors"
                                    >
                                        <option value="">Select Gender</option>
                                        {GENDER_OPTIONS.map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">Tutor Bio & Pedagogy</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-background border border-border p-3 rounded-lg text-xs font-medium text-foreground focus:border-primary outline-none transition-colors resize-none leading-relaxed"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Describe your teaching approach, background, and strengths..."
                                />
                            </div>

                            {/* Available Days */}
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                                    <span>Available Days of Week</span>
                                    <span className="text-[11px] text-muted-foreground">{availableDays.length} selected</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                    {WEEK_DAYS.map((day) => {
                                        const isSelected = availableDays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={cn(
                                                    "h-9 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                        : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                                                )}
                                            >
                                                {isSelected && <Check size={12} />}
                                                {day.slice(0, 3)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Teaching Subjects */}
                            <div className="space-y-2 pt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <label className="text-xs font-medium text-foreground">
                                        Subjects You Can Teach ({subjects.length} selected)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Filter subjects..."
                                        value={subjectSearch}
                                        onChange={(e) => setSubjectSearch(e.target.value)}
                                        className="h-8 w-44 bg-background border border-border px-2.5 rounded-md text-xs outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 border border-border/60 rounded-lg bg-muted/20 custom-scrollbar">
                                    {filteredSubjects.map((subject) => {
                                        const isSelected = subjects.includes(subject);
                                        return (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => toggleSubject(subject)}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-all flex items-center gap-1",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                                                        : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                                                )}
                                            >
                                                {isSelected && <Check size={12} />}
                                                {subject}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Bottom Save Action */}
                    <div className="flex items-center justify-end gap-4 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-11 px-6 text-xs font-bold gap-2"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="size-3.5 animate-spin" />
                                    Saving Profile...
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    Save Profile Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {/* TAB 2: ACCOUNT SECURITY */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <Card className="p-6 bg-card border-border" hover={false}>
                        <div className="flex items-start gap-4">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-foreground">Authentication & Sign-in Method</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isGoogleOnly 
                                        ? "Your account is authenticated securely via Google OAuth."
                                        : "Your account is authenticated via Email & Password."
                                    }
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground">
                                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {!isGoogleOnly ? (
                        <Card className="p-6 bg-card border-border space-y-5" hover={false}>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <KeyRound size={16} className="text-primary" />
                                    Change Account Password
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Update your login password. We recommend using a strong password with letters, numbers, and symbols.
                                </p>
                            </div>

                            <form onSubmit={onSubmitPasswordChange} className="space-y-4 max-w-lg">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPass ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            required
                                            className="w-full bg-background border border-border px-3.5 h-10 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            tabIndex={-1}
                                        >
                                            {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min. 6 chars)"
                                            required
                                            className="w-full bg-background border border-border px-3.5 h-10 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            tabIndex={-1}
                                        >
                                            {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    <PasswordStrength password={newPassword} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPass ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            required
                                            className="w-full bg-background border border-border px-3.5 h-10 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-xs text-destructive">Passwords do not match</p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={passwordLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                                        className="h-10 px-5 text-xs font-semibold"
                                    >
                                        {passwordLoading ? (
                                            <>
                                                <RefreshCw className="size-3.5 animate-spin mr-1.5" />
                                                Updating Password...
                                            </>
                                        ) : (
                                            "Update Password"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : null}
                </div>
            )}

            {/* TAB 3: NOTIFICATION PREFERENCES */}
            {activeTab === 'notifications' && (
                <div>
                    <NotificationPreferences />
                </div>
            )}
        </div>
    );
};

export default Profile;
