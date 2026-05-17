import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const SavedTutors = () => {
    const navigate = useNavigate();
    const [savedTutors, setSavedTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedTutors();
    }, []);

    const fetchSavedTutors = async () => {
        try {
            const res = await api.get('/api/bookmarks');
            setSavedTutors(res.data || []);
        } catch (err) {
            console.error('Failed to fetch saved tutors:', err);
            toast.error('Failed to load saved tutors');
        } finally {
            setLoading(false);
        }
    };

    const removeTutor = async (tutorId) => {
        try {
            await api.delete(`/api/bookmarks/${tutorId}`);
            setSavedTutors(savedTutors.filter(t => t._id !== tutorId));
            toast.success('Tutor removed from saved');
        } catch (err) {
            toast.error('Failed to remove tutor');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
                <span className="ml-3 text-sm text-[#5B6475]">Loading saved tutors...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading text-[#111827]">Saved Tutors</h2>
                    <p className="text-sm text-[#5B6475]">{savedTutors.length} tutor{savedTutors.length !== 1 ? 's' : ''} saved</p>
                </div>
            </div>

            {savedTutors.length === 0 ? (
                <div className="py-16 text-center bg-white border border-[rgba(15,23,46,0.08)] rounded-xl">
                    <Bookmark size={40} className="mx-auto text-[#5B6475]/30 mb-4" />
                    <h3 className="text-lg font-heading text-[#111827] mb-2">No saved tutors yet</h3>
                    <p className="text-sm text-[#5B6475] mb-6">Browse tutors and save your favorites for quick access.</p>
                    <button
                        onClick={() => navigate('/tutors')}
                        className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] text-sm font-medium"
                    >
                        Browse Tutors
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedTutors.map(tutor => (
                        <div
                            key={tutor._id}
                            className="bg-white border border-[rgba(15,23,46,0.08)] rounded-xl p-4 hover:shadow-lg hover:border-[#2563EB]/20 transition-all"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F7FA] flex-shrink-0">
                                    {tutor.photoURL ? (
                                        <img src={tutor.photoURL} alt={tutor.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#5B6475] text-lg font-bold">
                                            {tutor.displayName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-heading text-sm text-[#111827] truncate">{tutor.displayName}</h3>
                                    <p className="text-xs text-[#5B6475] truncate">{tutor.qualification || 'Tutor'}</p>
                                    {tutor.location && (
                                        <p className="text-xs text-[#5B6475] truncate">{tutor.location}</p>
                                    )}
                                </div>
                            </div>

                            {tutor.subjects && tutor.subjects.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {tutor.subjects.slice(0, 3).map((sub, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-[#F5F7FA] text-[#5B6475] text-[10px] rounded-md font-medium">
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-[rgba(15,23,46,0.08)]">
                                {tutor.expectedSalary && (
                                    <span className="text-sm font-heading text-[#2563EB]">৳{tutor.expectedSalary.toLocaleString()}/mo</span>
                                )}
                                <div className="flex items-center gap-2 ml-auto">
                                    <button
                                        onClick={() => navigate(`/tutor/${tutor._id}`)}
                                        className="p-2 text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors"
                                        title="View Profile"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeTutor(tutor._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedTutors;