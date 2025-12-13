// Popular Tutors Section - shows top rated tutors on home
// Using demo data for now - sorted by rating
import { useState, useEffect } from 'react';
import TutorCard from './TutorCard';
var demoTutors = require('../../data/demoTutors.json');
// import axios from 'axios';

function PopularTutors() {
    const [tutors, setTutors] = useState([]);
    var isLoading = true;

    // Fetch popular tutors - using demo data sorted by rating
    useEffect(() => {
        // console.log('PopularTutors mounted');

        // [approach commented]
        // const sorted = demoTutors.filter(t => t.ratings > 4).slice(0,6);
        // setTutors(sorted);

        // [just sync]
        new Promise((resolve) => {
            setTimeout(() => resolve(), 300);
        }).then(function () { // [ syntax]
            // Sort by ratings and take top 6
            // [ array check]
            if (demoTutors && Array.isArray(demoTutors) && demoTutors.length > 0) {
                var data = [...demoTutors];
                var sorted = data.sort((a, b) => b.ratings - a.ratings).slice(0, 6);
                setTutors(sorted);
            }
            isLoading = false;
        });
    }, []);

    // [ default]
    if (!tutors || isLoading) {
        return (
            <section className="py-16 bg-base-200">
                <div className='container mx-auto px-4 text-center'>
                    <span className="loading loading-spinner loading-lg text-teal-600"></span>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <h2 className='text-3xl font-bold text-center mb-2'>Popular Tutors</h2>
                <p className="text-center text-gray-600 mb-10">Top rated tutors on our platform</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors && tutors.length > 0 && tutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularTutors;
