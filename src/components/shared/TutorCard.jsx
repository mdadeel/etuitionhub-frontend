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
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {verificationStatus === 'verified_premium' ? (
                        <AppleBadge variant="glass" className="py-1 px-2.5 text-[9px] font-black uppercase tracking-wider">
                            <Award size={10} className="text-yellow-400 fill-yellow-400" />
                            Elite Pro
                        </AppleBadge>
                    ) : (isVerified || verificationStatus === 'verified_basic') ? (
                        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-apple-sm">
                            <ShieldCheck size={18} className="text-primary fill-primary/10" />
                        </div>
                    ) : null}
                </div>

                {/* Ratings Overlay */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <span className="text-[11px] font-black text-white tabular-nums">{rating.toFixed(1)}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tighter truncate">
                            {displayName}
                        </h3>
                        {/* Qualification - Black & Bold as requested */}
                        <p className="text-[13px] font-black text-foreground leading-snug truncate">
                            {qualification || 'Academic Specialist'}
                        </p>
                    </div>
                    
                    <div className="shrink-0 text-right">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] whitespace-nowrap">
                            {formatRelativeTime(createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-black">
                        <MapPin size={13} className="text-primary/60 shrink-0" />
                        <span className="truncate max-w-[140px]">{location || 'Dhaka'}</span>
                    </div>

                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSaveClick}
                        className={cn(
                            "p-2.5 rounded-full border transition-all shadow-apple-sm",
                            isSaved ? "bg-primary text-white border-primary" : "bg-muted/50 text-muted-foreground border-border hover:bg-white hover:text-primary"
                        )}
                    >
                        <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                    </motion.button>
                </div>

                {/* Subjects with more breathing room */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                    {subjects.slice(0, 3).map((sub, i) => (
                        <AppleBadge key={i} variant="muted" className="px-3 py-1 text-[9px] font-black bg-muted/80 border-none uppercase tracking-tighter">
                            {sub}
                        </AppleBadge>
                    ))}
                </div>

                {/* Footer Row */}
                <div className="mt-auto pt-5 border-t border-border/30 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground tabular-nums tracking-tighter">৳{salary}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{priceUnit}</span>
                    </div>

                    <AppleButton 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-2xl font-black text-[11px] uppercase tracking-widest px-8 py-2.5 group/btn h-11 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all border border-border/50"
                    >
                        View <ArrowRight size={14} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </AppleButton>
                </div>
            </div>
        </AppleCard>
    );

};

export default TutorCard;


