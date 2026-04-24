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
            <div className="p-5 flex-grow flex flex-col bg-card">
                {/* Top Row: Subject & Date/Shield */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tighter">
                        {tuition.subject}
                    </h2>
                    
                    {/* Shield Section: Now containing Date */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                            <ShieldCheck size={14} className="fill-primary/20" />
                        </div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                            {formatRelativeTime(tuition.createdAt)}
                        </p>
                    </div>
                </div>
                
                {/* Tags Row */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    <AppleBadge variant="muted" className="px-2.5 py-1 text-[9px] lowercase first-letter:uppercase font-black bg-muted/50 border-none">
                        Class {tuition.class_name}
                    </AppleBadge>
                    <AppleBadge variant="muted" className="px-2.5 py-1 text-[9px] font-black bg-muted/50 border-none">
                        {tuition.tuition_type || 'Home Visit'}
                    </AppleBadge>
                </div>

                {/* Subtitle Row: Qualification & Location */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold mb-5">
                    <div className="flex items-center gap-1 min-w-0">
                        <GraduationCap size={12} className="text-primary/40 shrink-0" />
                        <span className="truncate">B.Sc in {tuition.subject}</span>
                    </div>
                    <span className="shrink-0 text-border">•</span>
                    <div className="flex items-center gap-1 min-w-0">
                        <MapPin size={12} className="text-primary/40 shrink-0" />
                        <span className="truncate">{tuition.location}</span>
                    </div>
                </div>

                {/* Description - Black & Bold */}
                <p className="text-sm text-foreground font-bold leading-relaxed line-clamp-2 mb-6">
                    "{tuition.description || "In-depth academic support for specialized conceptual clarity."}"
                </p>

                {/* Footer Row: Salary & Button */}
                <div className="mt-auto pt-5 border-t border-border/30 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-foreground tabular-nums tracking-tighter">৳{tuition.salary}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">/mo</span>
                    </div>

                    <AppleButton
                        variant="primary"
                        size="sm"
                        className="rounded-xl font-black text-[11px] uppercase tracking-widest px-8 py-2.5 group/btn h-10 shadow-lg shadow-primary/20"
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


