import { Brain, Zap, BookOpen, MessageSquare } from 'lucide-react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const capabilities = [
  {
    icon: Zap,
    title: "Instant Answers",
    description: "Get step-by-step solutions to complex math, science, and coding questions instantly."
  },
  {
    icon: Brain,
    title: "Concept Explanations",
    description: "Break down difficult academic topics into simple, clear explanations."
  },
  {
    icon: BookOpen,
    title: "Curriculum Aligned",
    description: "Tailored to national curriculum standards including SSC and HSC preparation."
  },
  {
    icon: MessageSquare,
    title: "Interactive Doubt Solving",
    description: "Ask follow-up questions and explore concepts in depth with the AI."
  }
];

const Statistics = () => {
  const containerRef = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden py-10 md:py-14 bg-card border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div 
          ref={containerRef} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {capabilities.map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center md:items-start p-5 text-center md:text-left space-y-4 bg-background/40 hover:bg-background/80 border border-border/30 rounded-2xl transition-all duration-300 group relative z-10"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <item.icon size={20} />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-sm text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Statistics;
