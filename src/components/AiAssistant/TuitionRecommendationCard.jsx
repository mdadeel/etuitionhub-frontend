// components/AiAssistant/TuitionRecommendationCard.jsx
// recommended tuition posts card that appears below an AI response when a tutor gets recommended posts.
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TuitionRecommendationCard({ tuitions = [], subject }) {
    if (!tuitions || tuitions.length === 0) return null;

    return (
        <section
            className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4 animate-fade-in-up"
            style={{ animationDelay: '500ms', animationFillMode: 'both' }}
        >
            <header className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center size-6 rounded-md bg-primary/20 text-primary">
                    <Briefcase size={13} strokeWidth={2.4} />
                </span>
                <h4 className="text-[11px] font-label font-semibold uppercase tracking-[0.1em] text-primary">
                    Recommended Tuition Jobs
                </h4>
                {subject && (
                    <span className="ml-auto text-[11px] font-label tracking-wider text-muted-foreground">
                        {subject}
                    </span>
                )}
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tuitions.map((post) => {
                    const displaySalary = post.salary ? `৳${post.salary.toLocaleString()}/mo` : 'Negotiable';
                    return (
                        <Link
                            key={post._id}
                            to={`/tuition/${post._id}`}
                            className={cn(
                                'group flex flex-col justify-between gap-2 rounded-lg border border-border bg-card/80 p-3',
                                'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300',
                            )}
                        >
                            <div className="flex justify-between items-start gap-2 w-full">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                        {post.class_name ? `${post.class_name} · ` : ''}{post.subject}
                                    </p>
                                    <p className="text-xs font-semibold text-primary/90 mt-0.5">
                                        {displaySalary}
                                    </p>
                                </div>
                                {post.isNewPost && (
                                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider bg-success/10 text-success border border-success/20 px-1.5 py-0.5 rounded-md">
                                        New
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between w-full pt-1.5 border-t border-border/40 mt-1">
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0 flex-1 pr-2">
                                    {post.location && (
                                        <span className="flex items-center gap-0.5 truncate max-w-[100px]">
                                            <MapPin size={10} className="shrink-0 text-primary/70" />
                                            <span className="truncate">{post.location.split(',')[0]}</span>
                                        </span>
                                    )}
                                    {post.medium && (
                                        <>
                                            <span className="shrink-0">•</span>
                                            <span className="truncate capitalize">{post.medium}</span>
                                        </>
                                    )}
                                </div>
                                <ArrowRight
                                    size={12}
                                    className="text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
