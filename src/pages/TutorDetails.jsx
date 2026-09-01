import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import TutorCard from '../components/shared/TutorCard';
import toast from 'react-hot-toast';
import api from '../services/api';
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
    GraduationCap,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import { Helmet } from 'react-helmet-async';
import {
    breadcrumbJsonLd,
    serializeJsonLd,
} from '../lib/jsonLd';
import LoginRequiredModal from '../components/shared/LoginRequiredModal';
import WhatsAppShareButton from '../components/shared/WhatsAppShareButton';
import Breadcrumb from '../components/shared/Breadcrumb';
import ReportModal from '../components/shared/ReportModal';
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, CircleSkeleton } from "@/components/shared/skeletons";
import CredibilityBadge from '@/components/CredibilityBadge';
import SaveButton from '../components/Dashboard/SaveButton';

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
    const { t } = useTranslation();
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
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Report Tutor State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Hire Request State
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hireMessage, setHireMessage] = useState('');
    const [hireRate, setHireRate] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [submittingHire, setSubmittingHire] = useState(false);
    const [existingRequest, setExistingRequest] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [cancellingRequest, setCancellingRequest] = useState(false);
    const [similarTutors, setSimilarTutors] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTutorData = async () => {
            setLoading(true);

            try {
                // Concurrently fetch tutor profile, reviews, and booking eligibility (eliminating waterfalls)
                const promises = [
                    api.get(`/api/tutors/${id}`),
                    api.get(`/api/tutors/${id}/reviews`)
                ];

                if (user) {
                    promises.push(api.get(`/api/bookings/student/${user.email}`));
                }

                const results = await Promise.all(promises);
                const tutorRes = results[0];
                const reviewsRes = results[1];
                const bookingsRes = user ? results[2] : null;

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
            } catch (error) {
                console.error("Failed to fetch tutor:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTutorData();
        }
    }, [id, user]);

    useEffect(() => {
        if (!tutor?._id) return;
        const subject = Array.isArray(tutor.subjects) ? tutor.subjects[0] : undefined;
        const params = new URLSearchParams({ limit: '4' });
        if (subject) params.append('subject', subject);
        api.get(`/api/tutors?${params.toString()}`)
            .then(res => {
                const list = Array.isArray(res.data?.data) ? res.data.data : [];
                setSimilarTutors(list.filter(t => t._id !== tutor._id).slice(0, 3));
            })
            .catch(() => setSimilarTutors([]));
    }, [tutor?._id, tutor?.subjects]);

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
            toast.success(t('tutorDetails.toast_hire_cancelled'));
            setExistingRequest(null);
            setIsStatusModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.error || t('tutorDetails.toast_cancel_failed'));
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
            toast.success(t('tutorDetails.toast_message_sent'));
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
            toast.error(t('tutorDetails.toast_message_failed'));
        } finally {
            setSendingMessage(false);
        }
    };

    const handleHireRequest = async (e) => {
        e.preventDefault();
        if (!hireMessage.trim()) {
            toast.error(t('tutorDetails.toast_hire_message_required'));
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
            toast.success(t('tutorDetails.toast_hire_sent'));
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
            toast.error(err.response?.data?.error || t('tutorDetails.toast_hire_failed'));
        } finally {
            setSubmittingHire(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) {
            toast.error(t('tutorDetails.toast_review_required'));
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
            toast.success(t('tutorDetails.toast_review_submitted'));
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.error(t('tutorDetails.toast_review_failed'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <TutorDetailsSkeleton />;

    if (!tutor) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-heading text-foreground mb-2">{t('tutorDetails.not_found_title')}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t('tutorDetails.not_found_desc')}</p>
                <Link to="/tutors" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    {t('tutorDetails.back_to_tutors')}
                </Link>
            </div>
        );
    }

    const firstName = tutor.displayName ? tutor.displayName.split(' ')[0] : t('tutorDetails.default_name');

    return (
        <>
        <div className="bg-background min-h-screen py-8">
            <SEO
                title={t('tutorDetails.seo_title', { name: tutor.displayName })}
                description={t('tutorDetails.seo_desc', { name: tutor.displayName, location: tutor.location, subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'Various' })}
            />
            <Helmet>
                <script type="application/ld+json">
                    {serializeJsonLd(breadcrumbJsonLd([
                        { name: t('nav.find_tutors', 'Find Tutors'), url: '/tutors' },
                        { name: tutor.displayName || 'Tutor', url: `/tutor/${tutor._id}` },
                    ])).__html}
                </script>
            </Helmet>
            <div className="max-w-6xl mx-auto px-4">
                <Breadcrumb
                    className="mb-4"
                    items={[
                        { label: t('nav.home', 'Home'), to: '/' },
                        { label: t('nav.find_tutors', 'Find Tutors'), to: '/tutors' },
                        { label: tutor.displayName || 'Tutor' },
                    ]}
                />

                <div className="space-y-4">
                    {/* Identity Card */}
                    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-center">
                            {/* Left Column: Avatar & Primary Content */}
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
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="text-center sm:text-left">
                                            <h1 className="text-xl sm:text-2xl font-heading text-foreground mb-1">
                                                {tutor.displayName || t('tutorDetails.default_name')}
                                            </h1>
                                            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                                                <GraduationCap size={16} className="text-primary" aria-hidden="true" />
                                                {tutor.qualification || t('tutorDetails.default_qualification')}
                                            </p>
                                        </div>

                                        <CredibilityBadge
                                            verificationStatus={tutor.verificationStatus}
                                            requestsReceived={tutor.requestsReceived || 0}
                                            requestsRespondedCount={tutor.requestsRespondedCount || 0}
                                            reviewCount={tutor.reviewCount || 0}
                                            rating={tutor.ratings || 0}
                                        />
                                    </div>

                                    {/* CTA section */}
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex-1 min-w-[120px]">
                                                {!user ? (
                                                    <Link to="/login" className="block w-full px-4 py-2 bg-primary text-white hover:bg-primary/90 font-semibold rounded-xl text-xs sm:text-sm transition-all text-center shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-98">
                                                        {t('tutorDetails.login_to_message')}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        id="contact-tutor-btn"
                                                        onClick={handleContact}
                                                        className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
                                                    >
                                                        <Send size={14} aria-hidden="true" /> {t('tutorDetails.message')}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-[120px]">
                                                {!user ? (
                                                    <button onClick={() => setShowLoginModal(true)} className="w-full px-4 py-2 bg-success text-white font-semibold rounded-xl hover:bg-success flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background">
                                                        {t('tutorDetails.request_to_hire')}
                                                    </button>
                                                ) : existingRequest ? (
                                                    <button
                                                        onClick={() => setIsStatusModalOpen(true)}
                                                        className="w-full px-4 py-2 bg-success/15 dark:bg-success/30 text-success dark:text-success/80 font-semibold rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
                                                    >
                                                        <CheckCircle2 size={14} aria-hidden="true" /> {t('tutorDetails.sent')}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsHireModalOpen(true)}
                                                        className="w-full px-4 py-2 bg-success text-white font-semibold rounded-xl hover:bg-success flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
                                                    >
                                                        {t('tutorDetails.request_to_hire')}
                                                    </button>
                                                )}
                                            </div>
                                            <SaveButton type="tutor" id={tutor._id} isAuthenticated={!!user} />
                                            <WhatsAppShareButton 
                                                tutor={tutor} 
                                                className="p-2 border rounded-xl shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background hover:bg-muted/50 dark:hover:bg-muted/20 hover:text-success dark:hover:text-success hover:border-success/30 dark:hover:border-success/30" 
                                                variant="outline" 
                                                iconOnly={true} 
                                            />
                                            <button
                                                onClick={() => setIsReportModalOpen(true)}
                                                className="text-[11px] font-semibold text-muted-foreground hover:text-destructive underline-offset-2 hover:underline px-1 cursor-pointer transition-colors"
                                                aria-label={t('tutorDetails.report')}
                                            >
                                                {t('tutorDetails.report')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* stats Column with 2x2 grid */}
                            <div className="lg:w-80 lg:shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-border lg:pl-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-lg transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('tutorDetails.monthly_fee')}</p>
                                        <p className="text-base sm:text-lg font-heading text-foreground font-bold">৳{tutor.expectedSalary || t('tutorDetails.negotiable')}</p>
                                    </div>
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-lg transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('tutorDetails.experience')}</p>
                                        <p className="text-base sm:text-lg font-heading text-foreground font-bold truncate" title={tutor.experience}>{tutor.experience || t('tutorDetails.not_specified')}</p>
                                    </div>
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-lg transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('tutorDetails.rating')}</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-base sm:text-lg font-heading text-foreground font-bold">{tutor.ratings > 0 ? tutor.ratings : t('tutorDetails.new')}</p>
                                            <Star size={14} className="fill-warning text-warning" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="bg-muted/40 dark:bg-muted/15 border border-border/50 p-3.5 rounded-lg transition-all duration-300 hover:border-primary/20">
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('tutorDetails.location')}</p>
                                        <p className="text-base sm:text-lg font-heading text-foreground font-bold truncate flex items-center gap-1" title={tutor.location || t('tutorDetails.na')}>
                                            <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
                                            <span>{(tutor.location || t('tutorDetails.na')).split(',')[0]}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects & Availability */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card p-6 rounded-lg border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                <Award size={14} className="text-primary" aria-hidden="true" /> {t('tutorDetails.subjects')}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(tutor.subjects) ? tutor.subjects.map((subject, idx) => (
                                    <span key={idx} className="bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-100 border border-border/40 dark:border-neutral-800 px-3 py-1 rounded-lg text-xs font-medium">
                                        {subject}
                                    </span>
                                )) : (
                                    <span className="text-muted-foreground text-xs">{t('tutorDetails.no_subjects')}</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                                <Calendar size={14} className="text-primary" aria-hidden="true" /> {t('tutorDetails.availability')}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(tutor.availableDays) ? tutor.availableDays.map((day, idx) => (
                                    <span key={idx} className="bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-100 border border-border/40 dark:border-neutral-800 px-3 py-1 rounded-lg text-xs font-medium">
                                        {day}
                                    </span>
                                )) : (
                                    <span className="text-muted-foreground text-xs">{t('tutorDetails.contact_availability')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-card p-6 rounded-lg border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">{t('tutorDetails.about_title')}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('tutorDetails.about_p1', {
                                name: tutor.displayName,
                                subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : t('tutorDetails.their_field'),
                                experience: tutor.experience || t('tutorDetails.years'),
                                location: tutor.location || t('tutorDetails.their_area'),
                            })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                            {t('tutorDetails.about_p2', { firstName })}
                        </p>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-card p-6 rounded-lg border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                        <h3 className="text-lg font-heading mb-4 flex items-center gap-2">
                            {t('tutorDetails.reviews_title', { count: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0' })}
                        </h3>

                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review._id} className="p-4 border border-border/60 rounded-xl bg-muted/20">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground truncate max-w-[140px] sm:max-w-none" title={review.studentEmail}>{review.studentEmail}</span>
                                            <span className="text-warning" aria-label={t('tutorDetails.stars_aria', { rating: review.rating })}>{'★'.repeat(review.rating)}</span>
                                        </div>
                                        <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">{t('tutorDetails.no_reviews')}</p>
                        )}

                        {user && canReview ? (
                            <form onSubmit={handleSubmitReview} className="mt-6 pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">{t('tutorDetails.write_review')}</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <label className="text-sm text-muted-foreground" htmlFor="review-rating-select">{t('tutorDetails.rating_label')}</label>
                                    <select 
                                        id="review-rating-select"
                                        value={newReview.rating} 
                                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                        className="border border-border rounded-lg px-2 py-1 text-sm bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background cursor-pointer"
                                    >
                                        {[1,2,3,4,5].map(n => (
                                            <option key={n} value={n}>{n} ★</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    value={newReview.comment}
                                    aria-label={t('tutorDetails.review_comments_aria')}
                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    placeholder={t('tutorDetails.review_placeholder')}
                                    className="w-full border border-border rounded-xl p-3 text-sm mb-3 bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
                                    rows={3}
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 cursor-pointer"
                                >
                                    {submitting ? t('tutorDetails.submitting') : t('tutorDetails.submit_review')}
                                </button>
                            </form>
                        ) : user && (
                            <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                                {t('tutorDetails.review_restriction')}
                            </div>
                        )}
                    </div>
                </div>

                    {similarTutors.length > 0 && (
                        <>
                            <div className="mt-8 pt-6 border-t border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-heading text-foreground">{t('tutorDetails.similar_tutors')}</h2>
                                    </div>
                                    <Link to="/tutors" className="text-sm text-primary hover:underline flex items-center gap-1">
                                        {t('tutorDetails.view_all')} <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {similarTutors.map((item) => (
                                        <TutorCard key={item._id} tutor={item} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
            </div>

            {/* Message Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-heading text-foreground">{t('tutorDetails.message_title', { firstName })}</h3>
                            <button onClick={() => setIsMessageModalOpen(false)} aria-label={t('tutorDetails.close')} className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSendMessage}>
                            <textarea
                                value={messageText}
                                aria-label={t('tutorDetails.message_aria', { firstName })}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={t('tutorDetails.message_placeholder', { firstName })}
                                className="w-full h-32 bg-background border border-border rounded-xl p-3 text-sm text-foreground mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background resize-none transition-all"
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsMessageModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 cursor-pointer"
                                >
                                    {t('tutorDetails.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingMessage || !messageText.trim()}
                                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 disabled:opacity-50 flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 shadow-sm cursor-pointer"
                                >
                                    {sendingMessage ? t('tutorDetails.sending') : <><Send size={14} aria-hidden="true" /> {t('tutorDetails.send_message')}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hire Request Modal */}
            {isHireModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-heading text-foreground">{t('tutorDetails.hire_title', { firstName })}</h3>
                            <button onClick={() => setIsHireModalOpen(false)} aria-label={t('tutorDetails.close')} className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleHireRequest}>
                            <div className="space-y-4">
                                {/* Subject Selector */}
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-2">{t('tutorDetails.subject_s')}</label>
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
                                                        ? 'bg-success text-white'
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
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1" htmlFor="hire-message-textarea">{t('tutorDetails.message_label')}</label>
                                    <textarea
                                        id="hire-message-textarea"
                                        value={hireMessage}
                                        onChange={(e) => setHireMessage(e.target.value)}
                                        placeholder={t('tutorDetails.hire_placeholder', { firstName })}
                                        maxLength={500}
                                        className="w-full h-24 bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background resize-none transition-all"
                                    />
                                    <p className="text-[11px] text-muted-foreground mt-1 text-right">{hireMessage.length}/500</p>
                                </div>

                                {/* Proposed Rate */}
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1" htmlFor="proposed-rate-input">{t('tutorDetails.proposed_rate')}</label>
                                    <input
                                        id="proposed-rate-input"
                                        type="number"
                                        value={hireRate}
                                        onChange={(e) => setHireRate(e.target.value)}
                                        placeholder={tutor.expectedSalary ? `e.g. ${tutor.expectedSalary}` : t('tutorDetails.rate_placeholder')}
                                        className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background transition-all"
                                    />
                                    {tutor.expectedSalary && (
                                        <p className="text-[11px] text-muted-foreground mt-1">{t('tutorDetails.listed_rate', { rate: tutor.expectedSalary.toLocaleString() })}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsHireModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 cursor-pointer"
                                >
                                    {t('tutorDetails.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingHire || !hireMessage.trim()}
                                    className="px-5 py-2.5 bg-success text-white text-sm font-semibold rounded-xl hover:bg-success disabled:opacity-50 flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 shadow-sm cursor-pointer"
                                >
                                    {submittingHire ? t('tutorDetails.sending') : t('tutorDetails.send_request')}
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
                <div className="bg-card w-full max-w-sm rounded-lg border border-border/80 shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-heading text-foreground">{t('tutorDetails.hire_request_sent')}</h3>
                        <button onClick={() => setIsStatusModalOpen(false)} aria-label={t('tutorDetails.close')} className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                            &times;
                        </button>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-success dark:text-success font-semibold">
                            <CheckCircle2 size={16} aria-hidden="true" />
                            <span>{t('tutorDetails.status_label')}: {existingRequest.status === 'countered' ? t('tutorDetails.status_countered') : t('tutorDetails.status_pending')}</span>
                        </div>
                        {existingRequest.proposedRate && (
                            <div className="flex justify-between text-muted-foreground">
                                <span>{t('tutorDetails.your_proposed_rate')}</span>
                                <span className="font-semibold text-foreground">৳{existingRequest.proposedRate.toLocaleString()}/mo</span>
                            </div>
                        )}
                        {existingRequest.subjects?.length > 0 && (
                            <div>
                                <span className="text-muted-foreground">{t('tutorDetails.subjects')}</span>
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
                            className="flex-1 px-4 py-2 text-sm font-semibold text-destructive dark:text-destructive border border-destructive/20 dark:border-destructive/40 hover:bg-destructive/10 dark:hover:bg-destructive/15 rounded-xl transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            <Trash2 size={14} aria-hidden="true" />
                            {cancellingRequest ? t('tutorDetails.cancelling') : t('tutorDetails.cancel_request')}
                        </button>
                        <button
                            onClick={() => setIsStatusModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background active:scale-95 cursor-pointer"
                        >
                            {t('tutorDetails.close')}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Report Tutor Modal */}
        <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            reportedId={tutor._id}
        />

        <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} action={t('tutorDetails.save_this_tutor')} />
        </>
    );
};

export default TutorDetails;