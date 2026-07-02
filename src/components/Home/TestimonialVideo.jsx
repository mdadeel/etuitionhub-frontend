import { Play, Star } from 'lucide-react';

const TestimonialVideo = ({ videoUrl }) => {
  if (videoUrl) {
    return (
      <div className="relative p-1 rounded-[20px] border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden aspect-[4/3]">
        <iframe
          src={videoUrl}
          className="w-full h-full rounded-[16px]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video testimonial"
        />
      </div>
    );
  }

  return (
    <div className="relative p-6 rounded-[20px] border border-border/50 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-accent/10 backdrop-blur-sm shadow-sm hover:shadow-premium-md hover:border-primary/20 transition-all duration-300 group flex flex-col justify-between cursor-pointer min-h-[280px]">
      <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110">
          <Play className="size-6 text-primary fill-primary ml-0.5" />
        </div>
        <p className="text-sm font-bold text-foreground">Watch Parent Testimonial</p>
        <p className="text-[10px] text-muted-foreground text-center max-w-[200px]">
          Hear firsthand from a parent in Bangladesh
        </p>
      </div>

      <div className="border-t border-border/40 pt-4 flex items-center gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Play className="size-4 text-primary fill-primary ml-0.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground leading-tight">Video Testimonial</p>
          <p className="text-[10px] text-muted-foreground truncate">Parent · Bangladesh</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialVideo;
