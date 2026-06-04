import { Share2 } from 'lucide-react';

const WhatsAppShareButton = ({ tutor, className = '' }) => {
  const url = `${window.location.origin}/tutors/${tutor?._id}`;
  const text = encodeURIComponent(
    `Check out ${tutor?.displayName || 'this tutor'} on eTuitionBD: ${url}`
  );
  const whatsappUrl = `https://wa.me/?text=${text}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on WhatsApp"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Share2 size={12} /> Share
    </a>
  );
};

export default WhatsAppShareButton;
