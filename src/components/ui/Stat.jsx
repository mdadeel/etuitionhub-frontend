import { cn } from '@/lib/utils';
import CountUp from 'react-countup';

const variants = {
  default: 'text-center',
  horizontal: 'flex items-center gap-4',
};

const Stat = ({ 
  value, 
  label, 
  suffix = '',
  prefix = '',
  icon: Icon,
  variant = 'default',
  className,
  ...props 
}) => {
  return (
    <div className={cn(variants[variant], className)} {...props}>
      {Icon && variant === 'horizontal' && (
        <div className="size-12 bg-muted rounded-xl flex items-center justify-center border border-border">
          <Icon className="size-6 text-[#2563EB]" />
        </div>
      )}
      
      <div className={cn(variant === 'horizontal' && 'flex-1')}>
        <div className="text-2xl md:text-3xl font-heading text-foreground leading-none mb-1">
          {prefix}
          <CountUp 
            end={value} 
            duration={3} 
            separator="," 
            enableScrollSpy={true}
            scrollSpyOnce={true}
          />
          {suffix}
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default Stat;
