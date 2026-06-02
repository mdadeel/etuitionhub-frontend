import { cn } from '@/lib/utils';

const alignments = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
};

const SectionHeader = ({ 
  title,
  subtitle,
  badge,
  align = 'left',
  className,
  ...props 
}) => {
  return (
    <div className={cn('max-w-3xl mb-12', alignments[align], className)} {...props}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-full mb-4">
          <span className="text-xs font-medium text-muted-foreground">{badge}</span>
        </div>
      )}
      
      {title && (
        <h2 className="text-4xl md:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mb-4">
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className="text-lg text-muted-foreground leading-relaxed font-body">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
