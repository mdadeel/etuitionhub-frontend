import { cn } from '@/lib/utils';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-md',
    secondary: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
    outline: 'bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background',
    ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
    link: 'bg-transparent text-[#2563EB] hover:underline p-0 h-auto',
  };

  const sizes = {
    xs: 'text-xs px-3 py-1.5 h-8',
    sm: 'text-sm px-4 py-2 h-9',
    md: 'text-sm px-5 py-2.5 h-11',
    lg: 'text-base px-6 py-3 h-12',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-none transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
