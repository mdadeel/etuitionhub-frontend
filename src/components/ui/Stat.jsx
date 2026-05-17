import { cn } from '@/lib/utils';
import CountUp from 'react-countup';

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
  const variants = {
    default: 'text-center',
    horizontal: 'flex items-center gap-4',
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {Icon && variant === 'horizontal' && (
        <div className="w-12 h-12 bg-[#EEF2F6] rounded-xl flex items-center justify-center border border-[rgba(15,23,46,0.08)]">
          <Icon className="w-6 h-6 text-[#2563EB]" />
        </div>
      )}
      
      <div className={cn(variant === 'horizontal' && 'flex-1')}>
        <div className="text-2xl md:text-3xl font-heading text-[#111827] leading-none mb-1">
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
        <p className="text-sm text-[#5B6475]">{label}</p>
      </div>
    </div>
  );
};

export default Stat;
