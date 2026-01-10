import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";
import demoTuitions from '../data/demoTuitions.json';
import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TuitionCard from '../components/Tuitions/TuitionCard';

const TuitionDetails = () => {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    const navigate = useNavigate();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        qualifications: "",
        experience: '',
        expectedSalary: ""
    });

    useEffect(() => {
        const fetchTuitionDetails = async () => {
            try {
                const response = await api.get(`/api/tuitions/${id}`);
                setTuition(response.data);
            } catch (error) {
                const demoTuition = demoTuitions.find(t => t._id === id);
                if (demoTuition) {
                    setTuition(demoTuition);
                } else {
                    toast.error('Requirement not found.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTuitionDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !dbUser) {
            toast.error('Session required.');
            navigate('/login');
            return;
        }

        if (!formData.qualifications || !formData.experience || !formData.expectedSalary) {
            toast.error("All parameters required.");
            return;
        }

        if (formData.expectedSalary < 1000) {
            toast.error('Minimum salary threshold not met.');
            return;
        }

        if (!isValidObjectId(id)) {
            toast.error('Demo data interaction restricted.');
            return;
        }

        const applicationData = {
            tutorId: dbUser._id,
            tutorEmail: user.email,
            tutorName: user.displayName,
            tuitionId: id,
            studentEmail: tuition.student_email,
            qualifications: formData.qualifications,
            experience: formData.experience,
            expectedSalary: Number(formData.expectedSalary)
        };

        try {
            const response = await api.post('/api/applications', applicationData);
            if (response.status === 201) {
                toast.success("Application registered. Awaiting validation.");
                setShowModal(false);
                setFormData({ qualifications: '', experience: "", expectedSalary: '' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Submission failure.";
            toast.error(errorMessage);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!tuition) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">Error 404</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Requirement not found.</h1>
                <Link to="/tuitions" className="btn-quiet-secondary inline-block px-8">
                    Return to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-text-primary)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
                {/* Breadcrumb / Back button */}
                <div className="mb-6">
                    <Link to="/tuitions" className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <span>←</span> Back to Marketplace
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Visuals & Core Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <header className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-xl shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-0"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                                        {tuition.class_name}
                                    </span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border rounded ${tuition.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                                        }`}>
                                        {tuition.status}
                                    </span>
                                </div>

                                <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-6">{tuition.subject}</h1>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Salary / month</span>
                                        <span className="text-xl font-extrabold text-teal-600">৳{tuition.salary}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Location</span>
                                        <span className="text-sm font-bold text-[var(--color-text-secondary)]">{tuition.location}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Weekly Schedule</span>
                                        <span className="text-sm font-bold text-[var(--color-text-secondary)]">{tuition.days_per_week} Days</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Compact Image Gallery */}
                        <div className="grid grid-cols-3 gap-4 h-48">
                            <img
                                src={tuition.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`}
                                className="col-span-2 w-full h-full object-cover rounded-xl shadow-sm border border-[var(--color-border)]"
                                alt="Education"
                            />
                            <div className="grid grid-rows-2 gap-4">
                                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-xl shadow-sm border border-[var(--color-border)]" alt="Classroom" />
                                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-xl shadow-sm border border-[var(--color-border)]" alt="Books" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-[var(--color-surface-muted)]/50 border border-[var(--color-border)] p-6 rounded-xl">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                                    Requirements
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-b border-[var(--color-border)] pb-3">
                                        <span className="text-[var(--color-text-secondary)]">Gender Preference</span>
                                        <span className="font-bold text-[var(--color-text-primary)]">{tuition.gender || 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[var(--color-text-secondary)]">Available Days</span>
                                        <div className="flex gap-1">
                                            {tuition.available_days?.slice(0, 3).map((day, idx) => (
                                                <span key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-bold rounded uppercase text-[var(--color-text-primary)]">{day.slice(0, 3)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-[var(--color-surface-muted)]/50 border border-[var(--color-border)] p-6 rounded-xl">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                                    Context
                                </h2>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-4">
                                    {tuition.description || "The client is looking for a professional who can deliver high-quality pedagogical support for the specified subject. Reliability and subject-matter expertise are the primary selection criteria for this position."}
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Sticky Action Profile */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full -z-0"></div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-2">Apply Position</h3>
                                <p className="text-xs text-[var(--color-text-muted)] mb-8 leading-relaxed font-medium">Register your professional interest. The profile will be forwarded to the client immediately.</p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <Link
                                            to="/login"
                                            className="w-full h-14 flex items-center justify-center gap-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                                        >
                                            Login to Apply
                                        </Link>
                                    ) : !dbUser ? (
                                        <div className="flex items-center justify-center gap-3 h-14 bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-bold rounded-lg">
                                            <div className="w-4 h-4 border-2 border-[var(--color-border)] border-t-transparent rounded-full animate-spin"></div>
                                            Synchronizing...
                                        </div>
                                    ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                        <button
                                            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                            onClick={() => setShowModal(true)}
                                        >
                                            Register Interest
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold leading-relaxed rounded-lg">
                                            {dbUser?.role !== 'tutor' ? "Only verified tutors can submit applications." : "This position is currently not accepting applications."}
                                        </div>
                                    )}


                                </div>

                                <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-[var(--color-text-primary)]">Verified Client</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-tighter">Safe Engagement Guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Find More Section */}
                <div className="mt-20 border-t border-[var(--color-border)] pt-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Curation</span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">Find More Tuitions</h2>
                        </div>
                        <Link to="/tuitions" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2">
                            Browse Full Marketplace <span>→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {demoTuitions
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map(item => (
                                <TuitionCard key={item._id} tuition={item} />
                            ))}
                    </div>
                </div>

                {/* Application Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-[var(--color-surface)] w-full max-w-lg border border-[var(--color-border)] shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <header className="p-8 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-surface-muted)]/50">
                                <h3 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tight">Professional Submission</h3>
                                <p className="text-xs text-[var(--color-text-muted)] font-bold mt-1 uppercase tracking-widest">{tuition.subject} — {tuition.class_name}</p>
                            </header>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Professional Qualifications</label>
                                        <textarea
                                            name="qualifications"
                                            value={formData.qualifications}
                                            onChange={handleChange}
                                            className="input-quiet min-h-[100px] transition-all resize-none text-sm"
                                            placeholder="Academic background & certifications..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Tutor Experience</label>
                                        <textarea
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="input-quiet min-h-[100px] transition-all resize-none text-sm"
                                            placeholder="Previous results & student counts..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Expected Honorarium (BDT/mo)</label>
                                        <input
                                            type="number"
                                            name="expectedSalary"
                                            value={formData.expectedSalary}
                                            onChange={handleChange}
                                            className="input-quiet text-sm font-bold"
                                            placeholder={`Base: ৳${tuition.salary}`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" className="flex-1 h-12 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="flex-1 h-12 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-200 transition-all uppercase tracking-widest text-xs">Submit Profile</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TuitionDetails;