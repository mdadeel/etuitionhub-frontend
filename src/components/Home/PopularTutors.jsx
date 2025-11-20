// Popular Tutors Section - shows top rated tutors on home
// Using demo data for now - sorted by rating
import { useState, useEffect } from 'react';
import TutorCard from './TutorCard';
import demoTutors from '../../data/demoTutors.json';

function PopularTutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch popular tutors - using demo data sorted by rating
    useEffect(() => {
        setTimeout(() => {
            // Sort by ratings and take top 6
            const sorted = [...demoTutors].sort((a, b) => b.ratings - a.ratings).slice(0, 6);
            setTutors(sorted);
            setLoading(false);
        }, 300);
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 text-center">
                    <span className="loading loading-spinner loading-lg text-teal-600"></span>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Popular Tutors</h2>
                <p className="text-center text-gray-600 mb-10">Top rated tutors on our platform</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularTutors;
