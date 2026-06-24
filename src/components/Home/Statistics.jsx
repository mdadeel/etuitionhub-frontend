import { useState, useEffect, useRef } from 'react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const statData = [
  { value: 2500, label: 'Tutors', suffix: '+' },
  { value: 45000, label: 'Students', suffix: '+' },
  { value: 15000, label: 'Sessions', suffix: '+' },
  { value: 4.8, label: 'Rating', suffix: '★' },
];

function AnimatedNumber({ end, decimals = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let current = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          current += increment;
          if (current >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
          }
        }, 16);
        observer.unobserve(el);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, decimals]);

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}</span>;
}

const Statistics = () => {
  const containerRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden py-6 md:py-8 bg-card border-y border-border/40">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.01] via-transparent to-primary/[0.01] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div 
          ref={containerRef} 
          className="animate-in-up grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-border/50"
        >
          {statData.map((stat, i) => {
            const isFloat = stat.value % 1 !== 0;
            return (
              <div key={i} className="flex flex-col items-center justify-center p-2 md:p-4 text-center">
                <span className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-foreground flex items-baseline justify-center">
                  <AnimatedNumber end={stat.value} decimals={isFloat ? 1 : 0} />
                  <span className="text-lg md:text-xl lg:text-2xl text-primary font-bold ml-0.5">{stat.suffix}</span>
                </span>
                <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
