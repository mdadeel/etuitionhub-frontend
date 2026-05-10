import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TutorCard from "../components/shared/TutorCard"
import LoadingSpinner from '../components/shared/LoadingSpinner'
import EmptyState from '../components/shared/EmptyState'
import { SlidersHorizontal, ShieldCheck, Filter, X, LayoutGrid } from 'lucide-react'
import FilterSelect from '../components/shared/FilterSelect'
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
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchTutors = async () => {
            if (isInitialLoad) setLoading(true);
            else setIsFiltering(true);
            try {
                let params = new URLSearchParams();
                if (searchQuery) params.append('q', searchQuery);

                selectedSubjects.forEach(sub => params.append('subject', sub));

                if (selectedClass !== 'All') params.append('class_name', selectedClass);
                if (selectedArea !== 'All') params.append('location', selectedArea);

                if (sortBy === 'ratings' || sortBy === 'salary-low') {
                    params.append('sort', sortBy);
                }

                const response = await axios.get(`${API_URL}/api/tutors?${params.toString()}`);
                setTutors(response.data);

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
                setIsInitialLoad(false);
                setIsFiltering(false);
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

    if (loading && isInitialLoad) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner />
        </div>
    )

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Find a Tutor</h1>
                        <p className="text-sm text-slate-600">Browse through our verified network of academic professionals.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
                            <span className="text-lg font-semibold text-slate-900">{filteredAndSortedTutors.length}</span>
                            <span className="text-xs text-slate-500">Tutors</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
                            <ShieldCheck size={16} className="text-blue-600" />
                            <span className="text-lg font-semibold text-slate-900">98%</span>
                            <span className="text-xs text-slate-500">Verified</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 sticky top-20">
                            <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                                <Filter size={14} /> Filters
                            </h3>

                            <div className="space-y-4">
                                <FilterSelect
                                    label="Sort by"
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                    icon={SlidersHorizontal}
                                    options={[
                                        { value: 'name-az', label: 'Alphabetical: A-Z' },
                                        { value: 'name-za', label: 'Alphabetical: Z-A' },
                                        { value: 'exp-high', label: 'Experience: High' },
                                        { value: 'salary-low', label: 'Fee: Low to High' },
                                    ]}
                                />

                                <FilterSelect
                                    label="Class"
                                    value={selectedClass}
                                    onValueChange={setSelectedClass}
                                    icon={LayoutGrid}
                                    placeholder="Select Class"
                                    options={allClasses}
                                />

                                <FilterSelect
                                    label="Area / Location"
                                    value={selectedArea}
                                    onValueChange={setSelectedArea}
                                    placeholder="Select Area"
                                    options={allAreas}
                                />

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-600 block">Subjects</label>
                                        {selectedSubjects.length > 0 && (
                                            <button onClick={() => setSelectedSubjects([])} className="text-xs text-blue-600 hover:underline">Reset</button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                                        {allSubjects.map(subject => (
                                            <button
                                                key={subject}
                                                onClick={() => toggleSubject(subject)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                    selectedSubjects.includes(subject)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {(searchQuery || sortBy !== 'name-az' || selectedSubjects.length > 0 || selectedClass !== 'All' || selectedArea !== 'All') && (
                                <button
                                    onClick={handleClear}
                                    className="w-full mt-4 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 flex items-center justify-center gap-2"
                                >
                                    <X size={14} /> Clear All
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 relative">
                        {isFiltering && (
                            <div className="absolute inset-0 z-10 bg-slate-50/80 flex items-center justify-center rounded-lg">
                                <LoadingSpinner />
                            </div>
                        )}

                        {searchQuery && (
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-sm text-slate-500">Searching for:</span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium">"{searchQuery}"</span>
                            </div>
                        )}

                        {filteredAndSortedTutors.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    message="No tutors found matching your criteria."
                                    onAction={handleClear}
                                    actionLabel="Reset Filters"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredAndSortedTutors.map((tutor) => (
                                    <TutorCard key={tutor._id} tutor={tutor} />
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