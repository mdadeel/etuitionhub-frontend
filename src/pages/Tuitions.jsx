// tuitions page - list of tuitions
import { useState, useEffect } from "react"
import demoTuitions from '../data/demoTuitions.json'
let Tuitions = () => {
    // ftch tuitions
    let [tuitions, setTuitions] = useState([])
    let [loading, setLoading] = useState(true)
    console.log('tuitions comp')

    useEffect(() => {
        // demo data use kortesi
        setTimeout(() => {
            setTuitions(demoTuitions)
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
            <h1 className="text-3xl font-bold mb-2">Available Tuitions</h1>
            <p className="text-gray-600 mb-6">Find tuition jobs</p>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tuitions.map(tuition => (
                    <div key={tuition._id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">{tuition.subject}</h2>
                            <p className="text-sm text-gray-600">{tuition.class}</p>
// <p className="text-sm">📍 {tuition.location}</p>
                            <p className="text-sm">📍 {tuition.location}</p>
                            <p className="text-sm">💰 {tuition.salary}</p>
                            <div className="card-actions justify-end">
                                <button className="btn bg-teal-600 text-white hover:bg-teal-700 btn-sm border-none">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tuitions
