import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TutorCard from "../components/shared/TutorCard"
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
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import API_URL from '../config/api'

const Tutors = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tutors, setTutors] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('name-az')
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [allSubjects, setAllSubjects] = useState(['All']);

    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                let params = new URLSearchParams();
                if (searchQuery) params.append('q', searchQuery);
                if (selectedSubject !== 'All') params.append('subject', selectedSubject);
                if (sortBy === 'ratings' || sortBy === 'salary-low') {
                    params.append('sort', sortBy);
                }

                const response = await axios.get(`${API_URL}/api/tutors?${params.toString()}`);
                setTutors(response.data);

                const subjectsSet = new Set(['All']);
                response.data.forEach(t => {
                    if (t.subjects) t.subjects.forEach(s => subjectsSet.add(s));
                });
                setAllSubjects(Array.from(subjectsSet));
            } catch (error) {
                console.error("Error fetching tutors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, [searchQuery, selectedSubject, sortBy]);

    const filteredAndSortedTutors = useMemo(() => {
        if (!Array.isArray(tutors)) return [];
        let result = [...tutors]

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
            default:
                break
        }

        return result
    }, [tutors, sortBy])

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="w-full px-6 md:px-12 py-4">

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
                    <aside className="md:col-span-3 space-y-6">
                        <AppleCard className="p-6 sticky top-24" hover={false}>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Filter size={14} /> Filters
                            </h3>

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

                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Subjects</label>
                                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {allSubjects.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => setSelectedSubject(subject)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${selectedSubject === subject
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted/50'
                                                }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

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

                    <main className="md:col-span-9">
                        {searchQuery && (
                            <div className="mb-8 flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Searching for:</span>
                                <AppleBadge variant="primary" className="px-3 py-1 normal-case text-sm tracking-normal">"{searchQuery}"</AppleBadge>
                            </div>
                        )}

                        {filteredAndSortedTutors.length === 0 ? (
                            <div className="py-18">
                                <EmptyState
                                    message="No specialists found matching your current parameters."
                                    onAction={handleClear}
                                    actionLabel="Reset Filters"
                                />
                            </div>
                        ) : (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredAndSortedTutors.map((tutor) => (
                                    <motion.div key={tutor._id} variants={itemVariants}>
                                        <TutorCard tutor={tutor} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Tutors

