import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import TutorCard from '../components/shared/TutorCard';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  ArrowRight,
  Send,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import SEO from '../components/shared/SEO';
import { Helmet } from 'react-helmet-async';
import { breadcrumbJsonLd, serializeJsonLd } from '../lib/jsonLd';
import LoginRequiredModal from '../components/shared/LoginRequiredModal';
import Breadcrumb from '../components/shared/Breadcrumb';
import ReportModal from '../components/shared/ReportModal';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton } from '@/components/shared/skeletons';

import TutorProfileHeader from '../components/TutorProfile/TutorProfileHeader';
import TutorConversionSidebar from '../components/TutorProfile/TutorConversionSidebar';
import TutorCredentialsCard from '../components/TutorProfile/TutorCredentialsCard';
import TutorSubjectsBadges from '../components/TutorProfile/TutorSubjectsBadges';
import TutorAvailabilityGrid from '../components/TutorProfile/TutorAvailabilityGrid';
import TutorReviewsSection from '../components/TutorProfile/TutorReviewsSection';
import TutorMobileActionBar from '../components/TutorProfile/TutorMobileActionBar';

function TutorDetailsSkeleton() {
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <Skeleton className="w-36 h-4 rounded-full" />
        {/* Hero banner skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
          <Skeleton className="h-36 w-full" />
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-end gap-4 -mt-12">
              <Skeleton className="size-28 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-48 h-6 rounded-lg" />
                <Skeleton className="w-64 h-4 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>
        </div>

        {/* 2-Column layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton className="p-6 space-y-3">
              <Skeleton className="w-44 h-5 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-5/6 h-4 rounded-lg" />
            </CardSkeleton>
            <CardSkeleton className="p-6 space-y-3">
              <Skeleton className="w-40 h-5 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-xl" />
                ))}
              </div>
            </CardSkeleton>
          </div>
          <div className="space-y-4">
            <CardSkeleton className="p-6 space-y-4">
              <Skeleton className="w-32 h-6 rounded-lg" />
              <Skeleton className="w-full h-11 rounded-xl" />
              <Skeleton className="w-full h-11 rounded-xl" />
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

  useEffect(() => {
    const fetchTutorData = async () => {
      setLoading(true);

      try {
        const promises = [
          api.get(`/api/tutors/${id}`),
          api.get(`/api/tutors/${id}/reviews`).catch((err) => {
            console.warn('Failed to fetch tutor reviews:', err);
            return { data: [] };
          }),
        ];

        if (user?.email) {
          promises.push(
            api.get(`/api/bookings/student/${user.email}`).catch((err) => {
              console.warn('Failed to fetch user bookings:', err);
              return null;
            })
          );
        }

        const results = await Promise.all(promises);
        const tutorRes = results[0];
        const reviewsRes = results[1];
        const bookingsRes = user?.email ? results[2] : null;

        if (tutorRes?.data) {
          setTutor(tutorRes.data);

          if (bookingsRes?.data) {
            const bookingsList = Array.isArray(bookingsRes.data)
              ? bookingsRes.data
              : Array.isArray(bookingsRes.data?.data)
              ? bookingsRes.data.data
              : [];
            const completed = bookingsList.some(
              (b) =>
                b.tutorEmail?.toLowerCase() === tutorRes.data.email?.toLowerCase() &&
                b.status === 'completed'
            );
            setCanReview(completed);
          }
        } else {
          setTutor(null);
        }

        if (reviewsRes?.data) {
          const list = Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : Array.isArray(reviewsRes.data?.data)
            ? reviewsRes.data.data
            : [];
          setReviews(list);
        }
      } catch (error) {
        console.error('Failed to fetch tutor:', error);
        setTutor(null);
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
    api
      .get(`/api/tutors?${params.toString()}`)
      .then((res) => {
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setSimilarTutors(list.filter((tItem) => tItem._id !== tutor._id).slice(0, 3));
      })
      .catch(() => setSimilarTutors([]));
  }, [tutor?._id, tutor?.subjects]);

  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user || !tutor) return;
      try {
        const res = await api.get('/api/hire-requests/sent');
        const active = (res.data?.data || []).find(
          (r) => r.toUserId?._id === tutor._id && ['pending', 'countered'].includes(r.status)
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
      toast.success(t('tutorDetails.toast_hire_cancelled', 'Hire request cancelled'));
      setExistingRequest(null);
      setIsStatusModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || t('tutorDetails.toast_cancel_failed', 'Failed to cancel request'));
    } finally {
      setCancellingRequest(false);
    }
  };

  const handleContact = () => {
    const existingConv = conversations.find((c) =>
      c.participants.some((p) => p._id === tutor._id || p.email === tutor.email)
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
        text: messageText,
      });
      toast.success(t('tutorDetails.toast_message_sent', 'Message sent successfully'));
      setIsMessageModalOpen(false);
      setMessageText('');

      await fetchConversations();
      setTimeout(() => {
        const checkBtn = document.getElementById('contact-tutor-btn');
        if (checkBtn) checkBtn.click();
      }, 500);
    } catch {
      toast.error(t('tutorDetails.toast_message_failed', 'Failed to send message'));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleHireRequest = async (e) => {
    e.preventDefault();
    if (!hireMessage.trim()) {
      toast.error(t('tutorDetails.toast_hire_message_required', 'Please enter a message'));
      return;
    }

    setSubmittingHire(true);
    try {
      const res = await api.post('/api/hire-requests', {
        toUserId: tutor._id,
        message: hireMessage,
        proposedRate: hireRate ? Number(hireRate) : undefined,
        subjects: selectedSubjects,
      });
      toast.success(t('tutorDetails.toast_hire_sent', 'Hire request sent!'));
      const created = res.data?.data || res.data;
      setExistingRequest({
        _id: created._id,
        toUserId: { _id: tutor._id, displayName: tutor.displayName },
        proposedRate: created.proposedRate,
        subjects: created.subjects || selectedSubjects,
        message: created.message || hireMessage,
        status: 'pending',
      });
      setIsHireModalOpen(false);
      setHireMessage('');
      setHireRate('');
      setSelectedSubjects([]);
    } catch (err) {
      toast.error(err.response?.data?.error || t('tutorDetails.toast_hire_failed', 'Failed to send hire request'));
    } finally {
      setSubmittingHire(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast.error(t('tutorDetails.toast_review_required', 'Please write a comment'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/api/tutors/${tutor._id}/reviews`, {
        rating: newReview.rating,
        comment: newReview.comment,
        studentEmail: user?.email || 'anonymous',
      });
      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success(t('tutorDetails.toast_review_submitted', 'Review submitted successfully'));
    } catch {
      toast.error(t('tutorDetails.toast_review_failed', 'Failed to submit review'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <TutorDetailsSkeleton />;

  if (!tutor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-heading text-foreground mb-2">
          {t('tutorDetails.not_found_title', 'Tutor Not Found')}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('tutorDetails.not_found_desc', 'This tutor profile may have been deactivated or removed.')}
        </p>
        <Link
          to="/tutors"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
        >
          {t('tutorDetails.back_to_tutors', 'Back to Tutors')}
        </Link>
      </div>
    );
  }

  const firstName = tutor.displayName ? tutor.displayName.split(' ')[0] : t('tutorDetails.default_name', 'Tutor');

  return (
    <>
      <div className="bg-background min-h-screen pb-24 md:pb-16 pt-6">
        <SEO
          title={t('tutorDetails.seo_title', {
            name: tutor.displayName,
            defaultValue: `${tutor.displayName} - Verified Academic Tutor | eTuitionHub`,
          })}
          description={t('tutorDetails.seo_desc', {
            name: tutor.displayName,
            location: tutor.location,
            subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'Various',
            defaultValue: `Hire ${tutor.displayName} for personalized home & online tuition in ${tutor.location || 'Dhaka'}. Verified qualifications and parent guarantee.`,
          })}
        />
        <Helmet>
          <script type="application/ld+json">
            {
              serializeJsonLd(
                breadcrumbJsonLd([
                  { name: t('nav.find_tutors', 'Find Tutors'), url: '/tutors' },
                  { name: tutor.displayName || 'Tutor', url: `/tutor/${tutor._id}` },
                ])
              ).__html
            }
          </script>
        </Helmet>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <Breadcrumb
            className="mb-4"
            items={[
              { label: t('nav.find_tutors', 'Find Tutors'), to: '/tutors' },
              { label: tutor.displayName || 'Tutor' },
            ]}
          />

          {/* Profile Header (Mesh banner, Avatar, Credibility chips, Share, Save) */}
          <TutorProfileHeader
            tutor={tutor}
            isAuthenticated={!!user}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            reviewCount={reviews.length}
          />

          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Content Area: 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* About & Academic Credentials & Verified Organizations */}
              <TutorCredentialsCard tutor={tutor} />

              {/* Subject Mastery & Curriculums */}
              <TutorSubjectsBadges subjects={tutor.subjects} />

              {/* Delivery Modes & Weekly Schedule Grid */}
              <TutorAvailabilityGrid
                availableDays={tutor.availableDays}
                location={tutor.location}
                thana={tutor.thana}
              />

              {/* Verified Student Reviews */}
              <TutorReviewsSection
                reviews={reviews}
                user={user}
                canReview={canReview}
                newReview={newReview}
                setNewReview={setNewReview}
                onSubmitReview={handleSubmitReview}
                submitting={submitting}
              />
            </div>

            {/* Right Sticky Conversion Rail: 1 Column */}
            <div className="lg:col-span-1">
              <TutorConversionSidebar
                tutor={tutor}
                user={user}
                existingRequest={existingRequest}
                onContact={handleContact}
                onHireRequest={() => setIsHireModalOpen(true)}
                onShowStatusModal={() => setIsStatusModalOpen(true)}
                onRequireLogin={() => setShowLoginModal(true)}
              />
            </div>
          </div>

          {/* Similar Recommended Tutors */}
          {similarTutors.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-heading text-foreground">
                    {t('tutorDetails.similar_tutors', 'Similar Verified Tutors')}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Other qualified tutors available for {Array.isArray(tutor.subjects) ? tutor.subjects[0] : 'similar subjects'}
                  </p>
                </div>
                <Link
                  to="/tutors"
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {t('tutorDetails.view_all', 'View all')} <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similarTutors.map((item) => (
                  <TutorCard key={item._id} tutor={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Fixed Bottom Action Bar */}
        <TutorMobileActionBar
          tutor={tutor}
          user={user}
          existingRequest={existingRequest}
          onContact={handleContact}
          onHireRequest={() => setIsHireModalOpen(true)}
          onShowStatusModal={() => setIsStatusModalOpen(true)}
          onRequireLogin={() => setShowLoginModal(true)}
        />

        {/* Message Modal */}
        {isMessageModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-xl p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {t('tutorDetails.message_title', {
                    firstName,
                    defaultValue: `Send Message to ${firstName}`,
                  })}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  aria-label={t('tutorDetails.close', 'Close')}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={messageText}
                  aria-label={t('tutorDetails.message_aria', {
                    firstName,
                    defaultValue: `Message to ${firstName}`,
                  })}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t('tutorDetails.message_placeholder', {
                    firstName,
                    defaultValue: `Hi ${firstName}, I'm interested in discussing tuition for my child...`,
                  })}
                  className="w-full h-32 bg-background border border-border rounded-xl p-3 text-sm text-foreground mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none transition-all"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                  >
                    {t('tutorDetails.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageText.trim()}
                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    {sendingMessage ? (
                      t('tutorDetails.sending', 'Sending...')
                    ) : (
                      <>
                        <Send className="size-4" aria-hidden="true" />{' '}
                        {t('tutorDetails.send_message', 'Send Message')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hire Request Modal */}
        {isHireModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-xl p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {t('tutorDetails.hire_title', {
                    firstName,
                    defaultValue: `Hire Request for ${firstName}`,
                  })}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsHireModalOpen(false)}
                  aria-label={t('tutorDetails.close', 'Close')}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleHireRequest}>
                <div className="space-y-4">
                  {/* Subject Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      {t('tutorDetails.subject_s', 'Subjects Needed')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(tutor.subjects) &&
                        tutor.subjects.map((subject) => (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => {
                              setSelectedSubjects((prev) =>
                                prev.includes(subject)
                                  ? prev.filter((s) => s !== subject)
                                  : [...prev, subject]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                    <label
                      className="block text-xs font-semibold text-muted-foreground mb-1"
                      htmlFor="hire-message-textarea"
                    >
                      {t('tutorDetails.message_label', 'Requirements & Student Details')}
                    </label>
                    <textarea
                      id="hire-message-textarea"
                      value={hireMessage}
                      onChange={(e) => setHireMessage(e.target.value)}
                      placeholder={t('tutorDetails.hire_placeholder', {
                        firstName,
                        defaultValue: `Mention student class, curriculum, preferred days and requirements...`,
                      })}
                      maxLength={500}
                      className="w-full h-24 bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none transition-all"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1 text-right">
                      {hireMessage.length}/500
                    </p>
                  </div>

                  {/* Proposed Rate */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-muted-foreground mb-1"
                      htmlFor="proposed-rate-input"
                    >
                      {t('tutorDetails.proposed_rate', 'Proposed Monthly Budget (BDT)')}
                    </label>
                    <input
                      id="proposed-rate-input"
                      type="number"
                      value={hireRate}
                      onChange={(e) => setHireRate(e.target.value)}
                      placeholder={
                        tutor.expectedSalary
                          ? `e.g. ${tutor.expectedSalary}`
                          : t('tutorDetails.rate_placeholder', 'e.g. 8000')
                      }
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                    />
                    {tutor.expectedSalary && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {t('tutorDetails.listed_rate', {
                          rate: tutor.expectedSalary.toLocaleString(),
                          defaultValue: `Tutor's expected fee: ৳${tutor.expectedSalary.toLocaleString()}/month`,
                        })}
                      </p>
                    )}
                  </div>

                  {/* SafePay escrow note */}
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex items-start gap-2.5 text-xs text-foreground">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                        Zero Upfront Risk · 100% Parent Guarantee
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        First session is an evaluation demo. Tuition fees are protected through safe escrow and only released after your confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setIsHireModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                  >
                    {t('tutorDetails.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingHire || !hireMessage.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    {submittingHire
                      ? t('tutorDetails.sending', 'Sending...')
                      : t('tutorDetails.send_request', 'Send Hire Request')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hire Request Status Modal */}
        {isStatusModalOpen && existingRequest && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-sm rounded-2xl border border-border/80 shadow-xl p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {t('tutorDetails.hire_request_sent', 'Hire Request Sent')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  aria-label={t('tutorDetails.close', 'Close')}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="size-4.5" />
                  <span>
                    {t('tutorDetails.status_label', 'Status')}:{' '}
                    {existingRequest.status === 'countered'
                      ? t('tutorDetails.status_countered', 'Counter Offer Received')
                      : t('tutorDetails.status_pending', 'Pending Tutor Acceptance')}
                  </span>
                </div>
                {existingRequest.proposedRate && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('tutorDetails.your_proposed_rate', 'Your Proposed Rate')}</span>
                    <span className="font-semibold text-foreground">
                      ৳{existingRequest.proposedRate.toLocaleString()}/mo
                    </span>
                  </div>
                )}
                {existingRequest.subjects?.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">{t('tutorDetails.subjects', 'Subjects')}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {existingRequest.subjects.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-muted rounded-md text-xs font-medium text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelRequest}
                  disabled={cancellingRequest}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-destructive border border-destructive/20 hover:bg-destructive/10 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                  {cancellingRequest
                    ? t('tutorDetails.cancelling', 'Cancelling...')
                    : t('tutorDetails.cancel_request', 'Cancel Request')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
                >
                  {t('tutorDetails.close', 'Close')}
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

        <LoginRequiredModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          action={t('tutorDetails.save_this_tutor', 'hire or message this tutor')}
        />
      </div>
    </>
  );
};

export default TutorDetails;