import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TutorCard from "../components/Home/TutorCard"
import demoTutors from '../data/demoTutors.json'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import EmptyState from '../components/shared/EmptyState'
import { SlidersHorizontal, UserCheck, ShieldCheck, Filter, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

/**
 * Tutors Page
 * Refactored to "Apple macOS Sidebar Layout"
 * Features: Left sidebar filters, search integration with Nav, compact grid.
 */
const Tutors = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tutors, setTutors] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('name-az')
    const [selectedSubject, setSelectedSubject] = useState('All');

    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const timer = setTimeout(() => {
            setTutors(demoTutors)
            setLoading(false)
        }, 400)
        return () => clearTimeout(timer)
    }, [])

    const allSubjects = useMemo(() => {
        const subjects = new Set(['All']);
        demoTutors.forEach(t => t.subjects.forEach(s => subjects.add(s)));
        return Array.from(subjects);
    }, []);

    const filteredAndSortedTutors = useMemo(() => {
        let result = [...tutors]

        if (searchQuery) {
            result = result.filter(t =>
                t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        if (selectedSubject !== 'All') {
            result = result.filter(t => t.subjects.includes(selectedSubject));
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
    }, [tutors, searchQuery, sortBy, selectedSubject])

    const handleClear = () => {
        setSearchParams({});
        setSortBy('name-az');
        setSelectedSubject('All');
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-apple-gray-100 dark:bg-apple-gray-900">
            <LoadingSpinner />
        </div>
    )

    return (
        <div className="bg-apple-gray-100 dark:bg-apple-gray-950 min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header (Apple Style) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-apple-gray-900 dark:text-white tracking-tight">
                            Specialist Directory
                        </h1>
                        <p className="text-[13px] text-apple-gray-500 font-medium mt-1">
                            Browse through our verified network of academic professionals.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-apple-gray-900 rounded-lg border border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-sm">
                            <span className="text-lg font-bold text-apple-gray-900 dark:text-white tabular-nums">{filteredAndSortedTutors.length}</span>
                            <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-tight">Nodes</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-apple-gray-900 rounded-lg border border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-sm">
                            <ShieldCheck size={14} className="text-apple-blue" />
                            <span className="text-lg font-bold text-apple-gray-900 dark:text-white tracking-tight">98%</span>
                            <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-tight">Verified</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar Filters (macOS Style) */}
                    <aside className="md:col-span-3 lg:col-span-2 space-y-6">
                        <div className="apple-card p-4 bg-white/50 dark:bg-apple-gray-900/50 backdrop-blur-sm">
                            <h3 className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Filter size={12} /> Filters
                            </h3>
                            
                            {/* Sort Filter */}
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-apple-gray-500 uppercase mb-2 block">Sort By</label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="mac-input h-8 border-none bg-white dark:bg-apple-gray-800 shadow-apple-sm">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <SlidersHorizontal size={10} className="text-apple-gray-400 shrink-0" />
                                            <SelectValue placeholder="Sort" className="text-xs" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-lg p-1">
                                        <SelectItem value="name-az" className="rounded-md text-[11px] font-medium py-1.5">A to Z</SelectItem>
                                        <SelectItem value="name-za" className="rounded-md text-[11px] font-medium py-1.5">Z to A</SelectItem>
                                        <SelectItem value="exp-high" className="rounded-md text-[11px] font-medium py-1.5">Exp: High</SelectItem>
                                        <SelectItem value="salary-low" className="rounded-md text-[11px] font-medium py-1.5">Fee: Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Subjects Filter */}
                            <div>
                                <label className="text-[10px] font-bold text-apple-gray-500 uppercase mb-2 block">Specialization</label>
                                <div className="space-y-1">
                                    {allSubjects.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => setSelectedSubject(subject)}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                                                selectedSubject === subject 
                                                ? 'bg-apple-blue text-white' 
                                                : 'text-apple-gray-600 dark:text-apple-gray-400 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                                            }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear All */}
                            {(searchQuery || sortBy !== 'name-az' || selectedSubject !== 'All') && (
                                <button
                                    onClick={handleClear}
                                    className="w-full mt-6 flex items-center justify-center gap-1.5 text-[10px] font-bold text-apple-blue hover:text-apple-blue/80 py-2 border border-apple-blue/20 rounded-lg hover:bg-apple-blue/5 transition-all uppercase tracking-tight"
                                >
                                    <X size={10} /> Reset All
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content (Cols-9) */}
                    <main className="md:col-span-9 lg:col-span-10">
                        {searchQuery && (
                            <div className="mb-6 flex items-center gap-2">
                                <span className="text-[11px] font-bold text-apple-gray-400 uppercase tracking-tight">Results for:</span>
                                <span className="px-2 py-0.5 bg-apple-blue/10 text-apple-blue text-[11px] font-bold rounded-md">"{searchQuery}"</span>
                            </div>
                        )}

                        {filteredAndSortedTutors.length === 0 ? (
                            <div className="py-20 bg-white dark:bg-apple-gray-900 rounded-container border border-dashed border-apple-gray-200 dark:border-apple-gray-800">
                                <EmptyState
                                    message="No specialists found matching your current parameters."
                                    onAction={handleClear}
                                    actionLabel="Clear Selection"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                                {filteredAndSortedTutors.map(tutor => (
                                    <div key={tutor._id} className="transform hover:scale-[1.01] transition-all duration-300">
                                        <TutorCard tutor={tutor} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Tutors
