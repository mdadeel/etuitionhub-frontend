import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import API_URL from "@/config/api"

const sizes = {
  xs: 'size-8',
  sm: 'size-10',
  md: 'size-12',
  lg: 'size-14',
  xl: 'size-16',
  default: 'size-8',
};

const badgeSizes = {
  xs: 'size-4',
  sm: 'size-5',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-6',
  default: 'size-5',
};

const getFullUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return `${API_URL}${url}`;
  return url;
};

function Avatar({
  className,
  size = "md",
  gender,
  src,
  alt,
  verified = false,
  children,
  ...props
}) {
  const hasImage = typeof src === 'string' && src !== 'null' && src !== 'undefined' && src.trim() !== '';

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none",
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    >
      {children ? children : (
        <>
          {hasImage && (
            <AvatarImage src={src} alt={alt} gender={gender} />
          )}
          <AvatarFallback className="bg-muted text-muted-foreground">
            {alt ? alt.slice(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </>
      )}
      {verified && (
        <span
          className={cn(
            "absolute -bottom-1 -right-1 z-10 bg-primary rounded-full flex items-center justify-center border border-white text-white select-none",
            badgeSizes[size] || badgeSizes.default
          )}
        >
          <svg className="size-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  src,
  alt,
  gender,
  ...props
}) {
  const [imgError, setImgError] = React.useState(false);
  const processedSrc = getFullUrl(src);

  const avatarSrc = typeof processedSrc === 'string' && processedSrc !== 'null' && processedSrc !== 'undefined' && processedSrc.trim() !== ''
    ? processedSrc
    : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(alt || 'user')}${gender ? `&gender=${gender.toLowerCase()}` : ''}`;

  const fallbackSrc = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(alt || 'user')}${gender ? `&gender=${gender.toLowerCase()}` : ''}`;

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
    }
  };

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={imgError ? fallbackSrc : avatarSrc}
      onError={handleError}
      className={cn("aspect-square size-full rounded-none object-cover", className)}
      {...props} />
  );
}

function AvatarFallback({
  className,
  children,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-none bg-muted text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    >
      {children || (
        <svg className="size-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      )}
    </AvatarPrimitive.Fallback>
  );
}

function AvatarBadge({
  className,
  ...props
}) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-none bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props} />
  );
}

function AvatarGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props} />
  );
}

function AvatarGroupCount({
  className,
  ...props
}) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-none bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props} />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}

