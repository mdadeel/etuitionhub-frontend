import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, ShieldCheck, Banknote } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * TuitionCard Component
 * Refactored to "Apple macOS Native Density"
 * Features: 16px radius, soft shadows, high-contrast metrics, compact layout.
 */
const TuitionCard = ({ tuition }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <div className="apple-card group flex flex-col h-full bg-white dark:bg-apple-gray-800 border-apple-gray-200 dark:border-apple-gray-700 shadow-apple-sm hover:shadow-apple-md transition-all duration-300">
            <div className="p-4 flex-grow flex flex-col">
                {/* Header: Class & Status */}
                <div className="mb-3 flex justify-between items-center">
                    <Badge className="bg-apple-gray-100 text-apple-gray-700 dark:bg-apple-gray-900 dark:text-apple-gray-300 hover:bg-apple-gray-200 rounded-md text-[9px] font-bold uppercase px-2 py-0.5 border-none tracking-tight">
                        Class {tuition.class_name}
                    </Badge>
                    <div className="text-apple-blue/40 group-hover:text-apple-blue transition-colors">
                        <ShieldCheck size={14} />
                    </div>
                </div>
                
                {/* Title */}
                <h2 className="text-[15px] font-bold text-apple-gray-900 dark:text-white mb-2 group-hover:text-apple-blue transition-colors leading-tight tracking-tight">
                    {tuition.subject}
                </h2>
                
                {/* Description */}
                <p className="text-[11px] text-apple-gray-500 dark:text-apple-gray-400 font-medium leading-relaxed line-clamp-2 mb-4">
                    {tuition.description || "In-depth academic support required for specialized node processing."}
                </p>

                {/* Metrics */}
                <div className="mt-auto space-y-2.5 pt-3 border-t border-apple-gray-100 dark:border-apple-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-apple-gray-400 dark:text-apple-gray-500">
                            <MapPin size={12} className="shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[120px]">{tuition.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-apple-gray-900 dark:text-white">
                            <Banknote size={12} className="text-green-500" />
                            <span className="text-xs font-bold tabular-nums tracking-tight">৳{tuition.salary}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-apple-gray-500 dark:text-apple-gray-400 font-bold uppercase tracking-tight">
                        <Calendar size={11} className="text-apple-blue/70" />
                        <span>{tuition.days_per_week || 3} Days Per Week</span>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="px-4 pb-4">
                <Button
                    variant="outline"
                    className="w-full mac-pill bg-apple-gray-50 dark:bg-apple-gray-900/50 text-apple-gray-700 dark:text-apple-gray-200 border-apple-gray-200 dark:border-apple-gray-700 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-300 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group/btn shadow-apple-sm"
                    onClick={handleViewDetails}
                >
                    View Details <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
            </div>
        </div>
    );
};

export default TuitionCard;
