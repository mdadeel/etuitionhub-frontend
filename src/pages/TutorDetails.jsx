/**
 * Tutor Details Page
 * Displays full tutor profile information
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';

const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Find tutor from demo data
        setTimeout(() => {
            const found = demoTutors.find(t => t._id === id);
            setTutor(found);
            setLoading(false);
        }, 300);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>;
    }

    if (!tutor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Tutor not found</h2>
                <Link to="/tutors" className="btn bg-teal-600 text-white hover:bg-teal-700 border-none">
                    Back to Tutors
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure className="lg:w-1/3 p-4">
                    <img
                        src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                        alt={tutor.displayName}
                        className="w-full h-80 object-cover rounded-xl"
                    />
                </figure>
                <div className="card-body lg:w-2/3">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="card-title text-3xl">{tutor.displayName}</h2>
                        {tutor.isVerified && (
                            <span className="badge badge-success">Verified</span>
                        )}
                    </div>

                    <p className="text-gray-600 text-lg">{tutor.qualification}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        <div>
                            <p className="font-medium">📍 Location</p>
                            <p className="text-gray-600">{tutor.location}</p>
                        </div>
                        <div>
                            <p className="font-medium">💼 Experience</p>
                            <p className="text-gray-600">{tutor.experience}</p>
                        </div>
                        <div>
                            <p className="font-medium">⭐ Rating</p>
                            <p className="text-yellow-500 font-bold">{tutor.ratings}/5</p>
                        </div>
                        <div>
                            <p className="font-medium">💰 Expected Salary</p>
                            <p className="text-teal-600 font-bold">৳{tutor.expectedSalary}/month</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="font-medium mb-2">📚 Subjects</p>
                        <div className="flex flex-wrap gap-2">
                            {tutor.subjects?.map((subject, idx) => (
                                <span key={idx} className="badge badge-lg bg-teal-100 text-teal-800">{subject}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="font-medium mb-2">📅 Available Days</p>
                        <div className="flex flex-wrap gap-2">
                            {tutor.availableDays?.map((day, idx) => (
                                <span key={idx} className="badge badge-outline">{day}</span>
                            ))}
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                        {user ? (
                            <button className="btn bg-teal-600 text-white hover:bg-teal-700 border-none">
                                Contact Tutor
                            </button>
                        ) : (
                            <Link to="/login" className="btn bg-teal-600 text-white hover:bg-teal-700 border-none">
                                Login to Contact
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorDetails;
