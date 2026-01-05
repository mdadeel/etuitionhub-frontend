/**
 * TuitionCard Component
 * 
 * Displays single tuition post with high-signal data prioritization.
 */
import { useNavigate } from 'react-router-dom';

const TuitionCard = ({ tuition }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <div className="card-quiet group flex flex-col h-full fade-up">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                            {tuition.class_name}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {tuition.subject}
                        </h2>
                    </div>
                    {tuition.status === 'approved' && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-sm">
                            Active
                        </span>
                    )}
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="w-12 text-[10px] font-bold uppercase tracking-tight opacity-40 shrink-0">Area</span>
                        <span className="truncate font-medium text-gray-700">{tuition.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="w-12 text-[10px] font-bold uppercase tracking-tight opacity-40 shrink-0">Salary</span>
                        <span className="font-bold text-gray-900">৳{tuition.salary} / month</span>
                    </div>
                    {tuition.days_per_week && (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="w-12 text-[10px] font-bold uppercase tracking-tight opacity-40 shrink-0">Schedule</span>
                            <span className="font-medium text-gray-700">{tuition.days_per_week} days / week</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                className="w-full border-t border-gray-100 py-4 text-sm font-bold text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50/30 transition-all duration-200 uppercase tracking-widest"
                onClick={handleViewDetails}
            >
                View Details
            </button>
        </div>
    );
};

export default TuitionCard;
