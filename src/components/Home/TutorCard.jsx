import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ShieldCheck, ArrowRight } from "lucide-react";

/**
 * TutorCard Component
 * Refactored to standard div-based layout to avoid shadcn card conflicts.
 * Features: Apple High-precision typography, translucent glass, pill-shaped UI.
 */
const TutorCard = ({ tutor }) => {
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, ratings, subjects, expectedSalary, isVerified } = tutor;

    return (
        <div className="apple-card group h-full flex flex-col bg-white dark:bg-apple-gray-800 border-apple-gray-200 dark:border-apple-gray-700 shadow-apple-sm hover:shadow-apple-md transition-all duration-300 overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-apple-gray-50 dark:bg-apple-gray-900">
                <img 
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" 
                />
                
                {/* Status Badges (Apple Style) */}
                <div className="absolute top-2 left-2 z-10">
                    <div className="glass px-2 py-0.5 rounded-md flex items-center gap-1">
                        {isVerified && <ShieldCheck size={10} className="text-apple-blue" />}
                        <span className="text-[9px] font-bold text-apple-gray-700 dark:text-apple-gray-200 uppercase tracking-tight">Verified</span>
                    </div>
                </div>

                {/* Pricing Overlay (Apple Style) */}
                {expectedSalary && (
                    <div className="absolute bottom-2 right-2 z-10">
                        <div className="glass px-2 py-1 text-apple-gray-900 dark:text-white text-[11px] font-bold rounded-md border-white/40">
                            ৳{expectedSalary}<span className="text-[9px] font-medium opacity-60">/mo</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3.5 flex-grow flex flex-col">
                <div className="mb-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-bold text-apple-gray-900 dark:text-white group-hover:text-apple-blue transition-colors leading-tight tracking-tight">
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                            <span className="text-[13px] font-bold text-apple-gray-800 dark:text-apple-gray-100">{ratings || '4.9'}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1 mb-4 flex-grow">
                    <div className="flex items-center gap-1.5 text-apple-gray-500 dark:text-apple-gray-400">
                        <p className="text-[11px] font-medium truncate">
                            {qualification || 'Certified Educator'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-apple-gray-400 dark:text-apple-gray-500">
                        <MapPin size={11} className="shrink-0" />
                        <p className="text-[10px] font-medium truncate">
                            {location || 'Dhaka'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-auto">
                    {subjects && Array.isArray(subjects) && subjects.slice(0, 3).map((sub, i) => (
                        <Badge key={i} className="bg-apple-gray-50 dark:bg-apple-gray-900/50 text-apple-gray-500 dark:text-apple-gray-400 border-none rounded-md text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5">
                            {sub}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="p-3.5 pt-0">
                <Button asChild className="w-full mac-pill bg-apple-gray-100 dark:bg-apple-gray-900 text-apple-gray-800 dark:text-apple-gray-200 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-800 border-none shadow-apple-sm group/btn">
                    <Link to={`/tutor/${_id}`} className="flex items-center justify-center gap-1">
                        View Profile <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default TutorCard;
