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
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedArea, setSelectedArea] = useState('All');
    const [allSubjects, setAllSubjects] = useState([]);
    const [allClasses, setAllClasses] = useState(['All']);
    const [allAreas, setAllAreas] = useState(['All']);

    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                let params = new URLSearchParams();
                if (searchQuery) params.append('q', searchQuery);
                
                // For multi-subjects, we'll append each one
                selectedSubjects.forEach(sub => params.append('subject', sub));
                
                if (selectedClass !== 'All') params.append('class_name', selectedClass);
                if (selectedArea !== 'All') params.append('location', selectedArea);
                
                if (sortBy === 'ratings' || sortBy === 'salary-low') {
                    params.append('sort', sortBy);
                }

                const response = await axios.get(`${API_URL}/api/tutors?${params.toString()}`);
                setTutors(response.data);

                // Populate filter options dynamically from results if they are not already set
                const subjectsSet = new Set();
                const classesSet = new Set(['All']);
                const areasSet = new Set(['All']);
                
                response.data.forEach(t => {
                    if (t.subjects) {
                        t.subjects.forEach(s => {
                            if (typeof s === 'string') {
                                s.split(',').forEach(sub => subjectsSet.add(sub.trim()));
                            } else {
                                subjectsSet.add(s);
                            }
                        });
                    }
                    if (t.class_name) classesSet.add(t.class_name);
                    if (t.location) {
                        const area = t.location.split(',').pop().trim();
                        if (area) areasSet.add(area);
                    }
                });
                
                setAllSubjects(prev => prev.length === 0 ? Array.from(subjectsSet) : prev);
                setAllClasses(prev => prev.length <= 1 ? Array.from(classesSet) : prev);
                setAllAreas(prev => prev.length <= 1 ? Array.from(areasSet) : prev);
            } catch (error) {
                console.error("Error fetching tutors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, [searchQuery, selectedSubjects, selectedClass, selectedArea, sortBy]);

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
        setSelectedSubjects([]);
        setSelectedClass('All');
        setSelectedArea('All');
    }

    const toggleSubject = (sub) => {
        setSelectedSubjects(prev => 
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
        );
    };

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

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Class</label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="h-10 bg-muted/50 border-border/50 rounded-xl px-4 text-xs font-medium focus:ring-primary/20">
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-2xl p-1 bg-card/95 backdrop-blur-xl max-h-[300px]">
                                        {allClasses.map(cls => (
                                            <SelectItem key={cls} value={cls} className="rounded-xl text-xs font-medium py-2 px-3">{cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Area / Location</label>
                                <Select value={selectedArea} onValueChange={setSelectedArea}>
                                    <SelectTrigger className="h-10 bg-muted/50 border-border/50 rounded-xl px-4 text-xs font-medium focus:ring-primary/20">
                                        <SelectValue placeholder="Select Area" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-2xl p-1 bg-card/95 backdrop-blur-xl max-h-[300px]">
                                        {allAreas.map(area => (
                                            <SelectItem key={area} value={area} className="rounded-xl text-xs font-medium py-2 px-3">{area}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Subjects</label>
                                    {selectedSubjects.length > 0 && (
                                        <button onClick={() => setSelectedSubjects([])} className="text-[9px] font-bold text-primary hover:underline uppercase">Reset</button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar py-1">
                                    {allSubjects.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => toggleSubject(subject)}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all border ${selectedSubjects.includes(subject)
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60 hover:text-foreground'
                                                }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(searchQuery || sortBy !== 'name-az' || selectedSubjects.length > 0 || selectedClass !== 'All' || selectedArea !== 'All') && (
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

