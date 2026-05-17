import { cn } from '@/lib/utils';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-[#EEF2F6] text-[#5B6475] border-[rgba(15,23,46,0.08)]',
    primary: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20',
    success: 'bg-[#059669]/10 text-[#059669] border-[#059669]/20',
    warning: 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20',
    error: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20',
    dark: 'bg-[#111827] text-white border-[#111827]',
    subtle: 'bg-[#F5F7FA] text-[#5B6475] border-[rgba(15,23,46,0.08)]',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-lg border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
