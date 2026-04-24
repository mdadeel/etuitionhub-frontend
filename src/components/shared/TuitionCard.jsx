import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ShieldCheck, Clock, Briefcase, GraduationCap } from 'lucide-react';
import { AppleBadge, AppleCard, AppleButton } from './AppleUI/index';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/dateUtils';

/**
 * Compact TuitionCard component.
 */
const TuitionCard = ({ tuition, className }) => {
    const navigate = useNavigate();

    if (!tuition) return null;

    const handleViewDetails = (e) => {
        e.preventDefault();
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <AppleCard 
            className={cn("flex flex-col h-full group", className)} 
            hover={true}
            tonal={false}
            glass={false}
            onClick={handleViewDetails}
        >
            <div className="p-6 flex-grow flex flex-col bg-card">
                {/* Top Section: Subject & Time */}
                <div className="flex justify-between items-start gap-4 mb-4">
                    <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                        {tuition.subject}
                    </h2>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest shrink-0 mt-1">
                        {formatRelativeTime(tuition.createdAt)}
                    </p>
                </div>
                
                {/* Qualification & Location in same block/line area */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-foreground font-black mb-5 py-3 border-y border-border/20">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <GraduationCap size={13} className="text-primary shrink-0" />
                        <span className="truncate">{tuition.qualification || `B.Sc in ${tuition.subject}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin size={13} className="text-primary shrink-0" />
                        <span className="truncate">{tuition.location}</span>
                    </div>
                </div>

                {/* Description - Black & Bold, reduced margin */}
                <p className="text-sm text-foreground font-bold leading-snug line-clamp-2 mb-6 italic opacity-80">
                    "{tuition.description || "Providing specialized academic support for conceptual clarity."}"
                </p>

                {/* Footer Row: Salary & Button */}
                <div className="mt-auto pt-5 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground tabular-nums tracking-tighter">৳{tuition.salary}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">/mo</span>
                    </div>

                    <AppleButton
                        variant="primary"
                        size="sm"
                        className="rounded-2xl font-black text-[11px] uppercase tracking-widest px-8 py-2.5 group/btn h-11 bg-black text-white hover:bg-black/90 border-none shadow-apple-lg transition-all"
                        onClick={handleViewDetails}
                    >
                        Apply <ArrowRight size={14} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </AppleButton>
                </div>
            </div>
        </AppleCard>
    );

};

export default TuitionCard;


