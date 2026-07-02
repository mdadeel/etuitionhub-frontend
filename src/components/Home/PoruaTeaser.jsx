import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';
import { trackEvent } from '../../services/analytics';
import PoruaLogo from '../AiAssistant/PoruaLogo';
import Illustration from './illustrations/Illustration';

const PoruaTeaser = () => {
  const ref = useAnimateOnScroll();

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background border-b border-border/10">
      {/* Soft blue glow — grounds the robot illustration */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 rounded-full bg-sky-400/5 blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT - Text details and CTA */}
          <div ref={ref} className="lg:col-span-7 space-y-6 text-left opacity-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>AI-Powered Study Buddy</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight leading-tight">
              Meet <span className="text-primary">Porua</span>, your AI study assistant
            </h2>
            
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Get instant answers to academic questions, practice problems, and personalized learning 
              recommendations — powered by AI, built specifically for the Bangladeshi school curriculum.
            </p>

            <div className="pt-2">
              <Link
                to="/login?next=/ai-assistant"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
                onClick={() => trackEvent('home_ai_teaser_click', 'porua')}
              >
                <PoruaLogo iconOnly size={16} className="text-primary-foreground shrink-0" />
                <span>Try Search in AI Assistant</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT - AI Robot Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[460px] aspect-[5/4]">
              <Illustration name="robot" className="w-full h-auto" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PoruaTeaser;
