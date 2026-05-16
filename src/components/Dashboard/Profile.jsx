import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    ShieldCheck, 
    RefreshCw,
    Camera,
    Phone
} from "lucide-react";
import { 
    AppleCard, 
    AppleButton, 
    AppleInput, 
    AppleHeader 
} from '../shared/AppleUI';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
    const { user, dbUser, loading: authLoading, refreshUserFromDB, updateUserProfile } = useAuth();
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
            <AppleHeader 
                title="Account Identity" 
                subtitle="High-fidelity account orchestration and personal metadata management."
                badge={<span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-blue-600/10 text-blue-600 border border-blue-500/20">Identity Protocol</span>}
                action={
                    <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-2xl border border-border/60 shadow-sm">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Clearance</span>
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-600/10 text-emerald-600 border border-emerald-500/20">
                            {dbUser?.role?.toUpperCase() || 'USER'}
                        </span>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Photo Section */}
                <div className="lg:col-span-4">
                    <AppleCard className="p-8 md:p-10 flex flex-col items-center text-center space-y-6 md:space-y-8 bg-card border border-border/60 rounded-3xl shadow-xl" hover={false}>
                        <div className="relative group">
                            <Avatar className="h-32 w-32 md:h-44 md:w-44 rounded-3xl md:rounded-[2.5rem] border-4 border-card shadow-xl overflow-hidden bg-muted transition-all duration-500 group-hover:scale-105">
                                <AvatarImage 
                                    src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground/40">
                                    {user?.displayName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-1 w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-lg border border-border/60 cursor-pointer hover:scale-110 transition-transform text-muted-foreground/60 hover:text-blue-600">
                                <Camera size={20} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-extrabold text-xl text-foreground tracking-tight">{nameInput || 'Guest User'}</h3>
                            <p className="text-xs font-medium text-muted-foreground/60 tracking-wide">{user?.email}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground/40 leading-relaxed font-bold uppercase tracking-[0.2em] italic">
                            Verified Encryption Active
                        </p>
                    </AppleCard>
                </div>

                {/* Edit Form Section */}
                <div className="lg:col-span-8">
                    <AppleCard className="p-8 md:p-12 bg-card border border-border/60 rounded-3xl shadow-xl" hover={false}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AppleInput 
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                />
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Email Stream</label>
                                    <div className="relative group">
                                        <input 
                                            type="email"
                                            className="w-full bg-muted/30 border border-border/60 px-4 py-4 rounded-2xl text-xs font-bold text-muted-foreground/40 cursor-not-allowed italic transition-all focus:ring-0"
                                            value={user?.email || ''}
                                            readOnly
                                        />
                                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 opacity-20" />
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest ml-1">Immutable parameter.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AppleInput 
                                    label="Phone Number"
                                    placeholder="e.g. 01700000000"
                                    value={mobileInput}
                                    onChange={(e) => setMobileInput(e.target.value)}
                                />
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Profile Image</label>
                                    <div className="relative group">
                                        <input 
                                            type="url"
                                            className="w-full bg-muted/30 border border-border/60 px-4 py-4 rounded-2xl text-xs font-medium text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20"
                                            value={photoInput}
                                            onChange={(e) => setPhotoInput(e.target.value)}
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        <Camera className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest ml-1">Enter high-fidelity image URL.</p>
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">Real-time synchronization active</span>
                                </div>
                                <AppleButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto h-14 min-w-[240px] shadow-xl bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px]"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin mr-3" />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        'Commit Changes'
                                    )}
                                </AppleButton>
                            </div>
                        </form>
                    </AppleCard>

                    {/* Security Tip */}
                    <div className="mt-10">
                        <AppleCard className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-3xl" hover={false}>
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center shrink-0 shadow-sm border border-border/60">
                                    <ShieldCheck className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground tracking-tight">Encryption Standards</h4>
                                    <p className="text-xs text-muted-foreground/60 mt-2 leading-relaxed font-medium">
                                        Your account is protected by industry-standard encryption protocols. 
                                        Keep your metadata accurate to ensure seamless verification within the marketplace.
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
