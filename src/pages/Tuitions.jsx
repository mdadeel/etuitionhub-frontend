// Tuitions page - available tuition posts dekhabe
// TODO: pagination add korbo, search o implement korbo
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function Tuitions() {
    let [tuitions, setTuitions] = useState([])
    let [loading, setLoading] = useState(true)
    let [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadTuitions()
    }, [])

    const loadTuitions = async () => {
        try {
            // approved tuitions e load korbo
            let res = await fetch('http://localhost:5000/api/tuitions?status=approved')
            if (res.ok) {
                let data = await res.json()
                setTuitions(data)
                console.log('loaded tuitions:', data.length) // debug
            } else {
                toast.error('Tuitions load hoinai')
            }
        } catch (err) {
            console.error('fetch error:', err)
            toast.error('Server error hoise')
        } finally {
            setLoading(false)
        }
    }

    // basic search - TODO: improve this later
    let filteredTuitions = tuitions.filter(t =>
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Available Tuitions</h1>

            {/* search box */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by subject or location..."
                    className="input input-bordered w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {filteredTuitions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No tuitions found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTuitions.map((tuition) => (
                        <div key={tuition._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{tuition.subject}</h2>
                                <p className="text-sm text-gray-600">Class: {tuition.class_name}</p>
                                <p className="text-sm text-gray-600">Location: {tuition.location}</p>
                                <p className="text-sm text-gray-600">Budget: ৳{tuition.budget}/month</p>
                                <p className="text-sm text-gray-600">Days/Week: {tuition.days_per_week}</p>

                                <div className="card-actions justify-end mt-4">
                                    <Link
                                        to={`/tuition/${tuition._id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Tuitions
