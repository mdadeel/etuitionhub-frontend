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
    GraduationCap
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import LoginRequiredModal from '../components/shared/LoginRequiredModal';
import ResponseTimeIndicator from '../components/shared/ResponseTimeIndicator';
import WhatsAppShareButton from '../components/shared/WhatsAppShareButton';
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, CircleSkeleton } from "@/components/shared/skeletons";
import CredibilityBadge from '@/components/CredibilityBadge';

function TutorDetailsSkeleton() {
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Skeleton className="w-32 h-4 rounded-full" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <CircleSkeleton size={112} className="rounded-lg" />
                <div className="flex-grow space-y-3">
                  <Skeleton className="w-48 h-6 rounded-lg" />
                  <Skeleton className="w-64 h-4 rounded-lg" />
                  <Skeleton className="w-32 h-4 rounded-lg" />
                  <div className="flex gap-6 pt-4 border-t border-border">
                    <Skeleton className="w-24 h-12 rounded-lg" />
                    <Skeleton className="w-24 h-12 rounded-lg" />
                    <Skeleton className="w-24 h-12 rounded-lg" />
                  </div>
                </div>
              </div>
            </CardSkeleton>
            <CardSkeleton className="p-6 space-y-3">
              <Skeleton className="w-40 h-5 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </CardSkeleton>
            <CardSkeleton className="p-6 space-y-3">
              <Skeleton className="w-36 h-5 rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            </CardSkeleton>
          </div>
          <div className="space-y-4">
            <CardSkeleton className="p-6">
              <Skeleton className="w-32 h-5 rounded-lg mb-4" />
              <div className="space-y-3">
                <Skeleton className="w-full h-10 rounded-xl" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
            </CardSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    // eslint-disable-next-line no-unused-vars
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
            
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <TutorDetailsSkeleton />;

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

                <div className="space-y-4">
                    {/* Identity Card */}
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <div className="flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-stretch">
                            {/* Left Column: Avatar & Basic Stats */}
                            <div className="flex flex-col sm:flex-row gap-6 flex-grow">
                                <div className="relative shrink-0 mx-auto sm:mx-0">
                                    <div className="size-28 rounded-lg overflow-hidden border border-border">
                                        <Avatar
                                            src={tutor.photoURL}
                                            alt={tutor.displayName || 'Tutor'}
                                            gender={tutor.gender}
                                            className="size-full rounded-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                                        <div className="text-center sm:text-left">
                                            <h1 className="text-xl sm:text-2xl font-heading text-foreground mb-1">
                                                {tutor.displayName || 'Tutor'}
                                            </h1>
                                            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                                                <GraduationCap size={16} className="text-[#2563EB]" />
                                                {tutor.qualification || 'Verified Educator'}
                                            </p>
                                        </div>

                                        {tutor.isVerified && tutor._id !== 'tutor_001' && (
                                            <div className="flex justify-center sm:justify-end shrink-0">
                                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium rounded-lg flex items-center gap-1 shadow-sm">
                                                    <ShieldCheck size={14} className="text-emerald-600" />
                                                    Verified
                                                </span>
                                            </div>
                                        )}
                                        <CredibilityBadge 
                                            requestsReceived={tutor.requestsReceived || 0}
                                            requestsRespondedCount={tutor.requestsRespondedCount || 0}
                                            profileCompleteness={tutor.profileCompleteness || 0}
                                            reviewCount={tutor.reviewCount || 0}
                                            rating={tutor.ratings || 0}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-around sm:justify-start gap-4 sm:gap-6 pt-4 border-t border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Monthly Fee</p>
                                            <p className="text-base sm:text-lg font-heading text-foreground">৳{tutor.expectedSalary || 'Negotiable'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0] hidden sm:block"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Experience</p>
                                            <p className="text-base sm:text-lg font-heading text-foreground">{tutor.experience || 'Verified'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0] hidden sm:block"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-base sm:text-lg font-heading text-foreground">{tutor.ratings || '4.9'}</p>
                                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                            </div>
                                        </div>
                                        <div className="w-px h-8 bg-[#E2E8F0] hidden sm:block"></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Location</p>
                                            <p className="text-base sm:text-lg font-heading text-foreground flex items-center gap-1">
                                                <MapPin size={14} className="text-[#2563EB]" /> {tutor.location || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vertical separator on desktop screens */}
                            <div className="hidden lg:block w-px bg-border self-stretch my-2"></div>

                            {/* Right Column: CTA card */}
                            <div className="flex flex-col justify-between lg:w-80 lg:shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-border">
                                <div className="space-y-2 mb-4 lg:mb-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-foreground">Learn with {firstName}</h3>
                                        <ResponseTimeIndicator tutor={tutor} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Book a trial class and experience quality academic support.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                    <div className="flex-grow">
                                        {!user ? (
                                            <Link to="/login" className="block w-full px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-medium rounded-lg text-xs sm:text-sm transition-colors text-center shadow-sm cursor-pointer">
                                                Login to Message
                                            </Link>
                                        ) : (
                                            <button
                                                id="contact-tutor-btn"
                                                onClick={handleContact}
                                                className="w-full px-4 py-2 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors shadow-sm active:scale-95 cursor-pointer"
                                            >
                                                <Send size={14} /> Message
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        title={isSaved ? 'Remove from saved' : 'Save Profile'}
                                        className={`p-2 border rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                            isSaved
                                                ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
                                                : 'border-border text-muted-foreground hover:bg-muted/50'
                                        }`}
                                    >
                                        <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                                    </button>

                                    <WhatsAppShareButton 
                                        tutor={tutor} 
                                        className="p-2 border rounded-lg shrink-0 cursor-pointer" 
                                        variant="outline" 
                                        iconOnly={true} 
                                    />
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