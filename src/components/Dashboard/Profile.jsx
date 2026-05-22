import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { 
    ShieldCheck, 
    RefreshCw,
    Camera,
    Phone
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, Button } from '../ui';
import ImportantMails from './ImportantMails';

const Profile = () => {
    const { user, dbUser, refreshUserFromDB, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const { handleSubmit } = useForm();

    const [photoInput, setPhotoInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');

    useEffect(() => {
        if (dbUser?.displayName || user?.displayName) {
            setNameInput(dbUser?.displayName || user?.displayName);
        }
        if (dbUser?.photoURL || user?.photoURL) {
            setPhotoInput(dbUser?.photoURL || user?.photoURL);
        }
        if (dbUser?.mobileNumber) {
            setMobileInput(dbUser.mobileNumber);
        }
    }, [dbUser, user]);

    const onSubmit = async () => {
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

            toast.success('Profile updated successfully');
            await refreshUserFromDB(user?.email);
            await updateUserProfile({ displayName: nameInput, photoURL: photoInput });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
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
                        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Account Settings</h1>
                        <p className="text-sm text-[#5B6475] mt-1">Manage your personal information and profile details.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-none bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
                            {dbUser?.role?.charAt(0).toUpperCase() + dbUser?.role?.slice(1) || 'User'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Photo Section */}
                <div className="lg:col-span-4">
                    <Card className="p-8 md:p-10 flex flex-col items-center text-center space-y-6 md:space-y-8" hover={false}>
                        <div className="relative group">
                            <Avatar className="h-32 w-32 md:h-44 md:w-44 rounded-none border border-[rgba(15,23,46,0.12)] shadow-none overflow-hidden bg-slate-950 transition-all duration-500 group-hover:scale-105">
                                <AvatarImage 
                                    src={photoInput} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
                            </Avatar>
                            <div className="absolute bottom-1 right-1 w-12 h-12 bg-white rounded-none flex items-center justify-center shadow-lg border border-[rgba(15,23,46,0.08)] cursor-pointer hover:scale-110 transition-transform text-[#5B6475] hover:text-[#2563EB]">
                                <Camera size={20} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-xl text-[#111827] tracking-tight">{nameInput || 'Guest User'}</h3>
                            <p className="text-xs text-[#5B6475]">{user?.email}</p>
                        </div>
                    </Card>
                </div>

                {/* Edit Form Section */}
                <div className="lg:col-span-8">
                    <Card className="p-8 md:p-12" hover={false}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-[#5B6475] ml-1">Full Name</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)] px-4 py-3.5 rounded-none text-sm font-medium text-[#111827] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-[#5B6475] ml-1">Email</label>
                                    <div className="relative group">
                                        <input 
                                            type="email"
                                            className="w-full bg-[#EEF2F6] border border-[rgba(15,23,46,0.08)] px-4 py-3.5 rounded-none text-xs font-medium text-[#5B6475] cursor-not-allowed transition-all"
                                            value={user?.email || ''}
                                            readOnly
                                        />
                                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB] opacity-30" />
                                    </div>
                                    <p className="text-xs text-[#5B6475]/50 ml-1">Email cannot be changed.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-[#5B6475] ml-1">Phone Number</label>
                                    <input 
                                        type="tel"
                                        className="w-full bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)] px-4 py-3.5 rounded-none text-sm font-medium text-[#111827] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40"
                                        value={mobileInput}
                                        onChange={(e) => setMobileInput(e.target.value)}
                                        placeholder="e.g. 01700000000"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-[#5B6475] ml-1">Profile Image URL</label>
                                    <div className="relative group">
                                        <input 
                                            type="url"
                                            className="w-full bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)] px-4 py-3.5 rounded-none text-sm font-medium text-[#111827] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40"
                                            value={photoInput}
                                            onChange={(e) => setPhotoInput(e.target.value)}
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        <Camera className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6475]/40 group-focus-within:text-[#2563EB] transition-colors" />
                                    </div>
                                    <p className="text-xs text-[#5B6475]/50 ml-1">Enter a direct image URL.</p>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[rgba(15,23,46,0.08)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-xs text-[#5B6475]">Changes sync automatically</span>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto h-12 min-w-[200px] text-sm font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
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
                                <div className="w-10 h-10 rounded-none bg-white flex items-center justify-center shrink-0 shadow-sm border border-[rgba(15,23,46,0.08)]">
                                    <ShieldCheck className="text-[#2563EB]" size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#111827]">Account Security</h4>
                                    <p className="text-xs text-[#5B6475] mt-1.5 leading-relaxed">
                                        Your account is protected by industry-standard encryption. 
                                        Keep your information accurate to ensure seamless verification.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Important Mails Section */}
            <div className="mt-10">
                <ImportantMails />
            </div>
        </div>
    );
};

export default Profile;
