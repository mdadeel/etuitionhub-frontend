import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, ArrowRight, MapPin, Bookmark, Clock, Award, GraduationCap } from "lucide-react";
import { AppleBadge, AppleCard, AppleButton } from './AppleUI/index';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeTime } from '@/utils/dateUtils';

/**
 * Compact TutorCard component.
 */
const TutorCard = ({ 
    tutor, 
    onSave, 
    isSaved = false
}) => {
    const navigate = useNavigate();
    if (!tutor) return null;

    const { 
        _id, 
        displayName, 
        photoURL, 
        qualification, 
        location, 
        subjects = [], 
        isVerified,
        isOnline = false,
        verificationStatus,
        createdAt
    } = tutor;

    const rating = tutor.rating || tutor.ratings || 4.9;
    const salary = tutor.expectedSalary || (tutor.hourlyRateBDT ? `${tutor.hourlyRateBDT.min}-${tutor.hourlyRateBDT.max}` : null);
    const priceUnit = tutor.expectedSalary ? "/mo" : "/hr";

    const handleCardClick = () => navigate(`/tutor/${_id}`);

    const handleSaveClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onSave) onSave(_id);
    };

    return (
        <AppleCard 
            className="h-full flex flex-col group" 
            hover={true}
            onClick={handleCardClick}
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <motion.img 
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                    alt={displayName}
                    className="w-full h-full object-cover" 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                />
                
                {/* Badges Overlay - Left Side */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {verificationStatus === 'verified_premium' ? (
                        <AppleBadge variant="glass" className="py-1 px-2 text-[8px]">
                            <Award size={10} className="text-yellow-400 fill-yellow-400" />
                            Elite
                        </AppleBadge>
                    ) : (isVerified || verificationStatus === 'verified_basic') ? (
                        <ShieldCheck size={18} className="text-primary drop-shadow-xl fill-white" />
                    ) : null}
                </div>

                {/* Ratings Overlay - Replaces Save Button */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    <span className="text-[11px] font-black text-white tabular-nums">{rating.toFixed(1)}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tighter truncate">
                            {displayName}
                        </h3>
                        {/* Qualification - Black & Bold */}
                        <p className="text-sm font-bold text-foreground leading-tight truncate mt-1">
                            {qualification || 'Specialist'}
                        </p>
                    </div>
                    
                    {/* Date - Replaces Ratings Badge */}
                    <div className="shrink-0 text-right">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">
                            {formatRelativeTime(createdAt)}
                        </p>
                    </div>
                </div>

                {/* Metadata Row & Save Button */}
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                        <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-primary/40 shrink-0" />
                            <span className="truncate max-w-[120px]">{location || 'Dhaka'}</span>
                        </div>
                    </div>

                    {/* Save Button - Moved to Profile Section */}
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSaveClick}
                        className={cn(
                            "p-2 rounded-full border transition-all shadow-sm",
                            isSaved ? "bg-primary text-white border-primary" : "bg-muted/50 text-muted-foreground border-border hover:bg-white hover:text-primary"
                        )}
                    >
                        <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                    </motion.button>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {subjects.slice(0, 3).map((sub, i) => (
                        <AppleBadge key={i} variant="muted" className="px-2.5 py-1 text-[9px] lowercase first-letter:uppercase font-bold bg-muted/80 border-none">
                            {sub}
                        </AppleBadge>
                    ))}
                </div>

                {/* Footer Row */}
                <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-foreground tabular-nums tracking-tighter">৳{salary}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{priceUnit}</span>
                    </div>

                    <AppleButton 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-xl font-black text-[11px] uppercase tracking-widest px-8 py-2.5 group/btn h-10 bg-apple-gray-100 hover:bg-primary/10 hover:text-primary transition-all border border-apple-gray-200"
                    >
                        View <ArrowRight size={14} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </AppleButton>
                </div>
            </div>
        </AppleCard>
    );

};

export default TutorCard;


