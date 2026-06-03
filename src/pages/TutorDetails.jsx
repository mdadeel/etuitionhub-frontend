import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import TutorCard from '../components/shared/TutorCard';
import toast from 'react-hot-toast';
import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import { Avatar } from '@/components/ui/avatar';
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
    Briefcase,
    Clock,
    GraduationCap
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import LoginRequiredModal from '../components/shared/LoginRequiredModal';

const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const { conversations, openChatWith, fetchConversations } = useChat();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTutorData = async () => {
            setLoading(true);

            if (!isValidObjectId(id)) {
                const found = demoTutors.find(t => t._id === id);
                if (found) {
                    setTutor(found);
                    setReviews([]);
                    setLoading(false);
                    return;
                }
            }

            try {
                // Concurrently fetch tutor profile, reviews, bookmark status, and booking eligibility (eliminating waterfalls)
                const promises = [
                    api.get(`/api/tutors/${id}`),
                    api.get(`/api/tutors/${id}/reviews`)
                ];

                if (user) {
                    promises.push(api.get(`/api/bookmarks/check/${id}`));
                    promises.push(api.get(`/api/bookings/student/${user.email}`));
                }

                const results = await Promise.all(promises);
                const tutorRes = results[0];
                const reviewsRes = results[1];
                const bookmarkRes = results[2];
                const bookingsRes = results[3];

                if (tutorRes.data) {
                    setTutor(tutorRes.data);
                    
                    // Check booking eligibility once tutor data is available
                    if (bookingsRes?.data) {
                        const completed = bookingsRes.data.some(b => 
                            b.tutorEmail.toLowerCase() === tutorRes.data.email.toLowerCase() && 
                            b.status === 'completed'
                        );
                        setCanReview(completed);
                    }
                } else {
                    throw new Error("No data received");
                }

                if (reviewsRes.data) {
                    setReviews(reviewsRes.data);
                }

                if (bookmarkRes?.data) {
                    setIsSaved(bookmarkRes.data.isSaved);
                }
            } catch (error) {
                console.warn("API fetch failed, falling back to demo:", error.message);
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
            fetchTutorData();
        }
    }, [id, user]);

    const handleContact = () => {
        // Check if conversation already exists
        const existingConv = conversations.find(c => 
            c.participants.some(p => p._id === tutor._id || p.email === tutor.email)
        );

        if (existingConv) {
            openChatWith(existingConv);
        } else {
            setIsMessageModalOpen(true);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;
        
        setSendingMessage(true);
        try {
            await api.post('/api/messages', {
                receiverId: tutor._id,
                text: messageText
            });
            toast.success('Message sent successfully!');
            setIsMessageModalOpen(false);
            setMessageText('');
            
            // Fetch updated conversations and open floating chat
            await fetchConversations();
            // It might take a moment for state to update, but next time they click Contact Tutor it will open the bubble
            // Or we can manually find it in a timeout
            setTimeout(() => {
                const checkBtn = document.getElementById('contact-tutor-btn');
                if(checkBtn) checkBtn.click();
            }, 500);
            
        } catch (err) {
            toast.error('Failed to send message');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        if (!tutor) return;
        try {
            if (isSaved) {
                await api.delete(`/api/bookmarks/${tutor._id}`);
                setIsSaved(false);
                toast.success('Tutor removed from saved');
            } else {
                await api.post(`/api/bookmarks/${tutor._id}`);
                setIsSaved(true);
                toast.success('Tutor saved');
            }
        } catch (err) {
            toast.error('Failed to save tutor');
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
        <div className="bg-background min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <div className="w-32 h-4 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="size-28 rounded-lg bg-muted animate-pulse"></div>
                                <div className="flex-grow space-y-3">
                                    <div className="w-48 h-6 bg-muted rounded animate-pulse"></div>
                                    <div className="w-64 h-4 bg-muted rounded animate-pulse"></div>
                                    <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
                                    <div className="flex gap-6 pt-4 border-t border-border">
                                        <div className="w-24 h-12 bg-muted rounded animate-pulse"></div>
                                        <div className="w-24 h-12 bg-muted rounded animate-pulse"></div>
                                        <div className="w-24 h-12 bg-muted rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card p-4 rounded-lg border border-border h-32">
                                <div className="w-24 h-4 bg-muted rounded animate-pulse mb-3"></div>
                                <div className="flex gap-2">
                                    <div className="w-16 h-6 bg-muted rounded-full animate-pulse"></div>
                                    <div className="w-20 h-6 bg-muted rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-lg border border-border h-32">
                                <div className="w-24 h-4 bg-muted rounded animate-pulse mb-3"></div>
                                <div className="space-y-2">
                                    <div className="w-full h-3 bg-muted rounded animate-pulse"></div>
                                    <div className="w-3/4 h-3 bg-muted rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-card p-6 rounded-lg border border-border h-48">
                            <div className="w-32 h-5 bg-muted rounded animate-pulse mb-4"></div>
                            <div className="space-y-3">
                                <div className="w-full h-10 bg-muted rounded animate-pulse"></div>
                                <div className="w-full h-10 bg-muted rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!tutor) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-heading text-foreground mb-2">Profile Not Found</h2>
                <p className="text-sm text-muted-foreground mb-6">We couldn't find the tutor you are looking for.</p>
                <Link to="/tutors" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]">
                    Back to Tutors
                </Link>
            </div>
        );
    }

    const firstName = tutor.displayName ? tutor.displayName.split(' ')[0] : 'Tutor';

    return (
        <>
        <div className="bg-background min-h-screen py-8">
            <SEO 
                title={`Book ${tutor.displayName} - Expert Tutor`}
                description={`Learn with ${tutor.displayName}, an experienced tutor in ${tutor.location}. Subject expertise: ${Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'Various'}.`}
            />
            <div className="max-w-6xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#2563EB] transition-colors">
                        <ArrowLeft size={16} />
                        Back to Tutors
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Identity Card */}
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="relative shrink-0">
                                    <div className="size-28 rounded-lg overflow-hidden border border-border">
                                        <Avatar
                                            src={tutor.photoURL}
                                            alt={tutor.displayName || 'Tutor'}
                                            gender={tutor.gender}
                                            className="size-full rounded-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {tutor.isVerified && tutor._id !== 'tutor_001' && (
                                            <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium rounded-full">Verified</span>
                                        )}
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                                            <MapPin size={12} /> {tutor.location || 'N/A'}
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-heading text-foreground mb-1">
                                        {tutor.displayName || 'Tutor'}
                                    </h1>
                                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                        <GraduationCap size={16} className="text-[#2563EB]" />
                                        {tutor.qualification || 'Verified Educator'}
                                    </p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Monthly Fee</p>
                                            <p className="text-lg font-heading text-foreground">৳{tutor.expectedSalary || 'Negotiable'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0]"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Experience</p>
                                            <p className="text-lg font-heading text-foreground">{tutor.experience || 'Verified'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0]"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-lg font-heading text-foreground">{tutor.ratings || '4.9'}</p>
                                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subjects & Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h2 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
                                    <Award size={14} className="text-[#2563EB]" /> Subjects
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(tutor.subjects) ? tutor.subjects.map((subject, idx) => (
                                        <span key={idx} className="bg-muted text-[#374151] px-3 py-1 rounded-lg text-xs">
                                            {subject}
                                        </span>
                                    )) : (
                                        <span className="text-muted-foreground text-xs">No subjects listed</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h2 className="text-sm font-medium text-[#374151] mb-3 flex items-center gap-2">
                                    <Calendar size={14} className="text-[#2563EB]" /> Availability
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(tutor.availableDays) ? tutor.availableDays.map((day, idx) => (
                                        <span key={idx} className="bg-muted text-[#374151] px-3 py-1 rounded-lg text-xs">
                                            {day}
                                        </span>
                                    )) : (
                                        <span className="text-muted-foreground text-xs">Contact for availability</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <h2 className="text-sm font-medium text-[#374151] mb-3">About the Tutor</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {tutor.displayName} is a qualified educator specialized in {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'their field'}.
                                With {tutor.experience || 'years'} of experience, they provide structured learning for students in {tutor.location || 'their area'}.
                            </p>
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                Committed to academic excellence and student growth, {firstName} focuses on building strong conceptual foundations.
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <h3 className="text-lg font-heading mb-4 flex items-center gap-2">
                                Reviews ({reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'})
                            </h3>
                            
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review._id} className="p-4 border border-border rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-foreground">{review.studentEmail}</span>
                                                <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                                            </div>
                                            <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No reviews yet.</p>
                            )}

                            {user && canReview ? (
                                <form onSubmit={handleSubmitReview} className="mt-6 pt-4 border-t border-border">
                                    <h4 className="text-sm font-medium text-[#374151] mb-3">Write a Review</h4>
                                    <div className="flex items-center gap-2 mb-3">
                                        <label className="text-sm text-muted-foreground">Rating:</label>
                                        <select 
                                            value={newReview.rating} 
                                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                            className="border border-border rounded-lg px-2 py-1 text-sm bg-background text-foreground"
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
                                        className="w-full border border-border rounded-lg p-3 text-sm mb-3 bg-background text-foreground placeholder:text-muted-foreground"
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
                                <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                                    You can only write a review after completing a session with this tutor.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <div className="text-center">
                                <h3 className="text-base font-heading text-foreground mb-2">Learn with {firstName}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Book a trial class and experience quality academic support.
                                </p>

                                <div className="space-y-2">
                                    {!user ? (
                                        <Link to="/login" className="block w-full px-4 py-2.5 bg-muted text-[#374151] font-medium rounded-lg hover:bg-[#E2E8F0] text-sm transition-colors">
                                            Login to Message
                                        </Link>
                                    ) : (
                                        <button
                                            id="contact-tutor-btn"
                                            onClick={handleContact}
                                            className="w-full px-4 py-2.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] flex items-center justify-center gap-2 text-sm transition-colors shadow-sm active:scale-95"
                                        >
                                            <Send size={16} /> Contact Tutor
                                        </button>
                                    )}

                                    <button
                                        onClick={handleSave}
                                        className={`w-full px-4 py-2.5 border font-medium rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
                                            isSaved
                                                ? 'border-primary/30 text-primary bg-primary/5 hover:bg-primary/10'
                                                : 'border-border text-muted-foreground hover:bg-background'
                                        }`}
                                    >
                                        <Heart size={16} className={isSaved ? 'fill-primary' : ''} />
                                        {isSaved ? 'Saved' : 'Save Profile'}
                                    </button>
                                </div>

                                {/* Verified Profile section removed as per request */}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-muted flex items-center justify-center text-muted-foreground rounded-lg">
                                        <Briefcase size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Response Time</p>
                                        <p className="text-sm font-medium text-foreground">Under 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-muted flex items-center justify-center text-muted-foreground rounded-lg">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Active Status</p>
                                        <p className="text-sm font-medium text-foreground">Recently Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Tutors */}
                <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-heading text-foreground">Similar Tutors</h2>
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

            {/* Message Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-heading text-foreground">Message {firstName}</h3>
                            <button onClick={() => setIsMessageModalOpen(false)} className="text-muted-foreground hover:text-foreground text-xl leading-none">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSendMessage}>
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={`Hi ${firstName}, I'd like to talk about...`}
                                className="w-full h-32 bg-background border border-border rounded-lg p-3 text-sm text-foreground mb-4 focus:outline-none focus:border-[#2563EB]/50 resize-none transition-colors"
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsMessageModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingMessage || !messageText.trim()}
                                    className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    {sendingMessage ? 'Sending...' : <><Send size={14} /> Send Message</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save this tutor" />
        </>
    );
};

export default TutorDetails;