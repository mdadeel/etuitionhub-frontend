import { Award, Sparkles, ShieldCheck, Star, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TrustBadges = ({ tutor, className, showExperience = true, showStatus = true }) => {
  if (!tutor) return null;

  const rating = tutor.ratings || tutor.rating || 0;
  const reviewCount = tutor.reviewCount || tutor.reviewsCount || 0;
  const expYears = parseInt(tutor.experience) || 0;

  const isSuperTutor = tutor.verificationStatus === 'verified_premium' || (rating >= 4.9 && reviewCount >= 30);
  const isSeniorTutor = showExperience && expYears >= 5;
  const isNidVerified = tutor.nidVerified === true;
  const hasVerifiedReviews = (tutor.verifiedReviewsCount || 0) > 0;
  const status = showStatus ? tutor.verificationStatus : null;

  const items = [];

  if (status === 'verified_basic') {
    items.push({
      key: 'status-basic',
      icon: <CheckCircle2 className="size-3 text-primary shrink-0" />,
      label: 'Basic',
      colorClass: 'text-primary font-medium',
      title: 'Basic Verified Tutor Profile',
    });
  } else if (status === 'verified_premium') {
    items.push({
      key: 'status-premium',
      icon: <Award className="size-3 text-accent shrink-0" />,
      label: 'Premium',
      colorClass: 'text-accent-foreground font-semibold',
      title: 'Premium Verified Tutor Profile',
    });
  } else if (status === 'pending_review') {
    items.push({
      key: 'status-review',
      icon: <Clock className="size-3 text-warning shrink-0" />,
      label: 'Review',
      colorClass: 'text-warning font-medium',
      title: 'Verification Pending Review',
    });
  } else if (status === 'unverified') {
    items.push({
      key: 'status-unverified',
      icon: <AlertCircle className="size-3 text-muted-foreground shrink-0" />,
      label: 'None',
      colorClass: 'text-muted-foreground font-medium',
      title: 'Unverified Tutor Profile',
    });
  } else if (!status && isSuperTutor) {
    items.push({
      key: 'super-tutor',
      icon: <Award className="size-3 text-accent shrink-0" />,
      label: 'Super Tutor',
      colorClass: 'text-accent-foreground font-semibold',
      title: 'Super Tutor: Rated 4.9+ with 30+ verified reviews',
    });
  }

  if (isSeniorTutor) {
    items.push({
      key: 'senior-tutor',
      icon: <Sparkles className="size-3 text-secondary-foreground shrink-0" />,
      label: `${expYears}+ Yrs Senior`,
      colorClass: 'text-secondary-foreground font-medium',
      title: '5+ Years of professional tutoring experience',
    });
  }

  if (isNidVerified) {
    items.push({
      key: 'nid-verified',
      icon: <ShieldCheck className="size-3 text-success shrink-0" />,
      label: 'NID Verified',
      colorClass: 'text-success font-medium',
      title: 'National ID & identity documents verified',
    });
  }

  if (hasVerifiedReviews) {
    items.push({
      key: 'verified-reviews',
      icon: <Star className="size-3 fill-accent text-accent shrink-0" />,
      label: `${tutor.verifiedReviewsCount} verified review${tutor.verifiedReviewsCount === 1 ? '' : 's'}`,
      colorClass: 'text-foreground font-medium',
    });
  }

  if (tutor.freeDemoAvailable !== false) {
    items.push({
      key: 'free-demo',
      icon: <Sparkles className="size-3 text-primary shrink-0" />,
      label: 'Free Demo',
      colorClass: 'text-primary font-semibold',
      title: 'Free 30-min trial session covered by 100% Parent Guarantee',
    });
  }

  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]", className)}>
      {items.map((item, idx) => (
        <div key={item.key} className="flex items-center gap-1.5">
          {idx > 0 && <span className="text-muted-foreground/40 text-[10px] select-none">•</span>}
          <span className={cn("inline-flex items-center gap-1 leading-tight", item.colorClass)} title={item.title}>
            {item.icon}
            <span>{item.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
