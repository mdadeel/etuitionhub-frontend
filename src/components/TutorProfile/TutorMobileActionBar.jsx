import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorMobileActionBar = ({
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

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border p-3 shadow-lg flex items-center justify-between gap-3">
      {/* Price info */}
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider leading-tight">
          {t('tutorDetails.monthly_fee', 'Monthly Fee')}
        </p>
        <p className="text-base font-bold font-heading text-foreground truncate">
          {monthlyFee ? `৳${monthlyFee.toLocaleString()}` : t('tutorDetails.negotiable', 'Negotiable')}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {!user ? (
          <>
            <Link
              to="/login"
              className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="size-4" />
              <span>{t('tutorDetails.message', 'Message')}</span>
            </Link>
            <button
              type="button"
              onClick={onRequireLogin}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="size-4" />
              <span>{t('tutorDetails.request_to_hire', 'Hire Tutor')}</span>
            </button>
          </>
        ) : existingRequest ? (
          <>
            <button
              type="button"
              onClick={onContact}
              className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="size-4" />
              <span>{t('tutorDetails.message', 'Message')}</span>
            </button>
            <button
              type="button"
              onClick={onShowStatusModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <CheckCircle2 className="size-4" />
              <span>{t('tutorDetails.sent', 'Request Sent')}</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onContact}
              className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="size-4" />
              <span>{t('tutorDetails.message', 'Message')}</span>
            </button>
            <button
              type="button"
              onClick={onHireRequest}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="size-4" />
              <span>{t('tutorDetails.request_to_hire', 'Hire Tutor')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

TutorMobileActionBar.propTypes = {
  tutor: PropTypes.shape({
    expectedSalary: PropTypes.number,
  }).isRequired,
  user: PropTypes.object,
  existingRequest: PropTypes.object,
  onContact: PropTypes.func.isRequired,
  onHireRequest: PropTypes.func.isRequired,
  onShowStatusModal: PropTypes.func.isRequired,
  onRequireLogin: PropTypes.func.isRequired,
};

export default TutorMobileActionBar;
