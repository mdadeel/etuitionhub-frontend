import { useState, useEffect, useMemo } from 'react'
import TutorCard from "../components/Home/TutorCard"
import demoTutors from '../data/demoTutors.json'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import EmptyState from '../components/shared/EmptyState'
import { Search, SlidersHorizontal, UserCheck, Filter } from 'lucide-react'
import { Input } from "@/components/ui/input"
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
 * Refactored to "Figma-inspired Human Crafted"
 * Features: Restrained typography, nuanced spacing, calm UI
 */
const Tutors = () => {
    const [tutors, setTutors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('name-az')

    useEffect(() => {
        // Simulating fetch
        const timer = setTimeout(() => {
            setTutors(demoTutors)
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner />
        </div>
    )

    return (
        <div className="bg-background min-h-screen py-12 md:py-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12 pb-10 border-b border-border/40">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-[1.15] mb-4 tracking-tight">
                            Find the right specialist tutor.
                        </h1>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                            Connect with specialized academic professionals. 
                            Every tutor is verified to ensure quality and trust.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-2xl font-semibold text-foreground tracking-tight">{filteredAndSortedTutors.length}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Total Tutors</p>
                        </div>
                        <div className="w-px h-8 bg-border/60"></div>
                        <div>
                            <p className="text-2xl font-semibold text-primary tracking-tight">98%</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Satisfaction</p>
                        </div>
                    </div>
                </div>

                {/* Search & Sort Controls */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row gap-3 p-3 bg-card border border-border/60 rounded-xl shadow-sm">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <Input
                                type="text"
                                placeholder="Search by name or subject..."
                                className="h-11 pl-11 rounded-lg border-none bg-muted/40 font-medium focus-visible:ring-1 focus-visible:ring-border text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="w-full md:w-64">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-11 rounded-lg border-none bg-muted/40 font-medium focus:ring-1 focus:ring-border text-sm px-4">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal size={14} className="text-muted-foreground" />
                                        <SelectValue placeholder="Sort results" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-border shadow-sm p-1">
                                    <SelectItem value="name-az" className="rounded-md text-sm">Name: A to Z</SelectItem>
                                    <SelectItem value="name-za" className="rounded-md text-sm">Name: Z to A</SelectItem>
                                    <SelectItem value="exp-high" className="rounded-md text-sm">Highest Experience</SelectItem>
                                    <SelectItem value="salary-low" className="rounded-md text-sm">Lowest Fee First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 px-1">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <UserCheck size={14} className="text-muted-foreground/70" />
                            Showing {filteredAndSortedTutors.length} verified tutors
                        </div>
                        {(searchQuery || sortBy !== 'name-az') && (
                            <Button
                                variant="ghost"
                                className="text-xs font-medium text-foreground hover:bg-muted/50 rounded-md h-8 px-3"
                                onClick={handleClear}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                {filteredAndSortedTutors.length === 0 ? (
                    <EmptyState
                        message="No tutors found matching your search criteria."
                        onAction={handleClear}
                        actionLabel="Clear Search Filters"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedTutors.map(tutor => (
                            <TutorCard key={tutor._id} tutor={tutor} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tutors
