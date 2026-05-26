import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from '../shared/TutorCard';
import api from '../../services/api';

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/tutors?page=1&limit=4&sort=rating')
            .then(res => {
                // API returns { tutors: [...] } or just an array
                const data = res.data?.tutors || res.data;
                if (Array.isArray(data)) setTutors(data.slice(0, 4));
            })
            .catch(() => {
                // Silently fail — section just won't show
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-16 bg-card">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-1">Featured tutors</h2>
                        <p className="text-muted-foreground">High-rated tutors actively taking new students</p>
                    </div>
                    <Link to="/tutors" className="text-sm text-blue-600 font-medium hover:underline">
                        Browse all →
                    </Link>
                </div>

                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="rounded-2xl border border-border bg-muted animate-pulse h-64" />
                        ))}
                    </div>
                )}

                {!loading && tutors.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                        {tutors.map((tutor) => (
                            <TutorCard key={tutor._id || tutor.id} tutor={tutor} />
                        ))}
                    </div>
                )}

                {!loading && tutors.length === 0 && (
                    <div className="text-center py-12 bg-background rounded-xl border border-dashed">
                        <p className="text-muted-foreground">No tutors available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularTutors;