import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    User, 
    ShieldCheck, 
    Link as LinkIcon, 
    RefreshCw,
    Edit3,
    Camera
} from "lucide-react";
import { 
    AppleCard, 
    AppleButton, 
    AppleInput, 
    AppleBadge, 
    AppleHeader 
} from '../shared/AppleUI';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
    const { user, dbUser, loading: authLoading, refreshUserFromDB, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const { handleSubmit } = useForm();

    const [photoInput, setPhotoInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    useEffect(() => {
        if (dbUser?.displayName || user?.displayName) {
            setNameInput(dbUser?.displayName || user?.displayName);
        }
        if (dbUser?.photoURL || user?.photoURL) {
            setPhotoInput(dbUser?.photoURL || user?.photoURL);
        }
    }, [dbUser, user]);

    if (authLoading) return <LoadingSpinner />;

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
                photoURL: photoInput
            });

            toast.success('Your profile has been updated');
            await refreshUserFromDB(user?.email);
            updateUserProfile({ displayName: nameInput, photoURL: photoInput });
        } catch (error) {
            toast.error('Something went wrong while saving');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
            <AppleHeader 
                title="Your Profile" 
                subtitle="Manage your personal details and account settings here."
                badge={<AppleBadge variant="primary">Account Settings</AppleBadge>}
                action={
                    <div className="flex items-center gap-3 bg-black/[0.03] dark:bg-white/[0.05] px-4 py-2 rounded-2xl border border-black/[0.05] dark:border-white/[0.05]">
                        <span className="text-xs font-semibold text-black/50 dark:text-white/50">Your Role</span>
                        <AppleBadge variant="success" className="bg-green-500 text-white border-none">
                            {dbUser?.role || 'User'}
                        </AppleBadge>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Profile Photo Section */}
                <div className="lg:col-span-4">
                    <AppleCard className="p-8 flex flex-col items-center text-center space-y-6">
                        <div className="relative group">
                            <Avatar className="h-40 w-40 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                <AvatarImage 
                                    src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <AvatarFallback className="text-4xl font-bold bg-zinc-200 dark:bg-zinc-700">
                                    {user?.displayName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-black/5 cursor-pointer hover:scale-110 transition-transform">
                                <Camera size={18} className="text-black/70 dark:text-white/70" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{nameInput || 'Guest User'}</h3>
                            <p className="text-sm text-black/50 dark:text-white/50 mt-1">{user?.email}</p>
                        </div>
                        <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed italic">
                            This is how you appear to others in the community.
                        </p>
                    </AppleCard>
                </div>

                {/* Edit Form Section */}
                <div className="lg:col-span-8">
                    <AppleCard className="p-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AppleInput 
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/50 dark:text-white/50 ml-1">Email Address</label>
                                    <div className="relative">
                                        <input 
                                            type="email"
                                            className="w-full bg-black/[0.02] dark:bg-white/[0.02] border-none ring-1 ring-black/[0.05] dark:ring-white/[0.05] px-4 py-3 rounded-xl text-sm text-black/40 dark:text-white/40 cursor-not-allowed italic"
                                            value={user?.email || ''}
                                            readOnly
                                        />
                                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                                    </div>
                                    <p className="text-[10px] text-black/30 dark:text-white/30 ml-1">Your email cannot be changed.</p>
                                </div>
                            </div>

                            <AppleInput 
                                label="Profile Picture URL"
                                placeholder="https://example.com/photo.jpg"
                                value={photoInput}
                                onChange={(e) => setPhotoInput(e.target.value)}
                            />

                            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-black/[0.05] dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[11px] font-medium text-black/40 dark:text-white/40">Your changes will be saved instantly.</span>
                                </div>
                                <AppleButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto min-w-[200px]"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </AppleButton>
                            </div>
                        </form>
                    </AppleCard>

                    {/* Security Tip */}
                    <div className="mt-8">
                        <AppleCard className="p-6 bg-blue-500/[0.03] border-blue-500/10" hover={false}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Security Recommendation</h4>
                                    <p className="text-xs text-blue-800/60 dark:text-blue-200/60 mt-1">
                                        Keep your profile information accurate to ensure smooth communication with tutors and students. 
                                        Your account is protected by industry-standard encryption.
                                    </p>
                                </div>
                            </div>
                        </AppleCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
