import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Send,
  CheckCircle2,
  Sparkles,
  Lock,
  Clock,
  Home,
  Laptop,
  Check,
} from 'lucide-react';

const TutorConversionSidebar = ({
  tutor,
  user,
  existingRequest,
  onContact,
  onHireRequest,
  onShowStatusModal,
  onRequireLogin,
}) => {
  const { t } = useTranslation();

  const monthlyFee = tutor.expectedSalary;
  const estimatedPerSession = monthlyFee ? Math.round(monthlyFee / 12) : null;

  return (
    <aside className="space-y-4 lg:sticky lg:top-20">
      {/* Primary Conversion Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        {/* Price display */}
        <div className="pb-5 border-b border-border/70">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {t('tutorDetails.expected_tuition_fee', 'Expected Tuition Fee')}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-heading text-foreground">
              {monthlyFee ? `৳${monthlyFee.toLocaleString()}` : t('tutorDetails.negotiable', 'Negotiable')}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {monthlyFee ? '/ month' : ''}
            </span>
          </div>

          {estimatedPerSession && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              <span>
                ~৳{estimatedPerSession.toLocaleString()} / session (based on 3 days/week)
              </span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="py-5 space-y-2.5">
          {!user ? (
            <>
              <button
                type="button"
                onClick={onRequireLogin}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Sparkles className="size-4" />
                {t('tutorDetails.request_to_hire', 'Request to Hire')}
              </button>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/15 text-primary font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 text-center"
              >
                <Send className="size-4" />
                {t('tutorDetails.login_to_message', 'Login to Message')}
              </Link>
            </>
          ) : existingRequest ? (
            <>
              <button
                type="button"
                onClick={onShowStatusModal}
                className="w-full py-3 px-4 bg-primary/10 text-primary font-semibold rounded-xl text-sm transition-all border border-primary/25 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/15 active:scale-98"
              >
                <CheckCircle2 className="size-4.5" />
                {t('tutorDetails.hire_request_sent', 'Hire Request Sent')}
              </button>
              <button
                type="button"
                id="contact-tutor-btn"
                onClick={onContact}
                className="w-full py-2.5 px-4 border border-border hover:bg-muted font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 text-foreground cursor-pointer active:scale-98"
              >
                <Send className="size-4" />
                {t('tutorDetails.message', 'Send Message')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onHireRequest}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Sparkles className="size-4" />
                {t('tutorDetails.request_to_hire', 'Request to Hire')}
              </button>
              <button
                type="button"
                id="contact-tutor-btn"
                onClick={onContact}
                className="w-full py-2.5 px-4 border border-border hover:bg-muted font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 text-foreground cursor-pointer active:scale-98"
              >
                <Send className="size-4" />
                {t('tutorDetails.message', 'Send Message')}
              </button>
            </>
          )}
        </div>

        {/* Quick Tutoring Highlights */}
        <div className="pt-4 border-t border-border/70 space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Responds quickly: <strong>Within ~1 hour</strong></span>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <Home className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Home tutoring available in <strong>{tutor.location?.split(',')[0] || tutor.thana || 'Local area'}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <Laptop className="size-4 text-blue-500 shrink-0" />
            <span>Online 1-on-1 sessions via video classroom</span>
          </div>
        </div>
      </div>

      {/* Parent Guarantee Trust Card */}
      <div className="rounded-2xl border border-success/30 bg-success/5 dark:bg-success/10 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-success/10 text-success shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold font-heading text-foreground">
              {t('tutorDetails.guarantee_title', '100% Parent Guarantee')}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('tutorDetails.guarantee_desc', 'Your first trial session is risk-free. Fees are held in verified escrow until you confirm satisfaction.')}
            </p>
          </div>
        </div>

        <ul className="mt-3.5 space-y-1.5 pt-3 border-t border-success/20 text-xs text-foreground/80">
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-success shrink-0" />
            <span>Verified NID & Academic Degrees</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-success shrink-0" />
            <span>Free 1st Trial Demonstration</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-success shrink-0" />
            <span>Flexible replacement if unsatisfied</span>
          </li>
        </ul>

        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Lock className="size-3" />
            <span>Bank-grade Escrow Security</span>
          </span>
          <span className="font-semibold text-success">eTuitionHub SafePay™</span>
        </div>
      </div>
    </aside>
  );
};

TutorConversionSidebar.propTypes = {
  tutor: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    expectedSalary: PropTypes.number,
    location: PropTypes.string,
    thana: PropTypes.string,
    responseTimeMinutes: PropTypes.number,
  }).isRequired,
  user: PropTypes.object,
  existingRequest: PropTypes.object,
  onContact: PropTypes.func.isRequired,
  onHireRequest: PropTypes.func.isRequired,
  onShowStatusModal: PropTypes.func.isRequired,
  onRequireLogin: PropTypes.func.isRequired,
};

export default TutorConversionSidebar;
