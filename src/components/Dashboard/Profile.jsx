// Profile Settings - user er profile edit korte parbe
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Profile = () => {
    let { user, dbUser } = useAuth();
    let [loading, setLoading] = useState(false);
    let { register, handleSubmit } = useForm();

    // form submit handler - profile update kortesi
    const onSubmit = async (data) => {
        setLoading(true);

        if (!data || !dbUser?._id) {
            toast.error('Data nai')
            setLoading(false)
            return
        }

        try {
            // API call to update profile
            const res = await fetch(`http://localhost:5000/api/users/${dbUser._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    displayName: data.displayName,
                    photoURL: data.photoURL
                })
            });

            if (res.ok) {
                toast.success('Profile updated!')
            } else {
                toast.error('Update failed')
            }
        } catch (error) {
            console.log('update error:', error)
            toast.error('Update hoinai')
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
                            src={user?.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                            alt="avatar"
                            className="w-20 h-20 rounded-full"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{user?.displayName}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            <span className="badge badge-primary">{dbUser?.role || 'student'}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Display Name</span></label>
                            <input
                                type="text"
                                className="input input-bordered"
                                defaultValue={user?.displayName}
                                {...register('displayName')}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL</span></label>
                            <input
                                type="text"
                                className="input input-bordered"
                                defaultValue={user?.photoURL}
                                {...register('photoURL')}
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
