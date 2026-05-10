import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from '../shared/TutorCard';
import demoTutors from '../../data/demoTutors.json';

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        if (demoTutors && Array.isArray(demoTutors)) {
            setTutors(demoTutors.slice(0, 4));
        }
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-1">Featured tutors</h2>
                        <p className="text-slate-600">High-rated tutors actively taking new students</p>
                    </div>
                    <Link to="/tutors" className="text-sm text-blue-600 font-medium hover:underline">
                        Browse all →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {tutors.map((tutor) => (
                        <TutorCard key={tutor._id || tutor.id} tutor={tutor} />
                    ))}
                </div>

                {tutors.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                        <p className="text-slate-500">Loading tutors...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularTutors;