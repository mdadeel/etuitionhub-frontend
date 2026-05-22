import { cn } from '@/lib/utils';

const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-[rgba(15,23,46,0.08)]',
    elevated: 'bg-white border border-[rgba(15,23,46,0.08)] shadow-sm shadow-[rgba(0,0,0,0.04)]',
    subtle: 'bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)]',
    dark: 'bg-[#0F172E] border border-[rgba(255,255,255,0.08)]',
  };

  const hoverStyles = hover 
    ? 'hover:border-[#2563EB]/20 hover:shadow-lg hover:shadow-[rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300'
    : '';

  return (
    <div
      className={cn(
        'rounded-none',
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
