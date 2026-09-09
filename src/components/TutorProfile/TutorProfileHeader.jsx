import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/avatar';
import SaveButton from '../Dashboard/SaveButton';
import {
  GraduationCap,
  MapPin,
  Star,
  ShieldCheck,
  Share2,
  Flag,
  Globe,
  Award,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TutorProfileHeader = ({
  tutor,
  isAuthenticated,
  onOpenReportModal,
  reviewCount = 0,
}) => {
  const { t } = useTranslation();

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${tutor.displayName || 'Tutor'} | eTuitionHub`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${tutor.displayName || 'this tutor'}'s profile on eTuitionHub!`,
          url,
        });
      } catch {
        // User dismissed or cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t('tutorDetails.link_copied', 'Profile link copied to clipboard!'));
      } catch {
        toast.error(t('tutorDetails.copy_failed', 'Failed to copy link'));
      }
    }
  };

  const isVerified =
    tutor.isVerified ||
    tutor.verificationStatus === 'verified_basic' ||
    tutor.verificationStatus === 'verified_premium' ||
    tutor.verificationStatus === 'verified';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm mb-6">
      {/* Editorial Decorative Mesh Banner */}
      <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-primary/15 via-primary/5 to-accent/20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:opacity-15" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <SaveButton
            type="tutor"
            id={tutor._id}
            isAuthenticated={isAuthenticated}
            className="p-2.5 rounded-xl bg-background/80 backdrop-blur border border-border/60 hover:bg-background text-foreground shadow-sm transition-all"
          />
          <button
            type="button"
            onClick={handleShare}
            aria-label={t('common.share', 'Share Profile')}
            title={t('common.share', 'Share Profile')}
            className="p-2.5 rounded-xl bg-background/80 backdrop-blur border border-border/60 hover:bg-background text-foreground shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Identity Body */}
      <div className="px-5 sm:px-8 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
          {/* Avatar Container with Overlap */}
          <div className="flex items-end gap-4">
            <div className="relative size-24 sm:size-32 rounded-2xl overflow-hidden border-4 border-card bg-muted shadow-md shrink-0">
              <Avatar
                src={tutor.photoURL}
                alt={tutor.displayName || 'Tutor'}
                gender={tutor.gender}
                className="size-full rounded-none object-cover"
              />
            </div>

          </div>
        </div>

        {/* Name & Academic Credentials */}
        <div className="space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground tracking-tight inline-flex items-center gap-2">
                <span>{tutor.displayName || t('tutorDetails.default_name', 'Tutor')}</span>
                {isVerified && (
                  <span
                    className="inline-flex items-center justify-center size-6 rounded-full bg-primary text-white ring-2 ring-card shadow-sm shrink-0"
                    title={t('tutorDetails.verified_tutor', 'Verified Tutor')}
                  >
                    <ShieldCheck className="size-3.5" />
                  </span>
                )}
              </h1>
              {tutor.gender && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">
                  {tutor.gender}
                </span>
              )}
            </div>

            <p className="text-base text-foreground/90 font-medium flex items-center gap-2 mt-1">
              <GraduationCap className="size-4.5 text-primary shrink-0" />
              <span>{tutor.qualification || t('tutorDetails.default_qualification', 'Academic Tutor')}</span>
            </p>
          </div>

          {/* Location & Metadata Chips */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <strong className="font-medium text-foreground">
                {tutor.location || tutor.thana || t('tutorDetails.na', 'Location on request')}
              </strong>
            </span>

            {tutor.languagePreference && (
              <span className="flex items-center gap-1.5">
                <Globe className="size-3.5 text-primary shrink-0" />
                <span className="capitalize">
                  {tutor.languagePreference === 'both' ? 'English & Bengali' : tutor.languagePreference}
                </span>
              </span>
            )}

            {tutor.experience && (
              <span className="flex items-center gap-1.5">
                <Award className="size-3.5 text-amber-500 shrink-0" />
                <span>{tutor.experience}</span>
              </span>
            )}

            {tutor.trustScore ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary shrink-0" />
                <span>Trust Score: <strong>{tutor.trustScore}/100</strong></span>
              </span>
            ) : null}
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/70">
            <div className="rounded-xl bg-muted/30 dark:bg-muted/15 p-3 border border-border/40">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('tutorDetails.rating', 'Rating')}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-lg font-bold font-heading text-foreground">
                  {tutor.ratings > 0 ? Number(tutor.ratings).toFixed(1) : t('tutorDetails.new', 'New')}
                </span>
                <Star className="size-4 fill-warning text-warning" />
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
            </div>

            <div className="rounded-xl bg-muted/30 dark:bg-muted/15 p-3 border border-border/40">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('tutorDetails.monthly_fee', 'Monthly Fee')}
              </p>
              <p className="text-lg font-bold font-heading text-primary mt-0.5">
                ৳{tutor.expectedSalary ? tutor.expectedSalary.toLocaleString() : t('tutorDetails.negotiable', 'Negotiable')}
              </p>
            </div>

            <div className="rounded-xl bg-muted/30 dark:bg-muted/15 p-3 border border-border/40">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('tutorDetails.experience', 'Experience')}
              </p>
              <p className="text-sm sm:text-base font-bold font-heading text-foreground mt-0.5 truncate" title={tutor.experience}>
                {tutor.experience || t('tutorDetails.experienced', 'Experienced')}
              </p>
            </div>

            <div className="rounded-xl bg-muted/30 dark:bg-muted/15 p-3 border border-border/40">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('tutorDetails.response_time', 'Response Time')}
              </p>
              <p className="text-sm sm:text-base font-bold font-heading text-emerald-600 dark:text-emerald-400 mt-0.5">
                {tutor.responseTimeMinutes ? `< ${tutor.responseTimeMinutes} min` : '~1 Hour'}
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Flag className="size-3" />
              {t('tutorDetails.report', 'Report profile')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TutorProfileHeader.propTypes = {
  tutor: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    qualification: PropTypes.string,
    photoURL: PropTypes.string,
    gender: PropTypes.string,
    location: PropTypes.string,
    thana: PropTypes.string,
    languagePreference: PropTypes.string,
    experience: PropTypes.string,
    ratings: PropTypes.number,
    expectedSalary: PropTypes.number,
    verificationStatus: PropTypes.string,
    isVerified: PropTypes.bool,
    requestsReceived: PropTypes.number,
    requestsRespondedCount: PropTypes.number,
    reviewCount: PropTypes.number,
    trustScore: PropTypes.number,
    responseTimeMinutes: PropTypes.number,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onOpenReportModal: PropTypes.func.isRequired,
  reviewCount: PropTypes.number,
};

export default TutorProfileHeader;
