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
    let [filterClass, setFilterClass] = useState('')
    let [filterLocation, setFilterLocation] = useState('')

    // pagination state
    let [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

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
        // Only show approved tuitions to public
        let result = tuitions.filter(t => t.status === 'approved')

        // search filter - by subject or location
        if (searchQuery) {
            result = result.filter(t =>
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.location.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // class filter
        if (filterClass) {
            result = result.filter(t => t.class_name === filterClass)
        }

        // location filter
        if (filterLocation) {
            result = result.filter(t => t.location.toLowerCase().includes(filterLocation.toLowerCase()))
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
        setFilterClass('')
        setFilterLocation('')
        setCurrentPage(1)
    }

    // Get unique values for filter dropdowns
    const classOptions = [...new Set(tuitions.map(t => t.class_name).filter(Boolean))]
    const locationOptions = [...new Set(tuitions.map(t => t.location).filter(Boolean))]

    // pagination calculations
    const totalPages = Math.ceil(filteredAndSortedTuitions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTuitions = filteredAndSortedTuitions.slice(startIndex, startIndex + itemsPerPage)

    // reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, sortBy, filterClass, filterLocation])

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
            <div className="flex flex-col md:flex-row gap-4 mb-4">
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
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Class Filter */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                >
                    <option value="">All Classes</option>
                    {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>

                {/* Location Filter */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                >
                    <option value="">All Locations</option>
                    {locationOptions.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>

                {/* Clear Button - show only when filters are active */}
                {(searchQuery || sortBy !== 'newest' || filterClass || filterLocation) && (
                    <button
                        className="btn btn-ghost"
                        onClick={handleClearFilters}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500 mb-4">
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedTuitions.map(tuition => (
                            <div key={tuition._id} className="card bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="card-body p-5">
                                    {/* Header with subject and status */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="card-title text-lg text-gray-800">{tuition.subject}</h2>
                                        {tuition.status === 'approved' && (
                                            <span className="badge badge-success badge-sm">Active</span>
                                        )}
                                    </div>

                                    {/* Class info */}
                                    <p className="text-sm font-medium text-teal-600 mb-3">{tuition.class_name}</p>

                                    {/* Details */}
                                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                                        <p className="flex items-center gap-2">
                                            <span>📍</span> {tuition.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span>💰</span> <span className="font-semibold text-gray-800">৳{tuition.salary}/month</span>
                                        </p>
                                        {tuition.days_per_week && (
                                            <p className="flex items-center gap-2">
                                                <span>📅</span> {tuition.days_per_week} days/week
                                            </p>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    <div className="card-actions justify-end pt-2 border-t border-gray-100">
                                        <button
                                            className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white border-none px-4"
                                            onClick={() => navigate(`/tuition/${tuition._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="join">
                                <button
                                    className="join-item btn btn-sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    «
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`join-item btn btn-sm ${currentPage === page ? 'btn-active bg-teal-600 text-white' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="join-item btn btn-sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Tuitions

