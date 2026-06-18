import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ShieldIllus = () => (
  <svg viewBox="0 0 180 160" className="w-full h-full" fill="none">
    <path d="M90 20 L145 45 L145 90 C145 125 90 145 90 145 C90 145 35 125 35 90 L35 45 Z"
      stroke="hsl(221 83% 53% / 0.25)" strokeWidth="2" />
    <path d="M90 30 L135 50 L135 88 C135 118 90 135 90 135 C90 135 45 118 45 88 L45 50 Z"
      stroke="hsl(221 83% 53% / 0.15)" strokeWidth="1.5" />
    <path d="M72 90 L84 102 L110 76" stroke="hsl(221 83% 53%)" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    <rect x="65" y="30" width="8" height="10" rx="1" fill="hsl(221 83% 53% / 0.12)" />
    <rect x="80" y="30" width="8" height="10" rx="1" fill="hsl(221 83% 53% / 0.12)" />
    <rect x="95" y="30" width="8" height="10" rx="1" fill="hsl(221 83% 53% / 0.12)" />
    <circle cx="40" cy="110" r="3" fill="hsl(221 83% 53% / 0.08)" />
    <circle cx="140" cy="110" r="3" fill="hsl(221 83% 53% / 0.08)" />
    <circle cx="50" cy="130" r="2" fill="hsl(221 83% 53% / 0.05)" />
    <circle cx="130" cy="130" r="2" fill="hsl(221 83% 53% / 0.05)" />
  </svg>
);

const ChatIllus = () => (
  <svg viewBox="0 0 180 160" className="w-full h-full" fill="none">
    <rect x="15" y="30" width="100" height="55" rx="10"
      stroke="hsl(38 95% 52% / 0.25)" strokeWidth="2" fill="hsl(38 95% 52% / 0.04)" />
    <path d="M40 85 L25 110 L55 85" stroke="hsl(38 95% 52% / 0.2)" strokeWidth="1.5"
      fill="hsl(38 95% 52% / 0.04)" />
    <circle cx="42" cy="50" r="4" fill="hsl(38 95% 52% / 0.35)" />
    <circle cx="65" cy="50" r="4" fill="hsl(38 95% 52% / 0.35)" />
    <circle cx="88" cy="50" r="4" fill="hsl(38 95% 52% / 0.35)" />
    <circle cx="42" cy="68" r="4" fill="hsl(38 95% 52% / 0.15)" />
    <circle cx="65" cy="68" r="4" fill="hsl(38 95% 52% / 0.15)" />

    <rect x="100" y="60" width="65" height="45" rx="10"
      stroke="hsl(221 83% 53% / 0.2)" strokeWidth="2" fill="hsl(221 83% 53% / 0.04)" />
    <path d="M125 105 L115 125 L140 105" stroke="hsl(221 83% 53% / 0.15)" strokeWidth="1.5"
      fill="hsl(221 83% 53% / 0.04)" />
    <circle cx="118" cy="77" r="3" fill="hsl(221 83% 53% / 0.35)" />
    <circle cx="135" cy="77" r="3" fill="hsl(221 83% 53% / 0.35)" />
    <circle cx="152" cy="77" r="3" fill="hsl(221 83% 53% / 0.35)" />

    <path d="M90 75 Q 95 65 100 75" stroke="hsl(38 95% 52% / 0.3)" strokeWidth="1.5"
      strokeDasharray="3 3" />
  </svg>
);

const DeviceIllus = () => (
  <svg viewBox="0 0 180 160" className="w-full h-full" fill="none">
    <rect x="20" y="20" width="85" height="60" rx="4"
      stroke="hsl(221 83% 53% / 0.25)" strokeWidth="2" fill="hsl(221 83% 53% / 0.04)" />
    <rect x="24" y="28" width="77" height="38" rx="2"
      stroke="hsl(221 83% 53% / 0.1)" strokeWidth="1" fill="hsl(221 83% 53% / 0.04)" />
    <line x1="45" y1="72" x2="80" y2="72" stroke="hsl(221 83% 53% / 0.15)" strokeWidth="1.5" />
    <rect x="58" y="16" width="9" height="4" rx="2" fill="hsl(221 83% 53% / 0.15)" />

    <rect x="110" y="50" width="40" height="75" rx="6"
      stroke="hsl(38 95% 52% / 0.25)" strokeWidth="2" fill="hsl(38 95% 52% / 0.04)" />
    <rect x="115" y="60" width="30" height="42" rx="3"
      stroke="hsl(38 95% 52% / 0.1)" strokeWidth="1" fill="hsl(38 95% 52% / 0.04)" />
    <line x1="122" y1="113" x2="138" y2="113" stroke="hsl(38 95% 52% / 0.3)" strokeWidth="2" strokeLinecap="round" />
    <line x1="127" y1="120" x2="133" y2="120" stroke="hsl(38 95% 52% / 0.15)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="130" cy="125" r="3" stroke="hsl(38 95% 52% / 0.2)" strokeWidth="1.5" />

    <path d="M62 50 Q 72 45 80 50 Q 88 55 95 50" stroke="hsl(221 83% 53% / 0.15)" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="90" r="2" fill="hsl(221 83% 53% / 0.08)" />
    <circle cx="170" cy="30" r="2" fill="hsl(38 95% 52% / 0.08)" />
    <circle cx="165" cy="130" r="3" fill="hsl(221 83% 53% / 0.05)" />
    <circle cx="15" cy="140" r="2" fill="hsl(38 95% 52% / 0.05)" />
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

const trustStats = [
  { value: "100%", label: "Verified Tutors" },
  { value: "4.8/5", label: "Parent Satisfaction" },
  { value: "<24h", label: "Response Time" },
  { value: "95%", label: "Success Rate" },
];

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const statsRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(headingRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
          );
          const items = gsap.utils.toArray('.feature-block');
          gsap.fromTo(items,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.2 }
          );
          gsap.fromTo(statsRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.8 }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-14 md:py-20 bg-background">
      <div ref={headingRef} className="max-w-6xl mx-auto px-6 mb-12">
        <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">Why Trust Us</span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-tight leading-[0.95] mt-2 max-w-4xl">
          Why parents trust us with their children's education
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-2 max-w-2xl">
          We've heard the stories — tutors who don't show up, fake credentials, and hidden fees.
          That's why we built a platform where every tutor is verified, every fee is transparent,
          and every parent can communicate directly.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-6">
        {blocks.map((block, idx) => {
          const Illus = illustrations[idx];
          const isLast = idx === 2;
          return (
            <div key={idx} className={`feature-block p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm flex flex-col justify-between ${isLast ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-[120px] h-[100px] shrink-0">
                  <Illus />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-heading text-foreground tracking-tight">
                    {block.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border/10 mt-4">
                {block.features.map((feature, fi) => {
                  const parts = feature.split(' — ');
                  return (
                    <div key={fi} className="flex items-start gap-2 text-left">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                        <circle cx="7" cy="7" r="6" stroke={`hsl(${idx % 2 === 1 ? '38 95% 52%' : '221 83% 53%'} / 0.3)`} strokeWidth="1.5" />
                        <path d="M4.5 7 L6.5 9 L9.5 5" stroke={`hsl(${idx % 2 === 1 ? '38 95% 52%' : '221 83% 53%'})`}
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                      </svg>
                      <div className="text-[11px] text-muted-foreground leading-normal">
                        <span className="font-semibold text-foreground">{parts[0]}</span>
                        {parts[1] && <span className="block text-[10px] opacity-75">{parts[1]}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={statsRef} className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {trustStats.map((stat, idx) => (
            <div key={idx}>
              <span className="text-2xl md:text-3xl font-heading text-foreground tracking-tight block">
                {stat.value}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
