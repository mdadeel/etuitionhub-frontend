import { cn } from '@/lib/utils';

const Avatar = ({ 
  children,
  src, 
  alt, 
  size = 'md',
  verified = false,
  gender,
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

  const hasImage = src && src !== 'null' && src !== 'undefined' && src.trim() !== '';

  const avatarSrc = hasImage
    ? src
    : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(alt || 'user')}${gender ? `&gender=${gender.toLowerCase()}` : ''}`;

  return (
    <div className={cn('relative shrink-0', sizes[size], className)} {...props}>
      <img
        src={avatarSrc}
        alt={alt || 'Avatar'}
        className={cn(
          'w-full h-full rounded-none object-cover border border-border'
        )}
      />
      {verified && (
        <div className={cn(
          'absolute -bottom-1 -right-1 bg-[#2563EB] rounded-none flex items-center justify-center border-2 border-white',
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
