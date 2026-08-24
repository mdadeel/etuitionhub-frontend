import { cn } from '@/lib/utils';

const Section = ({ 
  children, 
  variant = 'default',
  spacing = 'lg',
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-background',
    white: 'bg-card',
    subtle: 'bg-muted',
    dark: 'bg-[#0F172E]',
  };

  const spacings = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24',
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        variants[variant],
        spacings[spacing],
        className
      )}
      {...props}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
