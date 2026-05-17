import { cn } from '@/lib/utils';

const SectionHeader = ({ 
  title,
  subtitle,
  badge,
  align = 'left',
  className,
  ...props 
}) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={cn('max-w-3xl mb-12', alignments[align], className)} {...props}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EEF2F6] border border-[rgba(15,23,46,0.08)] rounded-full mb-4">
          <span className="text-xs font-medium text-[#5B6475]">{badge}</span>
        </div>
      )}
      
      {title && (
        <h2 className="text-4xl md:text-5xl font-heading text-[#111827] tracking-tight leading-[0.95] mb-4">
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className="text-lg text-[#5B6475] leading-relaxed font-body">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
