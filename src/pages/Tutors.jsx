// tutors page - list tutors
import { useState, useEffect } from 'react'

import { useMemo } from 'react'
import TutorCard from "../components/Home/TutorCard"
import demoTutors from '../data/demoTutors.json'

import LoadingSpinner from '../components/shared/LoadingSpinner'
import EmptyState from '../components/shared/EmptyState'

const Tutors = () => {
    const [tutors, setTutors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('name-az')

    useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            setTutors(demoTutors)
            setLoading(false)
        }, 500)
    }, [])

    const filteredAndSortedTutors = useMemo(() => {
        let result = [...tutors]

        if (searchQuery) {
            result = result.filter(t =>
                t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        switch (sortBy) {
            case 'name-az':
                result.sort((a, b) => a.displayName.localeCompare(b.displayName))
                break
            case 'name-za':
                result.sort((a, b) => b.displayName.localeCompare(a.displayName))
                break
            case 'exp-high':
                result.sort((a, b) => {
                    const aExp = parseInt(a.experience) || 0
                    const bExp = parseInt(b.experience) || 0
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

    const handleClear = () => {
        setSearchQuery('')
        setSortBy('name-az')
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 pb-40">
            {/* <header className="mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Verified Talent</span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Elite Education Experts</h1>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Connect with the most qualified academic professionals in Bangladesh. Every profile undergoes rigorous verification to ensure quality and trust.
                        </p>
                    </div>
                </div>
            </header> */}

            {/* Search & Sort Controls */}
            <div className="flex flex-col gap-6 mb-16">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Filter by name, subject, or specialization..."
                            className="input-quiet h-12 pl-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="input-quiet h-12 w-full md:w-48 appearance-none bg-white cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name-az">Name: A-Z</option>
                        <option value="name-za">Name: Z-A</option>
                        <option value="exp-high">Experience Level</option>
                        <option value="salary-low">Salary: Low to High</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {filteredAndSortedTutors.length} Experts Available
                    </div>
                    {(searchQuery || sortBy !== 'name-az') && (
                        <button
                            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                            onClick={handleClear}
                        >
                            Reset Discovery
                        </button>
                    )}
                </div>
            </div>

            {filteredAndSortedTutors.length === 0 ? (
                <EmptyState
                    message="No experts found matching your requirements"
                    onAction={handleClear}
                    actionLabel="Reset Parameters"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedTutors.map(tutor => (
                        <div key={tutor._id} className="fade-up">
                            <TutorCard tutor={tutor} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Tutors
