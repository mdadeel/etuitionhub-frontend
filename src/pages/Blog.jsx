import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Database, Clock, User } from "lucide-react";
import SEO from '../components/shared/SEO';

/**
 * Blog Page
 * Refactored to "Technical Emerald Minimalism"
 */
const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "The Future of Digital Tutoring in 2026",
            excerpt: "How AI and low-latency communication protocols are reshaping the educational landscape.",
            date: "Jan 12, 2026",
            author: "ADMIN_MATRIX",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Optimized Learning: High-Density Study Methods",
            excerpt: "Techniques for maximizing knowledge retention through spatial repetition and node-based learning.",
            date: "Jan 10, 2026",
            author: "EDUCATION_NODE",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Securing Your Educational Data Flow",
            excerpt: "Why privacy and security are the most critical components of the modern tutor-student handshake.",
            date: "Jan 08, 2026",
            author: "SECURITY_ANALYST",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
        }
    ];

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border bg-border">
                    {posts.map(post => (
                        <article key={post.id} className="group cursor-pointer bg-background border-r border-b border-border p-10 hover:bg-muted/30 transition-colors duration-500">
                            <div className="relative aspect-square w-full overflow-hidden border border-border mb-10 group-hover:border-primary/30 transition-colors">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="size-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="rounded-none bg-background/90 backdrop-blur-md text-foreground border-border text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                        TRANSMISSION_{post.id}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    <span className="flex items-center gap-2"><Clock size={12} className="text-primary" /> {post.date}</span>
                                    <span className="flex items-center gap-2"><User size={12} className="text-primary" /> {post.author}</span>
                                </div>
                                
                                <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter uppercase leading-none italic">
                                    {post.title}
                                </h2>
                                
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                    {post.excerpt}
                                </p>
                                
                                <div className="pt-6 border-t border-border flex items-center justify-between group/link">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Open Dossier</span>
                                    <div className="size-10 border border-border flex items-center justify-center group-hover/link:bg-primary group-hover/link:border-primary group-hover/link:text-primary-foreground transition-all duration-300">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
