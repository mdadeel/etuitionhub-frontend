import { Database } from "lucide-react";
import SEO from '../components/shared/SEO';
import EmptyState from '../components/shared/EmptyState';

/**
 * Blog Page
 * Refactored to "Technical Emerald Minimalism"
 */
const Blog = () => {
    return (
        <div className="bg-background min-h-screen py-24 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary animate-in fade-in duration-700">
            <SEO title="Tutoring Tips & Educational Resources | eTuitionBD Blog" description="Expert tutoring tips, study guides, and educational resources for students and parents in Bangladesh." />
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Cognitive Stream</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] mb-10">
                        Industry <br />
                        <span className="text-primary italic">Insights.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-muted-foreground font-bold leading-relaxed max-w-2xl uppercase tracking-tight italic">
                        Exploring the intersection of technology, education, and synchronization.
                    </p>
                </div>

                <EmptyState
                    icon={Database}
                    title="No articles yet"
                    description="Tutoring tips and study guides will be published here soon."
                />
            </div>
        </div>
    );
};

export default Blog;
