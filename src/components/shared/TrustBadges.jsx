import { ShieldCheck, BadgeCheck, Star } from 'lucide-react';
import StatusBadge from './StatusBadge';

const TrustBadges = ({ tutor }) => {
  if (!tutor) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tutor.verificationStatus && (
        <StatusBadge status={tutor.verificationStatus} size="sm" />
      )}
      {tutor.nidVerified && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-px text-[9px] font-medium rounded-full bg-success/15 text-success border border-success/20">
          <ShieldCheck size={10} /> NID verified
        </span>
      )}
      {tutor.verifiedReviewsCount > 0 && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-px text-[9px] font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          <Star size={10} /> {tutor.verifiedReviewsCount} verified review{tutor.verifiedReviewsCount === 1 ? '' : 's'}
        </span>
      )}
      {tutor.credentialVerified && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-px text-[9px] font-medium rounded-full bg-success/10 text-success border border-success/20">
          <BadgeCheck size={10} /> Degree verified
        </span>
      )}
    </div>
  );
};

export default TrustBadges;
