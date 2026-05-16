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
            className={`p-4 bg-card border border-border/60 rounded-xl hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer ${className}`}
            onClick={handleViewDetails}
        >
            <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-foreground text-xs md:text-base line-clamp-1 tracking-tight">{tuition.subject}</h3>
                <span className="text-[9px] md:text-xs text-muted-foreground/60 shrink-0 uppercase font-bold tracking-widest">
                    {(formatRelativeTime(tuition.createdAt) || '').split(' ')[0]}
                </span>
            </div>

            <p className="text-[10px] md:text-sm text-muted-foreground font-medium line-clamp-1 mb-2">
                {tuition.description || "Specialized academic support."}
            </p>

            <div className="flex flex-col gap-1 text-[10px] md:text-sm text-muted-foreground/80 mb-3">
                <div className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground/40" />
                    <span className="truncate">{tuition.qualification || tuition.class_name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground/40" />
                    <span className="truncate">{(tuition.location || 'N/A').split(',')[0]}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-baseline">
                    <span className="text-sm md:text-lg font-bold text-foreground">৳{tuition.salary}</span>
                    <span className="text-[9px] md:text-xs text-muted-foreground ml-0.5 font-medium">/mo</span>
                </div>
                <button
                    className="flex items-center gap-1 text-[10px] md:text-sm text-blue-600 font-medium hover:text-blue-700"
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