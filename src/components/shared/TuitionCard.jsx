import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, GraduationCap, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

const TuitionCard = ({ tuition, className }) => {
    const navigate = useNavigate();

    if (!tuition) return null;

    const handleViewDetails = (e) => {
        e.preventDefault();
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <div
            className={`p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer ${className}`}
            onClick={handleViewDetails}
        >
            <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="font-semibold text-slate-900 text-base">{tuition.subject}</h3>
                <span className="text-xs text-slate-500 shrink-0">
                    {formatRelativeTime(tuition.createdAt)}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mb-3">
                <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{tuition.qualification || `B.Sc in ${tuition.subject}`}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{tuition.location}</span>
                </div>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                {tuition.description || "Providing specialized academic support for conceptual clarity."}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-baseline">
                    <span className="text-lg font-semibold text-slate-900">৳{tuition.salary}</span>
                    <span className="text-xs text-slate-500 ml-1">/mo</span>
                </div>
                <button
                    className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
                    onClick={handleViewDetails}
                >
                    Apply
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TuitionCard;