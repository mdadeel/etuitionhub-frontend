import { ShieldCheck, BadgeCheck, Star } from 'lucide-react';

const STATUS_BADGES = {
  pending_review:  { label: 'Pending Review',  className: 'bg-amber-50 text-amber-700 border-amber-200' },
  action_required: { label: 'Action Required', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  unverified:      { label: 'Unverified',      className: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const TrustBadges = ({ tutor }) => {
  if (!tutor) return null;
  const statusBadge = STATUS_BADGES[tutor.verificationStatus];
  return (
    <div className="flex flex-wrap gap-1.5">
      {statusBadge && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      )}
      {tutor.nidVerified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck size={12} /> NID verified
        </span>
      )}
      {tutor.verifiedReviewsCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Star size={12} /> {tutor.verifiedReviewsCount} verified review{tutor.verifiedReviewsCount === 1 ? '' : 's'}
        </span>
      )}
      {tutor.credentialVerified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-200">
          <BadgeCheck size={12} /> Degree verified
        </span>
      )}
    </div>
  );
};

export default TrustBadges;
