/**
 * TuitionCard Component
 * 
 * Extracted from Tuitions.jsx - displays single tuition post
 * Follows single responsibility principle
 */
import { useNavigate } from 'react-router-dom';

const TuitionCard = ({ tuition }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <div className="card bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="card-body p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <h2 className="card-title text-lg text-gray-800">{tuition.subject}</h2>
                    {tuition.status === 'approved' && (
                        <span className="badge badge-success badge-sm">Active</span>
                    )}
                </div>

                {/* Class info */}
                <p className="text-sm font-medium text-teal-600 mb-3">{tuition.class_name}</p>

                {/* Details */}
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                        <span>📍</span> {tuition.location}
                    </p>
                    <p className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold text-gray-800">৳{tuition.salary}/month</span>
                    </p>
                    {tuition.days_per_week && (
                        <p className="flex items-center gap-2">
                            <span>📅</span> {tuition.days_per_week} days/week
                        </p>
                    )}
                </div>

                {/* Action */}
                <div className="card-actions justify-end pt-2 border-t border-gray-100">
                    <button
                        className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white border-none px-4"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TuitionCard;
