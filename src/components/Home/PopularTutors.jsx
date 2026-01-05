// Popular Tutors Section - shows top rated tutors on home
// Using demo data for now - sorted by rating
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorCard from './TutorCard';
import demoTutors from '../../data/demoTutors.json'
// import axios from 'axios';

const PopularTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simple delay to simulate fetching
        setTimeout(() => {
            if (demoTutors && Array.isArray(demoTutors)) {
                const sorted = [...demoTutors].sort((a, b) => b.ratings - a.ratings).slice(0, 6);
                setTutors(sorted);
            }
            setIsLoading(false);
        }, 500);
    }, []);

    if (isLoading) {
        return (
            <section className="py-24 bg-white">
                <div className='max-w-7xl mx-auto px-6 text-center'>
                    <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Curation</span>
                        <h2 className='text-3xl font-extrabold tracking-tight text-gray-900'>Popular Tutors</h2>
                    </div>
                    <Link to="/tutors" className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2">
                        View All Experts <span>→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularTutors;
