import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TutorCard from "../components/Home/TutorCard"
import demoTutors from '../data/demoTutors.json'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import EmptyState from '../components/shared/EmptyState'
import { SlidersHorizontal, ShieldCheck, Filter, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AppleBadge, AppleCard, AppleButton, AppleHeader } from '../components/shared/AppleUI/index'
import AOS from 'aos'

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
        if (Array.isArray(demoTutors)) {
            demoTutors.forEach(t => {
                if (t && Array.isArray(t.subjects)) {
                    t.subjects.forEach(s => subjects.add(s));
                }
            });
        }
        return Array.from(subjects);
    }, []);

    const filteredAndSortedTutors = useMemo(() => {
        if (!Array.isArray(tutors)) return [];
        let result = [...tutors]

        if (searchQuery) {
            result = result.filter(t =>
                (t.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (Array.isArray(t.subjects) && t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
            )
        }

        if (selectedSubject !== 'All') {
            result = result.filter(t => Array.isArray(t.subjects) && t.subjects.includes(selectedSubject));
        }

        switch (sortBy) {
            case 'name-az':
                result.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''))
                break
            case 'name-za':
                result.sort((a, b) => (b.displayName || '').localeCompare(a.displayName || ''))
                break
            case 'exp-high':
                result.sort((a, b) => {
                    const aExp = parseInt(a.experience) || 0
                    const bExp = parseInt(b.experience) || 0
                    return bExp - aExp
                })
                break
            case 'salary-low':
                result.sort((a, b) => (a.expectedSalary || 0) - (b.expectedSalary || 0))
                break
            default:
                break
        }

        return result
    }, [tutors, searchQuery, sortBy, selectedSubject])

    useEffect(() => {
        if (typeof AOS !== 'undefined' && AOS.refresh) {
            AOS.refresh();
        }
    }, [filteredAndSortedTutors.length]);

    const handleClear = () => {
        setSearchParams({});
        setSortBy('name-az');
        setSelectedSubject('All');
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner />
        </div>
    )

    return (
        <div className="bg-background min-h-screen">
            <div className="w-full px-6 md:px-12 py-4">
                
                {/* Header */}
                <AppleHeader 
                    title="Find a Tutor"
                    subtitle="Browse through our verified network of academic professionals across the nation."
                   
                    action={
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl border border-border/50">
                                <span className="text-xl font-bold text-foreground tabular-nums">{filteredAndSortedTutors.length}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tutors</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl border border-border/50">
                                <ShieldCheck size={16} className="text-primary" />
                                <span className="text-xl font-bold text-foreground tracking-tight">98%</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified</span>
                            </div>
                        </div>
                    }
                />

                <div className="flex flex-col md:grid md:grid-cols-12 gap-10">
                    
                    {/* Left Sidebar Filters */}
                    <aside className="md:col-span-3 space-y-6">
                        <AppleCard className="p-6 sticky top-24" hover={false}>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Filter size={14} /> Filters
                            </h3>
                            
                            {/* Sort Filter */}
                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Sort by</label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-10 bg-muted/50 border-border/50 rounded-xl px-4 text-xs font-medium focus:ring-primary/20">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal size={12} className="text-muted-foreground" />
                                            <SelectValue placeholder="Sort" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-2xl p-1 bg-card/95 backdrop-blur-xl">
                                        <SelectItem value="name-az" className="rounded-xl text-xs font-medium py-2 px-3">Alphabetical: A-Z</SelectItem>
                                        <SelectItem value="name-za" className="rounded-xl text-xs font-medium py-2 px-3">Alphabetical: Z-A</SelectItem>
                                        <SelectItem value="exp-high" className="rounded-xl text-xs font-medium py-2 px-3">Experience: High</SelectItem>
                                        <SelectItem value="salary-low" className="rounded-xl text-xs font-medium py-2 px-3">Fee: Low to High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Subjects Filter */}
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Subjects</label>
                                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {allSubjects.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => setSelectedSubject(subject)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                selectedSubject === subject 
                                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                                : 'text-muted-foreground hover:bg-muted/50'
                                            }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear All */}
                            {(searchQuery || sortBy !== 'name-az' || selectedSubject !== 'All') && (
                                <AppleButton
                                    onClick={handleClear}
                                    variant="ghost"
                                    className="w-full mt-8 text-[10px] font-bold uppercase tracking-widest border border-border/50 hover:bg-muted/50 rounded-xl"
                                >
                                    <X size={12} className="mr-2" /> Clear All
                                </AppleButton>
                            )}
                        </AppleCard>
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-9">
                        {searchQuery && (
                            <div className="mb-8 flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Searching for:</span>
                                <AppleBadge variant="primary" className="px-3 py-1 normal-case text-sm tracking-normal">"{searchQuery}"</AppleBadge>
                            </div>
                        )}

                        {filteredAndSortedTutors.length === 0 ? (
                            <div className="py-32">
                                <EmptyState
                                    message="No specialists found matching your current parameters."
                                    onAction={handleClear}
                                    actionLabel="Reset Filters"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAndSortedTutors.map((tutor, idx) => (
                                    <div key={tutor._id} data-aos="fade-up" data-aos-delay={idx * 50}>
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
