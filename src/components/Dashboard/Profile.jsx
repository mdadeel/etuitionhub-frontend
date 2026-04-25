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
        <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-20 px-6 lg:px-0">
            <AppleHeader 
                title="Identity" 
                subtitle="High-fidelity account orchestration and personal metadata management."
                badge={<span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary">Account Protocol</span>}
                action={
                    <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-2xl border border-border/50">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Clearance</span>
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-green-500/10 text-green-600">
                            {dbUser?.role?.toUpperCase() || 'USER'}
                        </span>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Photo Section */}
                <div className="lg:col-span-4">
                    <AppleCard className="p-10 flex flex-col items-center text-center space-y-8" hover={false}>
                        <div className="relative group">
                            <Avatar className="h-44 w-44 rounded-[2.5rem] border-4 border-background shadow-apple-md overflow-hidden bg-muted transition-all duration-500 group-hover:scale-105">
                                <AvatarImage 
                                    src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                                    {user?.displayName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-1 w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-apple-md border border-border/50 cursor-pointer hover:scale-110 transition-transform">
                                <Camera size={20} className="text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-xl text-foreground tracking-tight">{nameInput || 'Guest User'}</h3>
                            <p className="text-xs font-medium text-muted-foreground">{user?.email}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-bold uppercase tracking-widest italic">
                            Verified Encryption Active
                        </p>
                    </AppleCard>
                </div>

                {/* Edit Form Section */}
                <div className="lg:col-span-8">
                    <AppleCard className="p-10" hover={false}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AppleInput 
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                />
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Stream</label>
                                    <div className="relative">
                                        <input 
                                            type="email"
                                            className="w-full bg-muted/30 border-none ring-1 ring-border/50 px-4 py-4 rounded-2xl text-xs font-bold text-muted-foreground/60 cursor-not-allowed italic"
                                            value={user?.email || ''}
                                            readOnly
                                        />
                                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-30" />
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Profile Image</label>
                                    <div className="relative">
                                        <input 
                                            type="url"
                                            className="w-full bg-muted/30 border-none ring-1 ring-border/50 px-4 py-4 rounded-2xl text-xs font-medium text-muted-foreground"
                                            value={photoInput}
                                            onChange={(e) => setPhotoInput(e.target.value)}
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        <Camera className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest ml-1">Enter image URL</p>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time sync active</span>
                                </div>
                                <AppleButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto h-14 min-w-[220px] shadow-apple-md"
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
                        <AppleCard className="p-8 bg-primary/5 border-primary/10" hover={false}>
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground tracking-tight">Encryption Standards</h4>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
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
