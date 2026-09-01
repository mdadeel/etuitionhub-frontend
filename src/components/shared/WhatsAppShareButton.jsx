import { Share2 } from 'lucide-react';

const WhatsAppShareButton = ({ tutor, className = '', variant = 'default', iconOnly = false }) => {
  const url = `${window.location.origin}/tutor/${tutor?._id}`;
  const text = encodeURIComponent(
    `Check out ${tutor?.displayName || 'this tutor'} on eTuitionBD: ${url}`
  );
  const whatsappUrl = `https://wa.me/?text=${text}`;

  const baseStyles = "inline-flex items-center justify-center gap-1.5 transition-colors";
  const variants = {
    default: "px-3 py-1.5 text-xs font-medium rounded-md bg-[#25D366] text-white hover:bg-[#1DA851]",
    outline: "border border-border text-muted-foreground hover:bg-muted/50 rounded-lg"
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on WhatsApp"
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Share2 size={iconOnly ? 16 : 12} />
      {!iconOnly && "Share"}
    </a>
  );
};

export default WhatsAppShareButton;
