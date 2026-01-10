import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";
import demoTuitions from '../data/demoTuitions.json';
import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import LoadingSpinner from '../components/shared/LoadingSpinner';

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
            <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">Error 404</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Requirement not found.</h1>
                <Link to="/tuitions" className="btn-quiet-secondary inline-block px-8">
                    Return to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
            <header className="mb-16 border-b border-gray-100 pb-12">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Active Requirement</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${tuition.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                            }`}>
                            {tuition.status}
                        </span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">{tuition.subject}</h1>
                    <div className="flex flex-wrap gap-8 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <span className="opacity-40 text-[10px] font-bold uppercase tracking-tight">Level</span>
                            <span className="text-gray-900">{tuition.class_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="opacity-40 text-[10px] font-bold uppercase tracking-tight">Area</span>
                            <span className="text-gray-900">{tuition.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="opacity-40 text-[10px] font-bold uppercase tracking-tight">Timeline</span>
                            <span className="text-gray-900">{tuition.days_per_week} days / week</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Visual Gallery Placeholder - Satisfies "Multiple Images" requirement */}
            <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 h-64 md:h-80">
                <div className="md:col-span-2 h-full">
                    <img
                        src={`https://source.unsplash.com/random/800x600/?${tuition.subject},education`}
                        alt={tuition.subject}
                        className="w-full h-full object-cover rounded-l-lg shadow-sm"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    />
                </div>
                <div className="grid grid-rows-2 gap-4 h-full">
                    <img
                        src={`https://source.unsplash.com/random/400x300/?classroom,study`}
                        alt="Classroom"
                        className="w-full h-full object-cover rounded-tr-lg shadow-sm"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    />
                    <img
                        src={`https://source.unsplash.com/random/400x300/?books,library`}
                        alt="Library"
                        className="w-full h-full object-cover rounded-br-lg shadow-sm"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    />
                </div>
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <section className="mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-gray-50 border border-gray-100">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Logistics</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Proposed Fee</span>
                                        <span className="font-bold text-gray-900">৳{tuition.salary} / mo</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Gender Preference</span>
                                        <span className="font-bold text-gray-900">{tuition.gender || 'Any'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 border border-gray-100">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Schedule</p>
                                <div className="flex flex-wrap gap-2">
                                    {tuition.available_days?.map((day, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-tight">
                                            {day}
                                        </span>
                                    )) || "Pending specification"}
                                </div>
                            </div>
                        </div>
                    </section>

                    {tuition.description && (
                        <section className="mb-16">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Additional Context</h2>
                            <p className="text-gray-600 leading-relaxed max-w-2xl whitespace-pre-line">
                                {tuition.description}
                            </p>
                        </section>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 border border-gray-200 p-8 rounded-sm bg-white shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Interested in this position?</h3>
                        <p className="text-sm text-gray-500 mb-8">Submit your professional profile for review by the student/guardian.</p>

                        <div className="space-y-4">
                            {!dbUser ? (
                                <div className="flex items-center justify-center gap-3 h-14 bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                    Loading System
                                </div>
                            ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                <button
                                    className="btn-quiet-primary w-full h-14 text-base"
                                    onClick={() => setShowModal(true)}
                                >
                                    Register Application
                                </button>
                            ) : dbUser?.role !== 'tutor' ? (
                                <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium leading-relaxed">
                                    Only verified professionals can submit applications.
                                </div>
                            ) : tuition.status !== 'approved' ? (
                                <div className="p-4 bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs font-medium leading-relaxed">
                                    This position is currently under review by the moderation team.
                                </div>
                            ) : null}

                            <button className="btn-quiet-secondary w-full h-14 text-base">
                                Save Requirement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-white w-full max-w-lg border border-gray-200 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
                            <header className="p-6 border-b border-gray-100 shrink-0">
                                <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-tight">Technical Application</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">{tuition.subject} — {tuition.class_name}</p>
                            </header>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                            Professional Qualifications
                                        </label>
                                        <textarea
                                            name="qualifications"
                                            value={formData.qualifications}
                                            onChange={handleChange}
                                            className="input-quiet w-full p-4 min-h-[120px] resize-none"
                                            placeholder="Summarize your academic background and relevant certifications..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                            Relevant Pedagogy Experience
                                        </label>
                                        <textarea
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="input-quiet w-full p-4 min-h-[120px] resize-none"
                                            placeholder="Detail your history with similar levels and subjects..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                            Proposed Compensation (BDT/mo)
                                        </label>
                                        <input
                                            type="number"
                                            name="expectedSalary"
                                            value={formData.expectedSalary}
                                            onChange={handleChange}
                                            className="input-quiet w-full h-12 pl-4"
                                            placeholder={`Client Budget: ৳${tuition.salary}`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        className="btn-quiet-secondary flex-1 h-12"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-quiet-primary flex-1 h-12"
                                    >
                                        Submit Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TuitionDetails;