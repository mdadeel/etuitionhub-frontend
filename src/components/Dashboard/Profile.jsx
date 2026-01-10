// Profile Settings - user er profile edit korte parbe
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

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
        <div className="fade-up space-y-12 max-w-5xl">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-600">Identity Architecture</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Security & Profile</h1>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mt-3">Node Identity Management // {user?.email}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100/50 shadow-sm shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">System Permission</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-teal-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">{dbUser?.role || 'Client Access'}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Visual Identity Section */}
                <div className="lg:col-span-1 border-r border-gray-100 lg:pr-12">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-1 h-3 bg-teal-500 rounded-full"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Visual Identity</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative group p-2 rounded-3xl border-2 border-dashed border-gray-100 hover:border-teal-500/30 transition-all duration-500">
                            <div className="w-40 h-40 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-teal-500/10 transition-all duration-500">
                                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50">
                                    <img
                                        src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt="Identity"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                        onError={(e) => { e.target.src = 'https://i.ibb.co/4pDNDk1/default-avatar.png' }}
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-600 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                            </div>
                        </div>
                        <p className="mt-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center leading-relaxed max-w-[200px]">
                            Primary identity node identification. Asset synchronization active.
                        </p>
                    </div>
                </div>

                {/* Parameters Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-1 h-3 bg-teal-500 rounded-full"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Configuration Parameters</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Display Identity</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full h-14 px-5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        placeholder="Legal name or alias"
                                    />
                                </div>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1 ml-1">Visible across protocol transactions.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">System Key (Email)</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed italic"
                                        value={user?.email || ''}
                                        readOnly
                                    />
                                </div>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1 ml-1">Immutable session identifier.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Asset Pointer (Photo Direct URL)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full h-14 px-5 bg-white border border-gray-100 rounded-xl text-xs font-mono font-bold text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
                                    value={photoInput}
                                    onChange={(e) => setPhotoInput(e.target.value)}
                                    placeholder="https://cloud.storage/portrait.jpg"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103" /></svg>
                                </div>
                            </div>
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1 ml-1">Secure external linkage for identity assets.</p>
                        </div>

                        <div className="pt-10 flex items-center justify-between border-t border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="relative h-2 w-2">
                                    <div className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-20"></div>
                                    <div className="relative h-2 w-2 bg-teal-500 rounded-full"></div>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Sync Pipeline Available</span>
                            </div>
                            <button
                                type="submit"
                                className="px-10 h-14 bg-teal-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Synchronizing Node...' : 'Update Identity Protocol'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Section */}
            <div className="mt-12 group">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-3 bg-teal-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Security Architecture</h3>
                </div>

                <div className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 text-center md:text-left">
                            <div className="w-14 h-14 rounded-2xl bg-teal-50/50 flex items-center justify-center text-teal-600 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Authentication Integrity</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 leading-relaxed">Secured via multi-factor system protocols. Credentials are encrypted.</p>
                            </div>
                        </div>
                        <button className="px-8 h-12 bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-xl hover:bg-white hover:text-teal-600 hover:border-teal-500/30 hover:shadow-md transition-all active:scale-95">
                            Modify Protocol
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
