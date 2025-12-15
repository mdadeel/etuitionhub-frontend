// tuition details page - showing single tuition post details
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";
import demoTuitions from '../data/demoTuitions.json';
import api from '../services/api'; // Use the centralized API service
import { isValidObjectId } from '../utils/validators'; // Import from new utility file

// Main component
function TuitionDetails() {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    const navigate = useNavigate();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Application form data state
    const [formData, setFormData] = useState({
        qualifications: "",
        experience: '',
        expectedSalary: ""
    });

    // Fetch tuition details on component mount
    useEffect(() => {
        const fetchTuitionDetails = async () => {
            try {
                const response = await api.get(`/api/tuitions/${id}`);
                setTuition(response.data);
                console.log('Tuition loaded from API:', response.data);
            } catch (error) {
                console.error("Error fetching tuition details from API:", error);
                // Fallback to demo data if API call fails
                const demoTuition = demoTuitions.find(t => t._id === id);
                if (demoTuition) {
                    setTuition(demoTuition);
                    toast.error("Failed to load tuition from server, displaying demo data.");
                } else {
                    toast.error('Tuition not found.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTuitionDetails();
    }, [id]);

    // Debug logging for user and tuition status
    useEffect(() => {
        console.log('--- TUITION DETAILS DEBUG ---');
        console.log('User:', user ? 'logged in' : 'not logged in');
        console.log('DB User:', dbUser);
        console.log('DB User Role:', dbUser?.role);
        console.log('Tuition:', tuition);
        console.log('Tuition Status:', tuition?.status);
        console.log('Can show apply button?', dbUser?.role === 'tutor' && tuition?.status === 'approved');
        console.log('---------------------------');
    }, [user, dbUser, tuition]);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle application form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate user login status and data
        if (!user || !dbUser) {
            toast.error('Please log in first!');
            navigate('/login');
            return;
        }

        if (!dbUser._id) {
            toast.error('User data not loaded - please refresh the page.');
            return;
        }

        // Validate form fields
        if (!formData.qualifications || !formData.experience || !formData.expectedSalary) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // Validate expected salary
        if (formData.expectedSalary < 1000) {
            toast.error('Expected salary is too low! Minimum 1000 BDT.');
            return;
        }

        // Prevent application to demo tuitions (invalid ObjectIds)
        if (!isValidObjectId(id)) {
            toast.error('Cannot apply to demo tuitions. Please select a real tuition post.');
            return;
        }

        // Prepare application data
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

        console.log("Submitting application:", applicationData);

        try {
            // Send application to API
            const response = await api.post('/api/applications', applicationData);
            if (response.status === 201) {
                toast.success("Application submitted successfully! Awaiting approval.");
                setShowModal(false);
                // Reset form fields
                setFormData({ qualifications: '', experience: "", expectedSalary: '' });
                // Consider adding a refetch or redirect here if needed
            }
        } catch (error) {
            console.error('Application submission error:', error);
            const errorMessage = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Display message if tuition is not found
    if (!tuition) {
        return <div className="text-center mt-10">Tuition post not found or has been deleted.</div>;
    }

    console.log('Rendering tuition details...');
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Main tuition details card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-3xl mb-4">{tuition.subject}</h2>

                        {/* Grid layout for tuition details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600"><strong>Class:</strong> {tuition.class_name}</p>
                                <p className="text-gray-600"><strong>Location:</strong> {tuition.location}</p>
                                <p className="text-gray-600"><strong>Salary:</strong> ৳{tuition.salary}/month</p>
                                <p className="text-gray-600"><strong>Gender Preference:</strong> {tuition.gender || 'Any'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600"><strong>Days per Week:</strong> {tuition.days_per_week}</p>
                                <p className="text-gray-600"><strong>Available Days:</strong> {tuition.available_days?.join(", ") || "not specified"}</p>
                                <p className="text-gray-600"><strong>Status:</strong>
                                    <span className={`badge ml-2 ${tuition.status === 'approved' ? 'badge-success' :
                                        tuition.status === "pending" ? 'badge-warning' :
                                            'badge-info'
                                        }`}>
                                        {tuition.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Tuition description */}
                        {tuition.description && (
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Description:</h3>
                                <p className="text-gray-700">{tuition.description}</p>
                            </div>
                        )}

                        {/* Conditional rendering for apply button based on user role and tuition status */}
                        {!dbUser ? (
                            // Loading state while dbUser is being fetched
                            <div className="text-center py-4">
                                <span className="loading loading-spinner loading-sm"></span>
                                <p className="text-sm text-gray-500 mt-2">Loading user info...</p>
                            </div>
                        ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                            <div className="card-actions justify-end mt-6">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowModal(true)}
                                >
                                    Apply for this Tuition
                                </button>
                            </div>
                        ) : dbUser?.role !== 'tutor' ? (
                            <div className="alert alert-info mt-4">
                                <span>Only tutors can apply. Please log in with a tutor account to apply for this tuition.</span>
                            </div>
                        ) : tuition.status !== 'approved' ? (
                            <div className="alert alert-warning mt-4">
                                <span>This tuition is pending admin approval and not accepting applications yet.</span>
                            </div>
                        ) : null}

                        {/* Pending status alert for students/public view */}
                        {tuition.status === 'pending' && (
                            <div className="alert alert-warning mt-4">
                                <span>This tuition post is awaiting admin approval.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    ></div>

                    {/* Modal content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Apply for this Tuition</h3>
                            <p className="text-teal-100 text-sm">{tuition.subject} - {tuition.class_name}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Readonly tutor info section */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-teal-100 text-teal-700 rounded-full w-10">
                                            <span className="text-lg">{user?.displayName?.[0] || '?'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{user?.displayName}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Qualifications field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Qualifications* <span className="text-gray-400 font-normal">(educational background)</span>
                                </label>
                                <textarea
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition"
                                    placeholder="E.g., BSc in Mathematics from DU, CGPA 3.5&#10;MSc ongoing..."
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Experience field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience* <span className="text-gray-400 font-normal">(teaching experience)</span>
                                </label>
                                <textarea
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition"
                                    placeholder="E.g., 2 years teaching class 8-10 students&#10;Coached 15+ students for SSC..."
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Salary field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Salary* <span className="text-gray-400 font-normal">(BDT/month)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        name="expectedSalary"
                                        value={formData.expectedSalary}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        placeholder="5000"
                                        min="1000"
                                        max="50000"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Student's budget: ৳{tuition.salary}/month</p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-lg shadow-teal-600/30"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TuitionDetails;