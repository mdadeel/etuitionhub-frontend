import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TutorCard from '../components/shared/TutorCard';
import toast from 'react-hot-toast';
import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import {
    ArrowLeft,
    ArrowRight,
    Star,
    MapPin,
    Calendar,
    ShieldCheck,
    Award,
    Send,
    Heart,
    CheckCircle2,
    Briefcase,
    Clock,
    GraduationCap
} from 'lucide-react';

const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorDetails = async () => {
            setLoading(true);

            if (!isValidObjectId(id)) {
                const found = demoTutors.find(t => t._id === id);
                if (found) {
                    setTutor(found);
                    setLoading(false);
                    return;
                }
            }

            try {
                const response = await api.get(`/api/tutors/${id}`);
                if (response.data) {
                    setTutor(response.data);
                } else {
                    throw new Error("No data received");
                }
            } catch (error) {
                console.warn("API fetch failed:", error.message);
                const found = demoTutors.find(t => t._id === id);
                if (found) {
                    setTutor(found);
                } else {
                    console.error("Tutor not found in API or Demo:", id);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTutorDetails();
        }
    }, [id]);

    const handleContact = () => {
        if (!tutor) return;
        toast.success(`Message sent to ${tutor.displayName || 'the tutor'}.`);
    };

    const handleSave = () => {
        toast.success('Saved to favorites.');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner />
        </div>
    );

    if (!tutor) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Profile Not Found</h2>
                <p className="text-sm text-slate-600 mb-6">We couldn't find the tutor you are looking for.</p>
                <Link to="/tutors" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Back to Tutors
                </Link>
            </div>
        );
    }

    const firstName = tutor.displayName ? tutor.displayName.split(' ')[0] : 'Tutor';

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/tutors" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                        <ArrowLeft size={16} />
                        Back to Tutors
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Identity Card */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="relative shrink-0">
                                    <div className="w-28 h-28 rounded-lg overflow-hidden border border-slate-200">
                                        <img
                                            src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                            alt={tutor.displayName || 'Tutor'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                </div>

                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {tutor.isVerified && tutor._id !== 'tutor_001' && (
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">Verified</span>
                                        )}
                                        <span className="text-xs text-slate-500 flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                                            <MapPin size={12} /> {tutor.location || 'N/A'}
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold text-slate-900 mb-1">
                                        {tutor.displayName || 'Tutor'}
                                    </h1>
                                    <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                                        <GraduationCap size={16} className="text-blue-600" />
                                        {tutor.qualification || 'Verified Educator'}
                                    </p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Monthly Fee</p>
                                            <p className="text-lg font-semibold text-slate-900">৳{tutor.expectedSalary || 'Negotiable'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200"></div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Experience</p>
                                            <p className="text-lg font-semibold text-slate-900">{tutor.experience || 'Verified'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200"></div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-lg font-semibold text-slate-900">{tutor.ratings || '4.9'}</p>
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subjects & Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                    <Award size={14} className="text-blue-600" /> Subjects
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(tutor.subjects) ? tutor.subjects.map((subject, idx) => (
                                        <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs">
                                            {subject}
                                        </span>
                                    )) : (
                                        <span className="text-slate-500 text-xs">No subjects listed</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                    <Calendar size={14} className="text-blue-600" /> Availability
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(tutor.availableDays) ? tutor.availableDays.map((day, idx) => (
                                        <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs">
                                            {day}
                                        </span>
                                    )) : (
                                        <span className="text-slate-500 text-xs">Contact for availability</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h2 className="text-sm font-medium text-slate-700 mb-3">About the Tutor</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {tutor.displayName} is a qualified educator specialized in {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'their field'}.
                                With {tutor.experience || 'years'} of experience, they provide structured learning for students in {tutor.location || 'their area'}.
                            </p>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                Committed to academic excellence and student growth, {firstName} focuses on building strong conceptual foundations.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <div className="text-center">
                                <h3 className="text-base font-medium text-slate-900 mb-2">Learn with {firstName}</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Book a trial class and experience quality academic support.
                                </p>

                                <div className="space-y-2">
                                    {!user ? (
                                        <Link to="/login" className="block w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200 text-sm">
                                            Login to Message
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleContact}
                                            className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors shadow-sm active:scale-95"
                                        >
                                            <Send size={16} /> Contact Tutor
                                        </button>
                                    )}

                                    <button
                                        onClick={handleSave}
                                        className="w-full px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-md hover:bg-slate-50 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Heart size={16} /> Save Profile
                                    </button>
                                </div>

                                {tutor._id !== 'tutor_001' && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 flex items-center justify-center text-blue-600 rounded-full">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-medium text-slate-900">Verified Profile</p>
                                            <p className="text-xs text-slate-500">Documents Validated</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-600 rounded">
                                        <Briefcase size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Response Time</p>
                                        <p className="text-sm font-medium text-slate-900">Under 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-600 rounded">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Active Status</p>
                                        <p className="text-sm font-medium text-slate-900">Recently Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Tutors */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Similar Tutors</h2>
                        </div>
                        <Link to="/tutors" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {demoTutors
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map((item) => (
                                <TutorCard key={item._id} tutor={item} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDetails;