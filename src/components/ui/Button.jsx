import { cn } from '@/lib/utils';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md',
    secondary: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
    outline: 'bg-transparent text-foreground border border-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
    link: 'bg-transparent text-primary hover:underline p-0 h-auto',
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
        'inline-flex items-center justify-center font-medium rounded transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
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
