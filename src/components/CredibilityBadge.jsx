import { ShieldCheck, TrendingUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CredibilityBadge = ({ requestsReceived = 0, requestsRespondedCount = 0, profileCompleteness = 0, reviewCount = 0, rating = 0 }) => {
  if (requestsReceived < 5 && profileCompleteness >= 80) {
    return (
      <Badge variant="success" size="sm" className="gap-1.5">
        <ShieldCheck className="size-3.5" />
        Verified Profile
      </Badge>
    );
  }

  if (requestsReceived >= 5) {
    const responseRate = requestsRespondedCount > 0
      ? Math.round((requestsRespondedCount / requestsReceived) * 100)
      : 80;
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
