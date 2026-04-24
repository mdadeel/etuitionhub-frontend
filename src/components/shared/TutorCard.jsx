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
            className="flex flex-col group overflow-hidden relative" 
            hover={true}
            onClick={handleCardClick}
        >
            {/* Save Button Overlay */}
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveClick}
                className={cn(
                    "absolute top-4 right-4 z-20 p-2 rounded-full border transition-all shadow-apple-sm",
                    isSaved ? "bg-primary text-white border-primary" : "bg-white/80 backdrop-blur-md text-muted-foreground border-border/40 hover:text-primary"
                )}
            >
                <Bookmark size={12} className={isSaved ? "fill-current" : ""} />
            </motion.button>

            {/* Top Section: Horizontal Info */}
            <div className="p-4 flex gap-4 items-start">
                {/* Square Image - Left */}
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border/30 shadow-apple-sm">
                        <motion.img 
                            src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                            alt={displayName}
                            className="w-full h-full object-cover" 
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        />
                    </div>
                    {isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-lg shadow-lg border-2 border-background">
                            <ShieldCheck size={10} />
                        </div>
                    )}
                </div>

                {/* Info - Right */}
                <div className="flex-grow min-w-0">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight truncate pr-8">
                            {displayName}
                        </h3>
                        <p className="text-[11px] font-black text-foreground/70 truncate">
                            {qualification || 'Academic Specialist'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-black">
                        <MapPin size={10} className="text-primary/60 shrink-0" />
                        <span className="truncate">{location || 'Dhaka'}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                        {subjects.slice(0, 2).map((sub, i) => (
                            <span key={i} className="text-[8px] font-black text-primary/70 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                {sub}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Action & Stats */}
            <div className="mt-auto border-t border-border/30 grid grid-cols-4 divide-x divide-border/30 bg-muted/5">
                {/* Rating Stat */}
                <div className="p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-foreground tabular-nums leading-none">
                        {rating.toFixed(1)}
                    </span>
                    <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">
                        Rating
                    </span>
                </div>

                {/* Experience Stat */}
                <div className="p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-foreground leading-none">
                        {tutor.experience?.split(' ')[0] || '3'}+
                    </span>
                    <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">
                        Years
                    </span>
                </div>

                {/* Salary Stat */}
                <div className="p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-foreground tabular-nums leading-none">
                        ৳{(salary / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">
                        Salary
                    </span>
                </div>

                {/* View Button Column - Now on the right */}
                <div className="p-2.5 flex items-center justify-center">
                    <AppleButton 
                        variant="primary" 
                        size="sm" 
                        className="w-full h-9 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] bg-black text-white hover:bg-black/90 border-none transition-all shadow-apple-lg"
                    >
                        View
                    </AppleButton>
                </div>
            </div>
        </AppleCard>
    );

};

export default TutorCard;


