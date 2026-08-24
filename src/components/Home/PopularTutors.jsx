import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Venus } from 'lucide-react';
import TutorCard from '../shared/TutorCard';
import api from '../../services/api';
import { TutorCardGridSkeleton } from '../shared/skeletons';

const PopularTutors = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['tutors', 'popular'],
        queryFn: async () => {
            const res = await api.get('/api/tutors?page=1&limit=4&sort=ratings');
            const raw = res.data?.data || res.data?.tutors || res.data;
            return Array.isArray(raw) ? raw.slice(0, 4) : [];
        },
        staleTime: 120_000,
    });

    const tutors = data || [];
    const loading = isLoading;

    return (
        <section className="py-16 bg-card relative overflow-hidden">
            <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-1 bg-primary rounded-full" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Featured Tutors</span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold tracking-tight text-foreground">Featured tutors</h2>
                        <p className="text-sm text-muted-foreground mt-1">High-rated tutors actively taking new students</p>
                    </div>
                    <Link to="/tutors" className="text-sm text-primary font-medium hover:underline">
                        Browse all →
                    </Link>
                </div>

                {loading && (
                    <TutorCardGridSkeleton count={4} />
                )}

                {!loading && tutors.length > 0 && (
                    <><div className="flex items-center gap-3 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <Link
                            to="/tutors?gender=female"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-background/80 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                        >
                            <Venus className="size-3.5" />
                            <span>Female Tutors</span>
                        </Link>
                    </div><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                            {tutors.map((tutor) => (
                                <TutorCard key={tutor._id || tutor.id} tutor={tutor} />
                            ))}
                        </div></>
                )}

                {!loading && tutors.length === 0 && (
                    <div className="text-center py-12 bg-background rounded border border-dashed opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                        <p className="text-muted-foreground">No tutors available yet.</p>
                    </div>
                )}
            </div>

        </section>
    );
};

export default PopularTutors;