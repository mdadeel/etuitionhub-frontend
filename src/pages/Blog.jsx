import { useTheme } from '../contexts/ThemeContext';

const Blog = () => {
    const { theme } = useTheme();

    const posts = [
        {
            id: 1,
            title: "The Future of Digital Tutoring in 2026",
            excerpt: "How AI and low-latency communication protocols are reshaping the educational landscape.",
            date: "Jan 12, 2026",
            author: "Admin Matrix",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Optimized Learning: High-Density Study Methods",
            excerpt: "Techniques for maximizing knowledge retention through spatial repetition and node-based learning.",
            date: "Jan 10, 2026",
            author: "Education Node",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Securing Your Educational Data Flow",
            excerpt: "Why privacy and security are the most critical components of the modern tutor-student handshake.",
            date: "Jan 08, 2026",
            author: "Security Analyst",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
        }
    ];

    return (
        <div className="bg-[var(--color-surface)] min-h-screen py-24 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-12 h-[2px] bg-teal-600"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">Cognitive Stream</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[var(--color-text-primary)] leading-[1.1] mb-8">
                        Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Insights</span>
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                        Exploring the intersection of technology, education, and synchronization. Stay updated with the latest operational updates.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map(post => (
                        <article key={post.id} className="group cursor-pointer">
                            <div className="relative h-64 w-full overflow-hidden rounded-2xl mb-6 bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/80 to-transparent"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-teal-600">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 bg-[var(--color-border)] rounded-full"></span>
                                    <span className="text-[var(--color-text-muted)]">{post.author}</span>
                                </div>
                                <h2 className="text-2xl font-black text-[var(--color-text-primary)] group-hover:text-teal-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] group-hover:gap-4 transition-all">
                                    Read Full Transmission <span className="text-teal-600">→</span>
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
