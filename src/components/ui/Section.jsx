import { cn } from '@/lib/utils';

const Section = ({ 
  children, 
  variant = 'default',
  spacing = 'lg',
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-[#F5F7FA]',
    white: 'bg-white',
    subtle: 'bg-[#EEF2F6]',
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
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </section>
  );
};

export default Section;
