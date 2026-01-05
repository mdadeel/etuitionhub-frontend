// Profile Settings - user er profile edit korte parbe
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import API_URL from '../../config/api';
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
            const res = await fetch(`${API_URL}/api/users/by-email/${user?.email}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    displayName: nameInput,
                    photoURL: photoInput
                })
            });

            if (res.ok) {
                toast.success('Identity parameters synchronized.');
                await refreshUserFromDB(user?.email);
                updateUserProfile({ displayName: nameInput, photoURL: photoInput });
            } else {
                toast.error('Synchronization failed.');
            }
        } catch (error) {
            toast.error('Core connectivity failure.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-up max-w-4xl">
            <header className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Identity Settings</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Identity Management</h1>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-sm border border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Role</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 bg-white px-2 py-0.5 border border-gray-200 shadow-sm">{dbUser?.role || 'Client'}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Visual Identity Section */}
                <div className="lg:col-span-1 border-r border-gray-100 lg:pr-12">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 pb-4 border-b border-gray-50">Visual Identity</h3>
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-sm bg-gray-100 border border-gray-200 overflow-hidden shadow-md transition-transform group-hover:scale-[1.02]">
                                <img
                                    src={photoInput || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                    alt="Identity"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    onError={(e) => { e.target.src = 'https://i.ibb.co/4pDNDk1/default-avatar.png' }}
                                />
                            </div>
                        </div>
                        <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                            Primary identity node.<br />All visual assets are stored as remote pointers.
                        </p>
                    </div>
                </div>

                {/* Parameters Section */}
                <div className="lg:col-span-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 pb-4 border-b border-gray-50">Configuration Parameters</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Display Identity</label>
                                <input
                                    type="text"
                                    className="input-quiet w-full"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="Legal name or alias"
                                />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Visible across all system transactions.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Registered Email</label>
                                <input
                                    type="email"
                                    className="input-quiet w-full opacity-50 cursor-not-allowed bg-gray-50"
                                    value={user?.email || ''}
                                    readOnly
                                />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Fixed system key identifier.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Asset Pointer (Photo URL)</label>
                            <input
                                type="text"
                                className="input-quiet w-full font-mono text-xs"
                                value={photoInput}
                                onChange={(e) => setPhotoInput(e.target.value)}
                                placeholder="https://external-storage.com/asset.jpg"
                            />
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Provide a direct link to your professional portrait.</p>
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">System synced & ready</span>
                            </div>
                            <button
                                type="submit"
                                className="btn-quiet-primary px-8"
                                disabled={loading}
                            >
                                {loading ? 'Synchronizing...' : 'Save Parameters'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Section Placeholder */}
            <div className="mt-20 pt-12 border-t border-gray-200">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">Security Infrastructure</h3>
                <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Authentication Integrity</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Managed via high-security system protocols.</p>
                        </div>
                        <button className="px-6 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all">
                            Request Modification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
