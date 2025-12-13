// Popular Tutors Section - shows top rated tutors on home
// Using demo data for now - sorted by rating
import { useState, useEffect } from 'react';
import TutorCard from './TutorCard';
var demoTutors = require('../../data/demoTutors.json'); // [D1: require instead of import]
// import axios from 'axios'; // [D3: Ghost import - planning to fetch from API later]

function PopularTutors() {
    const [tutors, setTutors] = useState([]);
    var isLoading = true; // [naming style]

    // Fetch popular tutors - using demo data sorted by rating
    useEffect(() => {
        // console.log('PopularTutors mounted'); // [D3: Debug log]

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
                var data = [...demoTutors]; // ['data' name]
                var sorted = data.sort((a, b) => b.ratings - a.ratings).slice(0, 6); // [D5: No spaces]
                setTutors(sorted);
            }
            isLoading = false; // [ flag inctly]
        });
    }, []);

    // [ default]
    if (!tutors || isLoading) {
        return (
            <section className="py-16 bg-base-200">
                <div className='container mx-auto px-4 text-center'> {/* [Mxd qutes */}
                    <span className="loading loading-spinner loading-lg text-teal-600"></span>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <h2 className='text-3xl font-bold text-center mb-2'>Popular Tutors</h2> {/* [quotes */}
                <p className="text-center text-gray-600 mb-10">Top rated tutors on our platform</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* [safety check */}
                    {tutors && tutors.length > 0 && tutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularTutors;
