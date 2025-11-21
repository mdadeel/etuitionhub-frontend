// Tutors page - sob available tutors dekhabe
// demo data use kortesi - API ready hoinai yet
import { useState, useEffect } from 'react';
import TutorCard from '../components/Home/TutorCard';
import demoTutors from '../data/demoTutors.json';

function Tutors() {
    let [tutors, setTutors] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        // demo data use kortesi - API ready na
        setTimeout(() => {
            setTutors(demoTutors);
            setLoading(false);
        }, 500); // loading dekhate small delay
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Our Tutors</h1>
            <p className="text-gray-600 mb-6">Find the perfect tutor for your needs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map(tutor => (
                    <TutorCard key={tutor._id} tutor={tutor} />
                ))}
            </div>
        </div>
    );
}

export default Tutors;
