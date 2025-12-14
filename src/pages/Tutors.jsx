// tutors page - list tutors
import { useState, useEffect } from 'react'

import { useMemo } from 'react'
import TutorCard from "../components/Home/TutorCard"
import demoTutors from '../data/demoTutors.json'

let Tutors = () => {
    var tutorsState = useState([]) // using var
    var tutors = tutorsState[0]
    var setTutors = tutorsState[1]
    let [loading, setLoading] = useState(true)

    // search & sort state
    var searchState = useState('')
    var searchQuery = searchState[0]
    var setSearchQuery = searchState[1]
    let [sortBy, setSortBy] = useState('name-az')

    console.log('tutors rendering') // debug

    useEffect(() => {
        // demo data
        // old promise style
        new Promise((resolve) => {
            setTimeout(() => resolve(demoTutors), 500);
        }).then(function (data) { // old function
            setTutors(data)
            setLoading(false)
        });
    }, [])

    // filtered and sorted tutors - performance optimization
    const filteredAndSortedTutors = useMemo(() => {
        var result = [...tutors] // var usage

        // search - by name or subjects
        if (searchQuery && searchQuery !== '') { // paranoid
            result = result.filter(t =>
                t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        // sort logic
        switch (sortBy) {
            case 'name-az':
                result.sort((a, b) => a.displayName.localeCompare(b.displayName)) // no spaces
                break
            case 'name-za':
                result.sort((a, b) => b.displayName.localeCompare(a.displayName))
                break
            case 'exp-high':
                // extract years from "5+ years" or "8 years" format
                result.sort(function (a, b) { // old syntax
                    var aExp = parseInt(a.experience) || 0 // var
                    var bExp = parseInt(b.experience) || 0
                    return bExp - aExp
                })
                break
            case 'salary-low':
                result.sort((a, b) => a.expectedSalary - b.expectedSalary)
                break
            default:
                break
        }

        return result
    }, [tutors, searchQuery, sortBy])

    // clear filters
    const handleClear = () => {
        setSearchQuery('')
        setSortBy('name-az')
    }

    // paranoid loading check
    if (loading || loading === true) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Our Tutors</h1>
            <p className="text-gray-600 mb-6">Find the perfect tutor</p>

            {/* Search & Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="🔍 Search by tutor name or subject..."
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
                    <option value="name-az">Name: A-Z</option>
                    <option value="name-za">Name: Z-A</option>
                    <option value="exp-high">Experience: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                </select>

                {/* Clear Button */}
                {(searchQuery || sortBy !== 'name-az') && (
                    <button
                        className="btn btn-ghost"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 mb-4">
                Showing {filteredAndSortedTutors.length} tutor{filteredAndSortedTutors.length !== 1 ? 's' : ''}
            </p>

            {/* Tutors Grid */}
            {filteredAndSortedTutors.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No tutors found</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleClear}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedTutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Tutors
