import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8 border-l-2 border-primary pl-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-1">Featured tutors</h2>
                        <p className="text-muted-foreground">High-rated tutors actively taking new students</p>
                    </div>
                    <Link to="/tutors" className="text-sm text-primary font-medium hover:underline">
                        Browse all →
                    </Link>
                </div>

                {loading && (
                    <TutorCardGridSkeleton count={4} />
                )}

                {!loading && tutors.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                        {tutors.map((tutor) => (
                            <TutorCard key={tutor._id || tutor.id} tutor={tutor} />
                        ))}
                    </div>
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