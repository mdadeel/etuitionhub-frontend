const formatBDT = (n) => `৳${Number(n).toLocaleString('en-IN')}`;

const PriceBadge = ({ pricePerSession, pricePerMonth, showBoth = true, className = '' }) => {
  if (!pricePerSession && !pricePerMonth) return null;
  return (
    <div className={`inline-flex flex-wrap items-baseline gap-1.5 text-sm ${className}`}>
      {pricePerSession && (
        <span className="font-semibold text-foreground">{formatBDT(pricePerSession)}<span className="text-xs text-muted-foreground font-normal">/session</span></span>
      )}
      {showBoth && pricePerSession && pricePerMonth && (
        <span className="text-xs text-muted-foreground">·</span>
      )}
      {pricePerMonth && (
        <span className="text-xs text-muted-foreground">{formatBDT(pricePerMonth)}/mo</span>
      )}
    </div>
  );
};

export default PriceBadge;
