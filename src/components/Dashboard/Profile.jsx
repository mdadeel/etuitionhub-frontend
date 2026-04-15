import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
    User, 
    ShieldCheck, 
    Database, 
    Link as LinkIcon, 
    Activity, 
    Zap,
    RefreshCw,
    Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Profile Settings Component
 * Refactored to "Technical Emerald Minimalism"
 */
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
            toast.error('Identity Error: Name must exceed 3 characters');
            setLoading(false);
            return;
        }

        try {
            await api.patch(`/api/users/by-email/${user?.email}`, {
                displayName: nameInput,
                photoURL: photoInput
            });

            toast.success('Identity parameters synchronized.');
            await refreshUserFromDB(user?.email);
            updateUserProfile({ displayName: nameInput, photoURL: photoInput });
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Synchronization failed.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 space-y-12 max-w-5xl selection:bg-primary/30 selection:text-primary">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 bg-background border-b border-border pb-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Identity Architecture</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-none">Security & Profile.</h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-6 flex items-center gap-2">
                        <Database size={12} className="text-primary" /> NODE_IDENTITY_MANAGEMENT // {user?.email}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-muted/20 px-6 py-4 rounded-none border border-border shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Permission</span>
                    <Badge variant="outline" className="rounded-none border-primary text-primary bg-background px-4 py-1.5 text-[9px] font-black uppercase tracking-widest italic shadow-sm">
                        {dbUser?.role?.toUpperCase() || 'CLIENT_ACCESS'}
                    </Badge>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Visual Identity Section */}
                <div className="lg:col-span-4 border-border lg:pr-12">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1 h-4 bg-primary"></div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Visual Identity</h3>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="relative group p-3 border-2 border-dashed border-border rounded-none transition-all duration-500 hover:border-primary/30">
                            <Avatar className="h-48 w-48 rounded-none border border-border shadow-2xl p-1 bg-background overflow-hidden group-hover:shadow-primary/10 transition-all duration-500">
                                <AvatarImage 
                                    src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                                    className="grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100 object-cover"
                                />
                                <AvatarFallback className="rounded-none text-4xl font-black bg-muted uppercase">{user?.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                                <Edit3 size={20} />
                            </div>
                        </div>
                        <p className="mt-10 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] text-center leading-loose max-w-[240px] italic">
                            Primary identity node identification. Asset synchronization active.
                        </p>
                    </div>
                </div>

                {/* Parameters Section */}
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1 h-4 bg-primary"></div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Configuration Parameters</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 bg-muted/10 p-10 border border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Activity size={120} className="text-foreground" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Display Identity</Label>
                                <Input
                                    type="text"
                                    className="h-14 rounded-none border-border bg-background font-bold focus-visible:ring-primary uppercase text-[11px] tracking-widest shadow-sm"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="LEGAL_NAME_OR_ALIAS"
                                />
                                <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest mt-2 ml-1 italic">Visible across protocol transactions.</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">System Key (Email)</Label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        className="h-14 rounded-none border-border bg-muted/50 font-bold text-muted-foreground cursor-not-allowed italic uppercase text-[11px] tracking-widest"
                                        value={user?.email || ''}
                                        readOnly
                                    />
                                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                                </div>
                                <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest mt-2 ml-1 italic">Immutable session identifier.</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Asset Pointer (Photo URL)</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    className="h-14 rounded-none border-border bg-background font-mono text-xs font-bold text-primary focus-visible:ring-primary shadow-sm pl-12"
                                    value={photoInput}
                                    onChange={(e) => setPhotoInput(e.target.value)}
                                    placeholder="HTTPS://CLOUD.STORAGE/PORTRAIT.JPG"
                                />
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            </div>
                            <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest mt-2 ml-1 italic">Secure external linkage for identity assets.</p>
                        </div>

                        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-border relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative h-2 w-2">
                                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                                    <div className="relative h-2 w-2 bg-primary"></div>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Sync Pipeline Available</span>
                            </div>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto px-12 h-16 rounded-none text-[11px] font-black uppercase tracking-[0.2em] shadow-lg group/btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin mr-3" />
                                ) : (
                                    <Zap size={16} className="mr-3 group-hover/btn:fill-current" />
                                )}
                                {loading ? 'Synchronizing Node...' : 'Update Identity Protocol'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Section */}
            <div className="mt-20 group">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-1 h-4 bg-primary"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Security Architecture</h3>
                </div>

                <div className="p-12 bg-background border border-border rounded-none shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-none -mr-24 -mt-24 rotate-45 transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8 text-center md:text-left">
                            <div className="w-16 h-16 rounded-none bg-muted/50 border border-border flex items-center justify-center text-primary shadow-inner">
                                <ShieldCheck size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="text-base font-black text-foreground uppercase tracking-tight italic">Authentication Integrity</h4>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 leading-loose max-w-md">
                                    Secured via industrial-strength system protocols. All sensitive credentials are encrypted using AES-256 standards.
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" className="h-14 px-10 rounded-none border-border text-[10px] font-black uppercase tracking-[0.3em] hover:bg-muted transition-all">
                            Modify Protocol
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
