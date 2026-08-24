import { ShieldCheck, TrendingUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CredibilityBadge = ({ verificationStatus, requestsReceived = 0, requestsRespondedCount = 0, reviewCount = 0, rating = 0 }) => {
  const isVerified = verificationStatus === 'verified_basic' || verificationStatus === 'verified_premium';

  // Only claim "Verified Profile" from real verification status, never from a
  // profile-completeness heuristic.
  if (requestsReceived < 5 && isVerified) {
    return (
      <Badge variant="success" size="sm" className="gap-1.5">
        <ShieldCheck className="size-3.5" />
        Verified Profile
      </Badge>
    );
  }

  if (requestsReceived >= 5) {
    // Never fabricate a response rate when there is no response data.
    const responseRate = requestsRespondedCount > 0
      ? Math.round((requestsRespondedCount / requestsReceived) * 100)
      : null;
    if (responseRate === null) return null;
    return (
      <Badge variant="primary" size="sm" className="gap-1.5">
        <TrendingUp className="size-3.5" />
        Response Rate: {responseRate}%
      </Badge>
    );
  }

  if (reviewCount >= 3 && rating) {
    return (
      <Badge variant="warning" size="sm" className="gap-1.5">
        <Star className="size-3.5 fill-current" />
        {rating.toFixed(1)} ★
      </Badge>
    );
  }

  return null;
};

export default CredibilityBadge;
