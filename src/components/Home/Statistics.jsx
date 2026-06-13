import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import countUpModule from 'react-countup';
const CountUp = countUpModule.default || countUpModule;

gsap.registerPlugin(ScrollTrigger);

const PeopleIcon = ({ color }) => (
  <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0">
    <circle cx="12" cy="10" r="4" fill={`hsl(${color})`} opacity="0.9" />
    <circle cx="20" cy="10" r="4" fill={`hsl(${color})`} opacity="0.5" />
    <path d="M4 24c0-4 3.6-7 8-7s8 3 8 7" stroke={`hsl(${color} / 0.3)`} strokeWidth="1.5" fill="none" />
    <path d="M16 24c0-4 3.6-7 8-7s8 3 8 7" stroke={`hsl(${color} / 0.3)`} strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="22" r="1.5" fill={`hsl(${color} / 0.15)`} />
    <circle cx="20" cy="22" r="1.5" fill={`hsl(${color} / 0.15)`} />
  </svg>
);

const NetworkIcon = ({ color }) => (
  <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0">
    <circle cx="8" cy="16" r="4" fill={`hsl(${color})`} opacity="0.9" />
    <circle cx="24" cy="16" r="4" fill={`hsl(${color})`} opacity="0.9" />
    <circle cx="16" cy="8" r="3" fill={`hsl(${color})`} opacity="0.5" />
    <circle cx="16" cy="24" r="3" fill={`hsl(${color})`} opacity="0.5" />
    <path d="M12 16 L14 10" stroke={`hsl(${color} / 0.25)`} strokeWidth="1.5" />
    <path d="M12 16 L14 22" stroke={`hsl(${color} / 0.25)`} strokeWidth="1.5" />
    <path d="M20 16 L18 10" stroke={`hsl(${color} / 0.25)`} strokeWidth="1.5" />
    <path d="M20 16 L18 22" stroke={`hsl(${color} / 0.25)`} strokeWidth="1.5" />
  </svg>
);

const BookIcon = ({ color }) => (
  <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0">
    {[5, 11, 17, 23].map((x, i) => (
      <rect key={i} x={x} y={11 + i * 2} width="5" height={18 - i * 4} rx="0.8"
        fill={`hsl(${color} / ${0.2 + i * 0.1})`} />
    ))}
    <line x1="3" y1="30" x2="29" y2="30" stroke={`hsl(${color} / 0.1)`} strokeWidth="1" />
  </svg>
);

const PinIcon = ({ color }) => (
  <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0">
    {[
      { cx: 10, cy: 14, s: 0.7 },
      { cx: 22, cy: 18, s: 0.85 },
      { cx: 16, cy: 9, s: 0.6 },
    ].map((pin, i) => (
      <g key={i} opacity={0.8 - i * 0.15}>
        <ellipse cx={pin.cx} cy={pin.cy + 6 * pin.s} rx="2.5" ry="1.2" fill={`hsl(${color} / 0.15)`} />
        <path d={`M${pin.cx} ${pin.cy + 6 * pin.s} L${pin.cx} ${pin.cy - 2 * pin.s}
          A${3.5 * pin.s} ${3.5 * pin.s} 0 1 0 ${pin.cx} ${pin.cy + 6 * pin.s}`}
          fill={`hsl(${color})`} opacity={0.8 - i * 0.2} />
        <circle cx={pin.cx} cy={pin.cy + 1} r={1.2 * pin.s} fill={`hsl(var(--background))`} />
      </g>
    ))}
  </svg>
);

const ShieldIcon = ({ color }) => (
  <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0">
    <path d="M16 6 L24 10 L24 18 C24 23 16 27 16 27 C16 27 8 23 8 18 L8 10 Z"
      stroke={`hsl(${color} / 0.2)`} strokeWidth="1.5" />
    <path d="M12 17 L15 20 L20 13" stroke={`hsl(${color})`} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
  </svg>
);

const icons = [PeopleIcon, NetworkIcon, BookIcon, PinIcon, ShieldIcon];

const statData = [
  { value: 2500, label: 'Active Tutors', suffix: '+', max: 3000, color: '221 83% 53%' },
  { value: 15000, label: 'Students Matched', suffix: '+', max: 20000, color: '38 95% 52%' },
  { value: 50, label: 'Subjects', suffix: '+', max: 60, color: '221 83% 53%' },
  { value: 10, label: 'Cities', suffix: '+', max: 12, color: '38 95% 52%' },
  { value: 95, label: 'Success Rate', suffix: '%', max: 100, color: '221 83% 53%' },
];

const Statistics = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

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
          const items = gsap.utils.toArray('.stat-item');
          gsap.fromTo(items,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.15 }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 md:py-24 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-pattern-academic opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">Making an Impact</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-tight leading-tight mt-3">
            Our platform has connected thousands of students with perfect tutors
          </h2>
        </div>

        <div className="bg-background border border-border/10 rounded-xl divide-y md:divide-y-0 md:divide-x divide-border/10 md:flex md:flex-row overflow-hidden">
          {statData.map((stat, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="stat-item flex-1 flex flex-col p-5 md:p-6 gap-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                  <Icon color={stat.color} />
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="text-xl md:text-2xl font-heading tracking-tight tabular-nums leading-none"
                      style={{ color: `hsl(${stat.color})` }}>
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        separator=","
                        enableScrollSpy={true}
                        scrollSpyOnce={true}
                      />
                      <span className="text-sm md:text-base text-muted-foreground ml-0.5 font-body">{stat.suffix}</span>
                    </span>
                    <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-muted/20 relative overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full transition-all ease-out"
                    style={{
                      transitionDuration: '1500ms',
                      width: `${(stat.value / stat.max) * 100}%`,
                      background: `linear-gradient(90deg, hsl(${stat.color}) 0%, hsl(${stat.color} / 0.3) 100%)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
