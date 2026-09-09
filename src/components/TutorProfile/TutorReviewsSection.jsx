import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Star, ShieldCheck, MessageSquarePlus } from 'lucide-react';

const TutorReviewsSection = ({
  reviews = [],
  user,
  canReview,
  newReview,
  setNewReview,
  onSubmitReview,
  submitting,
}) => {
  const { t } = useTranslation();

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : '0.0';

  // Calculate 5-star distribution
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    counts[star] = (counts[star] || 0) + 1;
  });

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/70">
        <div>
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <Star className="size-5 text-warning fill-warning" />
            <span>
              {t('tutorDetails.reviews_heading', 'Verified Student & Parent Reviews')} ({totalReviews})
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real feedback from completed tuition sessions and trial classes
          </p>
        </div>
      </div>

      {/* Aggregate Score & Rating Distribution Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-muted/20 border border-border/60">
        {/* Big Score Box */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/60">
          <div className="text-4xl sm:text-5xl font-extrabold font-heading text-foreground">
            {avgRating}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`size-4 sm:size-5 ${
                  s <= Math.round(Number(avgRating))
                    ? 'text-warning fill-warning'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalReviews > 0
              ? `Based on ${totalReviews} verified ratings`
              : 'No reviews submitted yet'}
          </p>
        </div>

        {/* 5-Star Breakdown Bars */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = counts[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 text-foreground font-semibold flex items-center gap-1 justify-end">
                  <span>{stars}</span>
                  <Star className="size-3 fill-warning text-warning" />
                </span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-muted-foreground font-medium">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => {
            const reviewerName =
              review.studentName ||
              (review.studentEmail
                ? review.studentEmail.split('@')[0].slice(0, 3) + '***'
                : 'Verified Student');

            return (
              <div
                key={review._id || idx}
                className="p-4 rounded-xl border border-border/60 bg-card hover:border-border transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <span>{reviewerName}</span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          <ShieldCheck className="size-3" />
                          <span>Verified Student</span>
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent session'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-warning">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-foreground/85 leading-relaxed pt-1">
                  {review.comment}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border/80">
            <p className="text-sm font-medium text-foreground">
              {t('tutorDetails.no_reviews', 'No student reviews yet')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first verified student to complete a session and leave feedback for this tutor!
            </p>
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      {user && canReview ? (
        <form onSubmit={onSubmitReview} className="pt-5 border-t border-border/70 space-y-3">
          <h4 className="text-sm font-bold font-heading text-foreground flex items-center gap-1.5">
            <MessageSquarePlus className="size-4 text-primary" />
            {t('tutorDetails.write_review', 'Leave a Verified Review')}
          </h4>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="review-stars-input">
              {t('tutorDetails.rating_label', 'Your Rating')}:
            </label>
            <select
              id="review-stars-input"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })
              }
              className="border border-border rounded-lg px-2.5 py-1 text-sm bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Stars {'★'.repeat(n)}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder={t(
              'tutorDetails.review_placeholder',
              'Share your experience with teaching style, punctuality, and concept explanations...'
            )}
            className="w-full border border-border rounded-xl p-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            rows={3}
          />

          <button
            type="submit"
            disabled={submitting || !newReview.comment.trim()}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 disabled:opacity-50 transition-all cursor-pointer active:scale-98 shadow-sm"
          >
            {submitting
              ? t('tutorDetails.submitting', 'Submitting...')
              : t('tutorDetails.submit_review', 'Submit Verified Review')}
          </button>
        </form>
      ) : user ? (
        <div className="pt-4 border-t border-border/70 text-center text-xs text-muted-foreground">
          {t(
            'tutorDetails.review_restriction',
            'Reviews are restricted to students who have completed at least one confirmed session with this tutor.'
          )}
        </div>
      ) : null}
    </div>
  );
};

TutorReviewsSection.propTypes = {
  reviews: PropTypes.array,
  user: PropTypes.object,
  canReview: PropTypes.bool,
  newReview: PropTypes.shape({
    rating: PropTypes.number,
    comment: PropTypes.string,
  }).isRequired,
  setNewReview: PropTypes.func.isRequired,
  onSubmitReview: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default TutorReviewsSection;
