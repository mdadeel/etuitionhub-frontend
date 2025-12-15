// Profile Settings - user er profile edit korte parbe
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import API_URL from '../../config/api';

const Profile = () => {
    let { user, dbUser, loading: authLoading, refreshUserFromDB, updateUserProfile } = useAuth();
    var [loading, setLoading] = useState(false); // var usage
    const { register, handleSubmit, setValue } = useForm();

    // photo state - synced with dbUser or user
    const [photoInput, setPhotoInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    // sync inputs when dbUser loads or changes
    useEffect(() => {
        // sync name
        if (dbUser?.displayName) {
            setNameInput(dbUser.displayName);
        } else if (user?.displayName) {
            setNameInput(user.displayName);
        }
        // sync photo
        if (dbUser?.photoURL) {
            setPhotoInput(dbUser.photoURL);
            setValue('photoURL', dbUser.photoURL);
        } else if (user?.photoURL) {
            setPhotoInput(user.photoURL);
            setValue('photoURL', user.photoURL);
        }
    }, [dbUser, user, setValue]);

    if (authLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
    }

    // manual onChange handler
    function handleNameChange(e) {
        setNameInput(e.target.value);
    }

    // photo change handler
    function handlePhotoChange(e) {
        setPhotoInput(e.target.value);
    }

    // form submit handler - profile update kortesi
    const onSubmit = async (data) => {
        setLoading(true);

        // Use email as fallback identifier if dbUser._id not available
        const identifier = dbUser?._id || user?.email;
        if (!identifier) {
            toast.error('User data not loaded - please refresh')
            setLoading(false)
            return
        }


        if (nameInput.length < 3) {
            alert('Name too short'); // alert instead of toast 
            setLoading(false);
            return;
        }

        try {
            // Use email-based endpoint - no auth required
            const res = await fetch(`${API_URL}/api/users/by-email/${user?.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    displayName: nameInput,
                    photoURL: photoInput
                })
            });

            if (res.ok) {
                toast.success('Profile updated!')
                // Sync state instead of page reload
                await refreshUserFromDB(user?.email);
                // Also update Firebase user profile
                updateUserProfile({ displayName: nameInput, photoURL: photoInput });
            } else {
                const errorData = await res.json();
                toast.error('Update failed - ' + (errorData.error || 'try again'))
            }
        } catch (error) {
            console.log('update error:', error)
            toast.error('Network error - check connection')
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={photoInput || dbUser?.photoURL || user?.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                            alt="avatar"
                            className="w-20 h-20 rounded-full object-cover"
                            onError={(e) => { e.target.src = 'https://i.ibb.co/4pDNDk1/default-avatar.png' }}
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{dbUser?.displayName || user?.displayName}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            <span className="badge badge-primary">{dbUser?.role || 'student'}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Display Name</span></label>
                            {/* Mixing cntrld and unctrld */}
                            <input
                                type="text"
                                className="input input-bordered"
                                value={nameInput}
                                onChange={handleNameChange} // manual handler
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL</span></label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={photoInput}
                                onChange={handlePhotoChange}
                                placeholder="Enter image URL"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Profile;
