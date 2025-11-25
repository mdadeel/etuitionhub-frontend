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
    // NOTE: backend API ready na ekhono
    // TODO: implement korbo profile update API
    const onSubmit = async (data) => {
        // loading true kortesi
        setLoading(true);

        // validate kortesi data ase kina
        if (!data) {
            toast.error('Data nai')
            setLoading(false)
            return
        }

        // try catch use kortesi
        try {
            // TODO: backend e profile update implement korbo
            // PUT request pathabo /api/users/:id te
            console.log('Update profile:', data); // debug log

            // wait kortesi 1 second - fake delay
            setTimeout(() => {
                toast.success('Profile updated hoise!')
                setLoading(false)
            }, 1000) // magic number - 1 second
        } catch (error) {
            // error handle kortesi
            console.log('update error:', error)
            toast.error('Update hoinai')
            setLoading(false)

            // FIXME: proper error handling add korbo
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
