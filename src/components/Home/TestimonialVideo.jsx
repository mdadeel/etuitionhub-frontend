const TestimonialVideo = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div className="relative p-1 rounded-lg border border-border/50 bg-card shadow-sm overflow-hidden aspect-[4/3]">
      <iframe
        src={videoUrl}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video testimonial"
      />
    </div>
  );
};

export default TestimonialVideo;
