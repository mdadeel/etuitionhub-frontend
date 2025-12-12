// tuitions page - list of tuitions
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from 'react-router-dom'
import demoTuitions from '../data/demoTuitions.json'

let Tuitions = () => {
    let navigate = useNavigate()
    // ftch tuitions
    let [tuitions, setTuitions] = useState([])
    let [loading, setLoading] = useState(true)

    // search and sort state
    let [searchQuery, setSearchQuery] = useState('')
    let [sortBy, setSortBy] = useState('newest')

    console.log('tuitions comp')

    useEffect(() => {
        // demo data use kortesi
        setTimeout(() => {
            setTuitions(demoTuitions)
            setLoading(false)
        }, 500)
    }, [])

    // filtered and sorted tuitions - useMemo for performance
    const filteredAndSortedTuitions = useMemo(() => {
        let result = [...tuitions]

        // search filter - by subject or location
        if (searchQuery) {
            result = result.filter(t =>
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.location.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // sorting logic
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                break
            case 'salary-high':
                result.sort((a, b) => b.salary - a.salary)
                break
            case 'salary-low':
                result.sort((a, b) => a.salary - b.salary)
                break
            default:
                break
        }

        return result
    }, [tuitions, searchQuery, sortBy])

    // clear all filters
    const handleClearFilters = () => {
        setSearchQuery('')
        setSortBy('newest')
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Available Tuitions</h1>
            <p className="text-gray-600 mb-6">Find tuition jobs</p>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="🔍 Search by subject or location..."
                        className="input input-bordered w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Sort Dropdown */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                </select>

                {/* Clear Button - show only when filters are active */}
                {(searchQuery || sortBy !== 'newest') && (
                    <button
                        className="btn btn-ghost"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 mb-4">
                Showing {filteredAndSortedTuitions.length} tuition{filteredAndSortedTuitions.length !== 1 ? 's' : ''}
            </p>

            {/* Tuitions Grid */}
            {filteredAndSortedTuitions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No tuitions found matching your criteria</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedTuitions.map(tuition => (
                        <div key={tuition._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{tuition.subject}</h2>
                                <p className="text-sm text-gray-600">{tuition.class_name}</p>
// <p className="text-sm">📍 {tuition.location}</p>
                                <p className="text-sm">📍 {tuition.location}</p>
                                <p className="text-sm">💰 ৳{tuition.salary}/month</p>
                                <div className="card-actions justify-end">
                                    <button
                                        className="btn bg-teal-600 text-white hover:bg-teal-700 btn-sm border-none"
                                        onClick={() => navigate(`/tuition/${tuition._id}`)}
                                    >
                                        Apply
                                    </button>
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
