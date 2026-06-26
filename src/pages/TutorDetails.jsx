import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    GraduationCap,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import LoginRequiredModal from '../components/shared/LoginRequiredModal';
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
    
    // Hire Request State
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hireMessage, setHireMessage] = useState('');
    const [hireRate, setHireRate] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [submittingHire, setSubmittingHire] = useState(false);
    const [existingRequest, setExistingRequest] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [cancellingRequest, setCancellingRequest] = useState(false);
    const [demoTutors, setDemoTutors] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();

    useEffect(() => {
        import('../data/demoTutors.json').then(m => setDemoTutors(m.default || m)).catch(() => {});
    }, []);

    useEffect(() => {
        const fetchTutorData = async () => {
            setLoading(true);

            if (!isValidObjectId(id)) {
                const found = demoTutors?.find(t => t._id === id);
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
                const found = demoTutors?.find(t => t._id === id);
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
    }, [id, user, demoTutors]);

    useEffect(() => {
        const checkExistingRequest = async () => {
            if (!user || !tutor) return;
            try {
                const res = await api.get('/api/hire-requests/sent');
                const active = (res.data?.data || []).find(
                    r => r.toUserId?._id === tutor._id && ['pending', 'countered'].includes(r.status)
                );
                if (active) setExistingRequest(active);
            } catch {
                // silent — not critical
            }
        };
        checkExistingRequest();
    }, [user, tutor]);

    const handleCancelRequest = async () => {
        if (!existingRequest) return;
        setCancellingRequest(true);
        try {
            await api.delete(`/api/hire-requests/${existingRequest._id}`);
            toast.success('Hire request cancelled');
            setExistingRequest(null);
            setIsStatusModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to cancel request');
        } finally {
            setCancellingRequest(false);
        }
    };

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

    const handleHireRequest = async (e) => {
        e.preventDefault();
        if (!hireMessage.trim()) {
            toast.error('Please provide a message for your hire request.');
            return;
        }

        setSubmittingHire(true);
        try {
            const res = await api.post('/api/hire-requests', {
                toUserId: tutor._id,
                message: hireMessage,
                proposedRate: hireRate ? Number(hireRate) : undefined,
                subjects: selectedSubjects
            });
            toast.success('Hire request sent successfully!');
            const created = res.data?.data || res.data;
            setExistingRequest({
                _id: created._id,
                toUserId: { _id: tutor._id, displayName: tutor.displayName },
                proposedRate: created.proposedRate,
                subjects: created.subjects || selectedSubjects,
                message: created.message || hireMessage,
                status: 'pending'
            });
            setIsHireModalOpen(false);
            setHireMessage('');
            setHireRate('');
            setSelectedSubjects([]);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send hire request');
        } finally {
            setSubmittingHire(false);
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


                <div className="space-y-4">
                    {/* Identity Card */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-center">
                            {/* Left Column: Avatar & Primary Content */}
                            <div className="flex flex-col sm:flex-row gap-6 flex-grow">
                                <div className="relative shrink-0 mx-auto sm:mx-0">
                                    <div className="size-28 rounded-2xl overflow-hidden border border-border">
                                        <Avatar
                                            src={tutor.photoURL}
                                            alt={tutor.displayName || 'Tutor'}
                                            gender={tutor.gender}
                                            className="size-full rounded-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="text-center sm:text-left">
                                            <h1 className="text-xl sm:text-2xl font-heading text-foreground mb-1">
                                                {tutor.displayName || 'Tutor'}
                                            </h1>
                                            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                                                <GraduationCap size={16} className="text-[#2563EB]" aria-hidden="true" />
                                                {tutor.qualification || 'Verified Educator'}
                                            </p>
                                        </div>

                                        <CredibilityBadge 
                                            requestsReceived={tutor.requestsReceived || 0}
                                            requestsRespondedCount={tutor.requestsRespondedCount || 0}
                                            profileCompleteness={tutor.profileCompleteness || 0}
                                            reviewCount={tutor.reviewCount || 0}
                                            rating={tutor.ratings || 0}
                                        />
                                    </div>

                                    {/* CTA section */}
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex-1 min-w-[120px]">
                                                {!user ? (
                                                    <Link to="/login" className="block w-full px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-semibold rounded-xl text-xs sm:text-sm transition-all text-center shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-98">
                                                        Login to Message
                                                    </Link>
                                                ) : (
                                                    <button
                                                        id="contact-tutor-btn"
                                                        onClick={handleContact}
                                                        className="w-full px-4 py-2 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                                                    >
                                                        <Send size={14} aria-hidden="true" /> Message
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-[120px]">
                                                {!user ? (
                                                    <button onClick={() => setShowLoginModal(true)} className="w-full px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950">
                                                        Request to Hire
                                                    </button>
                                                ) : existingRequest ? (
                                                    <button
                                                        onClick={() => setIsStatusModalOpen(true)}
                                                        className="w-full px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                                                    >
                                                        <CheckCircle2 size={14} aria-hidden="true" /> Sent
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsHireModalOpen(true)}
                                                        className="w-full px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                                                    >
                                                        Request to Hire
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleSave}
                                                title={isSaved ? 'Remove from saved' : 'Save Profile'}
                                                aria-label={isSaved ? 'Remove from saved' : 'Save Profile'}
                                                className={`p-2 border rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 ${
                                                    isSaved
                                                        ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/50 dark:hover:text-rose-300'
                                                        : 'border-border text-muted-foreground hover:bg-muted/50 dark:hover:bg-muted/20 dark:hover:text-foreground'
                                                }`}
                                            >
                                                <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : ''} aria-hidden="true" />
                                            </button>
                                            <WhatsAppShareButton 
                                                tutor={tutor} 
                                                className="p-2 border rounded-xl shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 hover:bg-muted/50 dark:hover:bg-muted/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-600/30 dark:hover:border-emerald-500/30" 
                                                variant="outline" 
                                                iconOnly={true} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* stats Column with 2x2 grid */}
                            <div className="lg:w-80 lg:shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-border lg:pl-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-2xl transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Monthly Fee</p>
                                        <p className="text-base sm:text-lg font-heading text-foreground font-bold">৳{tutor.expectedSalary || 'Negotiable'}</p>
                                    </div>
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-2xl transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Experience</p>
                                        <p className="text-base sm:text-lg font-heading text-foreground font-bold truncate" title={tutor.experience}>{tutor.experience || 'Verified'}</p>
                                    </div>
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-2xl transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Rating</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-base sm:text-lg font-heading text-foreground font-bold">{tutor.ratings || '4.9'}</p>
                                            <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-2xl transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                                        <p className="text-base sm:text-lg font-heading text-foreground font-bold truncate flex items-center gap-1" title={tutor.location || 'N/A'}>
                                            <MapPin size={14} className="text-[#2563EB] shrink-0" aria-hidden="true" />
                                            <span>{(tutor.location || 'N/A').split(',')[0]}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects & Availability */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                <Award size={14} className="text-[#2563EB]" aria-hidden="true" /> Subjects
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(tutor.subjects) ? tutor.subjects.map((subject, idx) => (
                                    <span key={idx} className="bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-100 border border-border/40 dark:border-neutral-800 px-3 py-1 rounded-lg text-xs font-medium">
                                        {subject}
                                    </span>
                                )) : (
                                    <span className="text-muted-foreground text-xs">No subjects listed</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                <Calendar size={14} className="text-[#2563EB]" aria-hidden="true" /> Availability
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(tutor.availableDays) ? tutor.availableDays.map((day, idx) => (
                                    <span key={idx} className="bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-100 border border-border/40 dark:border-neutral-800 px-3 py-1 rounded-lg text-xs font-medium">
                                        {day}
                                    </span>
                                )) : (
                                    <span className="text-muted-foreground text-xs">Contact for availability</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">About the Tutor</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {tutor.displayName} is a qualified educator specialized in {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'their field'}.
                            With {tutor.experience || 'years'} of experience, they provide structured learning for students in {tutor.location || 'their area'}.
                        </p>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                            Committed to academic excellence and student growth, {firstName} focuses on building strong conceptual foundations.
                        </p>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                        <h3 className="text-lg font-heading mb-4 flex items-center gap-2">
                            Reviews ({reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'})
                        </h3>
                        
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review._id} className="p-4 border border-border/60 rounded-xl bg-muted/20">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground truncate max-w-[140px] sm:max-w-none" title={review.studentEmail}>{review.studentEmail}</span>
                                            <span className="text-amber-500" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}</span>
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
                                <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Write a Review</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <label className="text-sm text-muted-foreground" htmlFor="review-rating-select">Rating:</label>
                                    <select 
                                        id="review-rating-select"
                                        value={newReview.rating} 
                                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                        className="border border-border rounded-lg px-2 py-1 text-sm bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 cursor-pointer"
                                    >
                                        {[1,2,3,4,5].map(n => (
                                            <option key={n} value={n}>{n} ★</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    value={newReview.comment}
                                    aria-label="Review Comments"
                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    placeholder="Write your review…"
                                    className="w-full border border-border rounded-xl p-3 text-sm mb-3 bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                                    rows={3}
                                />
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 cursor-pointer"
                                >
                                    {submitting ? 'Submitting…' : 'Submit Review'}
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
                        {(demoTutors || [])
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
                    <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-heading text-foreground">Message {firstName}</h3>
                            <button onClick={() => setIsMessageModalOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSendMessage}>
                            <textarea
                                value={messageText}
                                aria-label={`Message to ${firstName}`}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={`Hi ${firstName}, I'd like to talk about…`}
                                className="w-full h-32 bg-background border border-border rounded-xl p-3 text-sm text-foreground mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 resize-none transition-all"
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsMessageModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingMessage || !messageText.trim()}
                                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 disabled:opacity-50 flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 shadow-sm cursor-pointer"
                                >
                                    {sendingMessage ? 'Sending…' : <><Send size={14} aria-hidden="true" /> Send Message</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hire Request Modal */}
            {isHireModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-heading text-foreground">Request to Hire {firstName}</h3>
                            <button onClick={() => setIsHireModalOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleHireRequest}>
                            <div className="space-y-4">
                                {/* Subject Selector */}
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-2">Subject(s)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(tutor.subjects) && tutor.subjects.map((subject) => (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSubjects(prev =>
                                                        prev.includes(subject)
                                                            ? prev.filter(s => s !== subject)
                                                            : [...prev, subject]
                                                    );
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                    selectedSubjects.includes(subject)
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-background text-muted-foreground hover:bg-muted border border-border'
                                                }`}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1" htmlFor="hire-message-textarea">Message</label>
                                    <textarea
                                        id="hire-message-textarea"
                                        value={hireMessage}
                                        onChange={(e) => setHireMessage(e.target.value)}
                                        placeholder={`Hi ${firstName}, I'd like to hire you for…`}
                                        maxLength={500}
                                        className="w-full h-24 bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 resize-none transition-all"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1 text-right">{hireMessage.length}/500</p>
                                </div>

                                {/* Proposed Rate */}
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1" htmlFor="proposed-rate-input">Proposed Monthly Rate (৳)</label>
                                    <input
                                        id="proposed-rate-input"
                                        type="number"
                                        value={hireRate}
                                        onChange={(e) => setHireRate(e.target.value)}
                                        placeholder={tutor.expectedSalary ? `e.g. ${tutor.expectedSalary}` : 'e.g. 5000'}
                                        className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 transition-all"
                                    />
                                    {tutor.expectedSalary && (
                                        <p className="text-[10px] text-muted-foreground mt-1">Tutor's listed rate: ৳{tutor.expectedSalary.toLocaleString()}/mo</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsHireModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingHire || !hireMessage.trim()}
                                    className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 shadow-sm cursor-pointer"
                                >
                                    {submittingHire ? 'Sending…' : 'Send Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

        {/* Hire Request Status Modal */}
        {isStatusModalOpen && existingRequest && (
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-card w-full max-w-sm rounded-2xl border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-heading text-foreground">Hire Request Sent</h3>
                        <button onClick={() => setIsStatusModalOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                            &times;
                        </button>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 size={16} aria-hidden="true" />
                            <span>Status: {existingRequest.status === 'countered' ? 'Countered by Tutor' : 'Pending'}</span>
                        </div>
                        {existingRequest.proposedRate && (
                            <div className="flex justify-between text-muted-foreground">
                                <span>Your Proposed Rate</span>
                                <span className="font-semibold text-foreground">৳{existingRequest.proposedRate.toLocaleString()}/mo</span>
                            </div>
                        )}
                        {existingRequest.subjects?.length > 0 && (
                            <div>
                                <span className="text-muted-foreground">Subjects</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {existingRequest.subjects.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-muted rounded-md text-xs font-medium text-foreground">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleCancelRequest}
                            disabled={cancellingRequest}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            <Trash2 size={14} aria-hidden="true" />
                            {cancellingRequest ? 'Cancelling…' : 'Cancel Request'}
                        </button>
                        <button
                            onClick={() => setIsStatusModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-95 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}

        <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action="save this tutor" />
        </>
    );
};

export default TutorDetails;