import { cn } from '@/lib/utils';

const Avatar = ({ 
  children,
  src, 
  alt, 
  size = 'md',
  verified = false,
  className,
  ...props 
}) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const badgeSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-6 h-6',
  };

  return (
    <div className={cn('relative shrink-0', sizes[size], className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full rounded-xl object-cover border border-[rgba(15,23,46,0.08)]'
          )}
        />
      ) : (
        <div className={cn(
          'w-full h-full rounded-xl bg-[#EEF2F6] border border-[rgba(15,23,46,0.08)]',
          'flex items-center justify-center',
          children ? '' : iconSizes[size]
        )}>
          {children || alt?.charAt(0) || '?'}
        </div>
      )}
      
      {verified && (
        <div className={cn(
          'absolute -bottom-1 -right-1 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-white',
          badgeSizes[size]
        )}>
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;
