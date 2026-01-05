/**
 * Tutor Details Page
 * Displays full tutor profile information
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const found = demoTutors.find(t => t._id === id);
            setTutor(found);
            setLoading(false);
        }, 300);
    }, [id]);

    if (loading) return <LoadingSpinner />;

    if (!tutor) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">Error 404</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Expert profile not found.</h1>
                <Link to="/tutors" className="btn-quiet-secondary inline-block px-8">
                    Return to Professionals
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
            <header className="mb-16">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="w-full md:w-80 shrink-0">
                        <div className="aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden">
                            <img
                                src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                alt={tutor.displayName}
                                className="w-full h-full object-cover grayscale-[0.2]"
                            />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Certified Professional</span>
                            {tutor.isVerified && (
                                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide border border-green-100">Verified</span>
                            )}
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">{tutor.displayName}</h1>
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl">{tutor.qualification}</p>

                        <div className="flex flex-wrap gap-12 border-t border-gray-100 pt-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Experience</p>
                                <p className="text-lg font-bold text-gray-900">{tutor.experience}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Rating</p>
                                <p className="text-lg font-bold text-gray-900">★ {tutor.ratings}/5</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Expected Fee</p>
                                <p className="text-lg font-bold text-indigo-600">৳{tutor.expectedSalary}/mo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <section className="mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Specializations</h2>
                        <div className="flex flex-wrap gap-3">
                            {tutor.subjects?.map((subject, idx) => (
                                <span key={idx} className="px-4 py-2 bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 uppercase tracking-tight">
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Availability</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {tutor.availableDays?.map((day, idx) => (
                                <div key={idx} className="p-4 border border-gray-100 text-center text-sm font-bold text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 border border-gray-200 p-8 rounded-sm bg-white shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Request Connection</h3>
                        <p className="text-sm text-gray-500 mb-8">Establish a professional engagement with this expert today.</p>

                        <div className="space-y-4">
                            {user ? (
                                <button className="btn-quiet-primary w-full h-14 text-base">
                                    Contact Professional
                                </button>
                            ) : (
                                <Link to="/login" className="btn-quiet-primary w-full h-14 text-base flex items-center justify-center">
                                    Login to Connect
                                </Link>
                            )}
                            <button className="btn-quiet-secondary w-full h-14 text-base">
                                Save Profile
                            </button>
                        </div>

                        <p className="text-[10px] text-gray-400 mt-8 text-center uppercase tracking-widest leading-relaxed">
                            All communications are monitored <br /> to ensure quality and security.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDetails;
