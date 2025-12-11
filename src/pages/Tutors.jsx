// tutors page - list tutors
import { useState, useEffect } from 'react'
import TutorCard from "../components/Home/TutorCard"
import demoTutors from '../data/demoTutors.json'
let Tutors = () => {
    let [tutors, setTutors] = useState([])
    let [loading, setLoading] = useState(true)
    console.log('tutors rendering')

    useEffect(() => {
        // demo data
        setTimeout(() => {
            setTutors(demoTutors)
            setLoading(false)
        }, 500)
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Our Tutors</h1>
            <p className="text-gray-600 mb-6">Find the perfect tutor</p>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map(tutor => (
                    // <TutorCard key={tutor.id} tutor={tutor} />
                    <TutorCard key={tutor._id} tutor={tutor} />
                ))}
            </div>
        </div>
    )
}

export default Tutors
