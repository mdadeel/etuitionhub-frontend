import { cn } from '@/lib/utils';

const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-card border border-border',
    elevated: 'bg-card border border-border shadow-sm shadow-[rgba(0,0,0,0.04)]',
    subtle: 'bg-background border border-border',
    dark: 'bg-[#0F172E] border border-[rgba(255,255,255,0.08)]',
  };

  const hoverStyles = hover 
    ? 'hover:border-primary/20 hover:shadow-lg hover:shadow-[rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300'
    : '';

  return (
    <div
      className={cn(
        'rounded',
        variants[variant],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
