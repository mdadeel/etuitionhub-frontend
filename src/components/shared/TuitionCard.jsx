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
            className={`p-4 bg-white border border-[rgba(15,23,46,0.08)] rounded-xl hover:shadow-lg hover:shadow-[rgba(0,0,0,0.04)] hover:border-[#2563EB]/20 transition-all cursor-pointer ${className}`}
            onClick={handleViewDetails}
        >
            <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-heading text-sm md:text-base text-[#111827] line-clamp-1 tracking-tight">{tuition.subject}</h3>
                <span className="text-[10px] md:text-xs text-[#5B6475] shrink-0 font-medium">
                    {formatRelativeTime(tuition.createdAt) || 'Recent'}
                </span>
            </div>

            <p className="text-[11px] md:text-sm text-[#5B6475] font-medium line-clamp-1 mb-3">
                {tuition.description || "Specialized academic support."}
            </p>

            <div className="flex flex-col gap-1.5 text-[11px] md:text-sm text-[#5B6475] mb-3">
                <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2563EB]" />
                    <span className="truncate">{tuition.qualification || tuition.class_name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2563EB]" />
                    <span className="truncate">{(tuition.location || 'N/A').split(',')[0]}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(15,23,46,0.08)]">
                <div className="flex items-baseline">
                    <span className="text-base md:text-lg font-heading text-[#2563EB]">৳{tuition.salary}</span>
                    <span className="text-[10px] md:text-xs text-[#5B6475] ml-0.5 font-medium">/mo</span>
                </div>
                <button
                    className="flex items-center gap-1 text-[11px] md:text-sm text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors"
                    onClick={handleViewDetails}
                >
                    Apply
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </button>
            </div>
        </div>
    );
};

export default TuitionCard;