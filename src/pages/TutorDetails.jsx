import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
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
import SEO from '../components/shared/SEO';

const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [canReview, setCanReview] = useState(false);

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

    useEffect(() => {
        if (tutor?._id) {
            api.get(`/api/tutors/${tutor._id}/reviews`)
                .then(res => setReviews(res.data))
                .catch(err => console.error(err));
        }
    }, [tutor]);

    useEffect(() => {
        const checkBookingStatus = async () => {
            if (user?.email && tutor?.email) {
                try {
                    const res = await api.get(`/api/bookings/student/${user.email}`);
                    const completed = res.data.some(b => 
                        b.tutorEmail.toLowerCase() === tutor.email.toLowerCase() && 
                        b.status === 'completed'
                    );
                    setCanReview(completed);
                } catch (error) {
                    console.error('Failed to check booking eligibility', error);
                }
            }
        };
        checkBookingStatus();
    }, [user, tutor]);

    const handleContact = async () => {
        if (!tutor) return;
        try {
            await api.post('/api/contact', {
                name: user?.displayName || 'Anonymous',
                email: user?.email || '',
                message: `Interest in tutoring from ${user?.displayName} (${user?.email}) for tutor: ${tutor.displayName}`
            });
            toast.success('Message sent to tutor!');
        } catch {
            toast.error('Failed to send message');
        }
    };

    const handleSave = async () => {
        if (!tutor) return;
        try {
            await api.post(`/api/bookmarks/${tutor._id}`);
            toast.success('Tutor saved');
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error('Tutor already saved');
            } else {
                toast.error('Failed to save tutor');
            }
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) {
            toast.error('Please write a review');
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post(`/api/tutors/${tutor._id}/reviews`, {
                rating: newReview.rating,
                comment: newReview.comment,
                studentEmail: user?.email || 'anonymous'
            });
            setReviews([res.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });
            toast.success('Review submitted');
        } catch (err) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="bg-[#F5F7FA] min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <div className="w-32 h-4 bg-[#EEF2F6] rounded-full animate-pulse"></div>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-6 rounded-lg border border-[rgba(15,23,46,0.08)]">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-28 h-28 rounded-lg bg-[#EEF2F6] animate-pulse"></div>
                                <div className="flex-grow space-y-3">
                                    <div className="w-48 h-6 bg-[#EEF2F6] rounded animate-pulse"></div>
                                    <div className="w-64 h-4 bg-[#EEF2F6] rounded animate-pulse"></div>
                                    <div className="w-32 h-4 bg-[#EEF2F6] rounded animate-pulse"></div>
                                    <div className="flex gap-6 pt-4 border-t border-[rgba(15,23,46,0.08)]">
                                        <div className="w-24 h-12 bg-[#EEF2F6] rounded animate-pulse"></div>
                                        <div className="w-24 h-12 bg-[#EEF2F6] rounded animate-pulse"></div>
                                        <div className="w-24 h-12 bg-[#EEF2F6] rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)] h-32">
                                <div className="w-24 h-4 bg-[#EEF2F6] rounded animate-pulse mb-3"></div>
                                <div className="flex gap-2">
                                    <div className="w-16 h-6 bg-[#EEF2F6] rounded-full animate-pulse"></div>
                                    <div className="w-20 h-6 bg-[#EEF2F6] rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)] h-32">
                                <div className="w-24 h-4 bg-[#EEF2F6] rounded animate-pulse mb-3"></div>
                                <div className="space-y-2">
                                    <div className="w-full h-3 bg-[#EEF2F6] rounded animate-pulse"></div>
                                    <div className="w-3/4 h-3 bg-[#EEF2F6] rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg border border-[rgba(15,23,46,0.08)] h-48">
                            <div className="w-32 h-5 bg-[#EEF2F6] rounded animate-pulse mb-4"></div>
                            <div className="space-y-3">
                                <div className="w-full h-10 bg-[#EEF2F6] rounded animate-pulse"></div>
                                <div className="w-full h-10 bg-[#EEF2F6] rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!tutor) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center bg-[#F5F7FA] min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-heading text-[#111827] mb-2">Profile Not Found</h2>
                <p className="text-sm text-[#5B6475] mb-6">We couldn't find the tutor you are looking for.</p>
                <Link to="/tutors" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]">
                    Back to Tutors
                </Link>
            </div>
        );
    }

    const firstName = tutor.displayName ? tutor.displayName.split(' ')[0] : 'Tutor';

    return (
        <div className="bg-[#F5F7FA] min-h-screen py-8">
            <SEO 
                title={`Book ${tutor.displayName} - Expert Tutor`}
                description={`Learn with ${tutor.displayName}, an experienced tutor in ${tutor.location}. Subject expertise: ${Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'Various'}.`}
            />
            <div className="max-w-6xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/tutors" className="inline-flex items-center gap-2 text-sm text-[#5B6475] hover:text-[#2563EB] transition-colors">
                        <ArrowLeft size={16} />
                        Back to Tutors
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Identity Card */}
                        <div className="bg-white p-6 rounded-lg border border-[rgba(15,23,46,0.08)]">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="relative shrink-0">
                                    <div className="w-28 h-28 rounded-lg overflow-hidden border border-[rgba(15,23,46,0.08)]">
                                        <img
                                            src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                            alt={tutor.displayName || 'Tutor'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {tutor.isVerified && tutor._id !== 'tutor_001' && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-white">
                                            <CheckCircle2 size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {tutor.isVerified && tutor._id !== 'tutor_001' && (
                                            <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium rounded-full">Verified</span>
                                        )}
                                        <span className="text-xs text-[#5B6475] flex items-center gap-1 px-2 py-1 bg-[#EEF2F6] rounded-full">
                                            <MapPin size={12} /> {tutor.location || 'N/A'}
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-heading text-[#111827] mb-1">
                                        {tutor.displayName || 'Tutor'}
                                    </h1>
                                    <p className="text-sm text-[#5B6475] mb-4 flex items-center gap-2">
                                        <GraduationCap size={16} className="text-[#2563EB]" />
                                        {tutor.qualification || 'Verified Educator'}
                                    </p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-[rgba(15,23,46,0.08)]">
                                        <div>
                                            <p className="text-xs text-[#5B6475] mb-1">Monthly Fee</p>
                                            <p className="text-lg font-heading text-[#111827]">৳{tutor.expectedSalary || 'Negotiable'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0]"></div>
                                        <div>
                                            <p className="text-xs text-[#5B6475] mb-1">Experience</p>
                                            <p className="text-lg font-heading text-[#111827]">{tutor.experience || 'Verified'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0]"></div>
                                        <div>
                                            <p className="text-xs text-[#5B6475] mb-1">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-lg font-heading text-[#111827]">{tutor.ratings || '4.9'}</p>
                                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subjects & Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)]">
                                <h2 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
                                    <Award size={14} className="text-[#2563EB]" /> Subjects
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(tutor.subjects) ? tutor.subjects.map((subject, idx) => (
                                        <span key={idx} className="bg-[#EEF2F6] text-[#374151] px-3 py-1 rounded-lg text-xs">
                                            {subject}
                                        </span>
                                    )) : (
                                        <span className="text-[#5B6475] text-xs">No subjects listed</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)]">
                                <h2 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
                                    <Calendar size={14} className="text-[#2563EB]" /> Availability
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(tutor.availableDays) ? tutor.availableDays.map((day, idx) => (
                                        <span key={idx} className="bg-[#EEF2F6] text-[#374151] px-3 py-1 rounded-lg text-xs">
                                            {day}
                                        </span>
                                    )) : (
                                        <span className="text-[#5B6475] text-xs">Contact for availability</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)]">
                            <h2 className="text-sm font-medium text-[#374151] mb-3">About the Tutor</h2>
                            <p className="text-sm text-[#5B6475] leading-relaxed">
                                {tutor.displayName} is a qualified educator specialized in {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'their field'}.
                                With {tutor.experience || 'years'} of experience, they provide structured learning for students in {tutor.location || 'their area'}.
                            </p>
                            <p className="text-sm text-[#5B6475] mt-3 leading-relaxed">
                                Committed to academic excellence and student growth, {firstName} focuses on building strong conceptual foundations.
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)]">
                            <h3 className="text-lg font-heading mb-4 flex items-center gap-2">
                                Reviews ({reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'})
                            </h3>
                            
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review._id} className="p-4 border border-[rgba(15,23,46,0.08)] rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-[#111827]">{review.studentEmail}</span>
                                                <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                                            </div>
                                            <p className="text-[#5B6475] mt-2 text-sm">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#5B6475] text-sm">No reviews yet.</p>
                            )}

                            {user && canReview ? (
                                <form onSubmit={handleSubmitReview} className="mt-6 pt-4 border-t border-[rgba(15,23,46,0.08)]">
                                    <h4 className="text-sm font-medium text-[#374151] mb-3">Write a Review</h4>
                                    <div className="flex items-center gap-2 mb-3">
                                        <label className="text-sm text-[#5B6475]">Rating:</label>
                                        <select 
                                            value={newReview.rating} 
                                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                            className="border border-[rgba(15,23,46,0.08)] rounded-lg px-2 py-1 text-sm bg-[#F5F7FA] text-[#111827]"
                                        >
                                            {[1,2,3,4,5].map(n => (
                                                <option key={n} value={n}>{n} ★</option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                        placeholder="Write your review..."
                                        className="w-full border border-[rgba(15,23,46,0.08)] rounded-lg p-3 text-sm mb-3 bg-[#F5F7FA] text-[#111827] placeholder:text-[#5B6475]"
                                        rows={3}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            ) : user && (
                                <div className="mt-6 pt-4 border-t border-[rgba(15,23,46,0.08)] text-center text-sm text-[#5B6475]">
                                    You can only write a review after completing a session with this tutor.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)]">
                            <div className="text-center">
                                <h3 className="text-base font-heading text-[#111827] mb-2">Learn with {firstName}</h3>
                                <p className="text-sm text-[#5B6475] mb-4">
                                    Book a trial class and experience quality academic support.
                                </p>

                                <div className="space-y-2">
                                    {!user ? (
                                        <Link to="/login" className="block w-full px-4 py-2.5 bg-[#EEF2F6] text-[#374151] font-medium rounded-lg hover:bg-[#E2E8F0] text-sm transition-colors">
                                            Login to Message
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleContact}
                                            className="w-full px-4 py-2.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] flex items-center justify-center gap-2 text-sm transition-colors shadow-sm active:scale-95"
                                        >
                                            <Send size={16} /> Contact Tutor
                                        </button>
                                    )}

                                    <button
                                        onClick={handleSave}
                                        className="w-full px-4 py-2.5 border border-[rgba(15,23,46,0.08)] text-[#5B6475] font-medium rounded-lg hover:bg-[#F5F7FA] flex items-center justify-center gap-2 text-sm transition-colors"
                                    >
                                        <Heart size={16} /> Save Profile
                                    </button>
                                </div>

                                {tutor._id !== 'tutor_001' && (
                                    <div className="mt-4 pt-4 border-t border-[rgba(15,23,46,0.08)] flex items-center justify-center gap-3">
                                        <div className="w-8 h-8 bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] rounded-full">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-medium text-[#111827]">Verified Profile</p>
                                            <p className="text-xs text-[#5B6475]">Documents Validated</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white p-4 rounded-lg border border-[rgba(15,23,46,0.08)]">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#EEF2F6] flex items-center justify-center text-[#5B6475] rounded-lg">
                                        <Briefcase size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#5B6475]">Response Time</p>
                                        <p className="text-sm font-medium text-[#111827]">Under 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#EEF2F6] flex items-center justify-center text-[#5B6475] rounded-lg">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#5B6475]">Active Status</p>
                                        <p className="text-sm font-medium text-[#111827]">Recently Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Tutors */}
                <div className="mt-8 pt-6 border-t border-[rgba(15,23,46,0.08)]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-heading text-[#111827]">Similar Tutors</h2>
                        </div>
                        <Link to="/tutors" className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
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