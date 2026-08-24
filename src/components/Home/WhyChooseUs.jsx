import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const ShieldIllus = () => (
  <svg viewBox="0 0 180 160" className="w-full h-full text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M90 20 C110 30, 140 40, 145 45 C145 75, 135 110, 90 145 C45 110, 35 75, 35 45 C40 40, 70 30, 90 20 Z"
      strokeWidth="1.5" opacity="0.3" />
    <path d="M90 25 C108 34, 135 43, 140 47 C140 73, 130 105, 90 138 C50 105, 40 73, 40 47 C45 43, 72 34, 90 25 Z"
      strokeWidth="1.2" />
    <path d="M68 85 C73 90, 76 96, 80 102 C88 90, 100 78, 115 70" strokeWidth="2.5" className="text-primary" />
    <path d="M50 30 Q 70 25 90 30" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 2" />
    <circle cx="150" cy="90" r="2" opacity="0.4" />
    <circle cx="30" cy="110" r="3" opacity="0.3" />
  </svg>
);

const ChatIllus = () => (
  <svg viewBox="0 0 180 160" className="w-full h-full text-amber-500" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 40 C20 30, 110 30, 110 40 C110 50, 110 70, 110 75 C110 82, 85 82, 75 82 C60 92, 45 98, 35 102 C40 92, 43 85, 40 82 C20 82, 20 70, 20 40 Z"
      strokeWidth="1.5" />
    <path d="M24 44 C24 35, 106 35, 106 44 C106 52, 106 68, 106 72 C106 78, 83 78, 73 78 C59 88, 47 94, 38 97 C42 88, 44 82, 42 78 C24 78, 24 68, 24 44 Z"
      strokeWidth="1" opacity="0.4" />
    <line x1="40" y1="52" x2="90" y2="52" strokeWidth="1.2" opacity="0.6" />
    <line x1="40" y1="64" x2="75" y2="64" strokeWidth="1.2" opacity="0.6" />
    <path d="M160 80 C160 70, 80 70, 80 80 C80 90, 80 110, 80 112 C80 118, 100 118, 108 118 C120 128, 130 134, 138 138 C135 129, 133 122, 135 118 C160 118, 160 108, 160 80 Z"
      strokeWidth="1.5" className="text-primary" />
    <line x1="95" y1="92" x2="145" y2="92" strokeWidth="1.2" opacity="0.6" className="text-primary" />
    <line x1="95" y1="102" x2="125" y2="102" strokeWidth="1.2" opacity="0.6" className="text-primary" />
  </svg>
);

const DeviceIllus = () => (
  <svg viewBox="0 0 180 160" className="w-full h-full text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="25" y="30" width="80" height="50" rx="3" strokeWidth="1.5" />
    <rect x="29" y="34" width="72" height="42" rx="1" strokeWidth="1" opacity="0.4" />
    <path d="M15 80 L115 80 C115 85, 15 85, 15 80 Z" strokeWidth="1.5" />
    <line x1="55" y1="83" x2="75" y2="83" strokeWidth="2" />
    <rect x="110" y="55" width="40" height="75" rx="5" strokeWidth="1.5" className="text-amber-500" />
    <rect x="114" y="63" width="32" height="58" rx="2" strokeWidth="1" opacity="0.4" className="text-amber-500" />
    <circle cx="130" cy="126" r="3" strokeWidth="1.2" className="text-amber-500" />
    <path d="M65 50 Q 85 45 105 60" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="105" cy="60" r="2.5" fill="currentColor" />
  </svg>
);

const illustrations = [ShieldIllus, ChatIllus, DeviceIllus];

const blocks = [
  {
    title: "Verified Credentials",
    description: "Every tutor's academic documents are manually checked. We verify qualifications, experience, and background to ensure your child learns from genuine educators.",
    features: [
      "Document Verification — Academic credentials checked",
      "Background Check — Identity verification complete",
      "Experience Validated — Teaching history confirmed",
      "Reference Checks — Past employer verification",
    ],
  },
  {
    title: "Direct Connection",
    description: "No middlemen, no agents. Message tutors directly, discuss your child's needs, and build a relationship based on trust and transparency.",
    features: [
      "Direct Messaging — Communicate without intermediaries",
      "Transparent Fees — No hidden charges or commissions",
      "Parent-Tutor Match — Find the right fit for your child",
      "Quick Response — Average 18-minute reply time",
    ],
  },
  {
    title: "Online & Offline",
    description: "Choose the learning mode that works best for your family. Whether it's in-person sessions at home or online classes, we support your preference.",
    features: [
      "Online Classes — Learn from anywhere",
      "In-Person Sessions — Home tutoring available",
      "Flexible Budget — ৳2,000 to ৳15,000/month",
      "Personalized Care — Tailored to your child",
    ],
  },
];

const WhyChooseUs = () => {
  const headingRef = useAnimateOnScroll();
  const featuresRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background">
      {/* Warm glow — grounds the family illustration */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-amber-400/5 blur-[120px] pointer-events-none z-0" />

      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT - Bangladeshi Family Learning Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center order-2 lg:order-1">
            <div className="relative w-full max-w-[460px] aspect-[5/4]">
              <img src="/images/styding.png" alt="Family learning illustration" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* RIGHT - Text Contents & Features */}
          <div ref={headingRef} className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.18em]">Why Trust Us</span>
              <h2 className="text-2xl md:text-3xl font-heading text-foreground tracking-tight leading-tight mt-2">
                Why parents trust us with their children's education
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                We've heard the stories — tutors who don't show up, fake credentials, and hidden fees.
                That's why we built a platform where every tutor is verified, every fee is transparent,
                and every parent can communicate directly.
              </p>
            </div>


            {/* Connected feature cards system */}
            <div ref={featuresRef} className="space-y-0 relative z-10">
              {blocks.map((block, idx) => {
                const Illus = illustrations[idx];
                const isLast = idx === blocks.length - 1;
                return (
                  <div key={idx} className="relative">
                    {/* Feature Card */}
                    <div className="flex gap-4 p-4 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-xs hover:border-border/70 transition-colors z-10 relative">
                      <div className="w-14 h-12 shrink-0 bg-primary/5 rounded-lg p-2 flex items-center justify-center">
                        <Illus className="size-full" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <h3 className="text-sm font-heading font-bold text-foreground">
                          {block.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {block.description}
                        </p>
                        
                        {/* Sub-features list */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-border/5 mt-2">
                          {block.features.map((feature, fi) => {
                            const parts = feature.split(' — ');
                            return (
                              <div key={fi} className="flex items-start gap-1">
                                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                                  <circle cx="7" cy="7" r="6" stroke="hsl(221 83% 53% / 0.3)" strokeWidth="1.5" />
                                  <path d="M4.5 7 L6.5 9 L9.5 5" stroke="hsl(221 83% 53%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="text-[10px] text-muted-foreground leading-none">
                                  <span className="font-semibold text-foreground/80">{parts[0]}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Visually connected paths joining feature card blocks */}
                    {!isLast && (
                      <div className="relative h-6 flex flex-col items-center justify-center z-0">
                        <div className="absolute inset-y-0 w-px border-l border-dashed border-primary/30" />
                        <div className="relative size-5 rounded-full border border-primary/20 bg-background flex items-center justify-center text-[8px] text-primary/60 shadow-xs z-10 font-bold">
                          {idx === 0 ? "↓" : "✦"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
