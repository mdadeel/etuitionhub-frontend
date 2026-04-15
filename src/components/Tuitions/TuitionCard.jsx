import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, BadgeCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * TuitionCard Component
 * Refactored to "Technical Emerald Minimalism"
 * Features: Sharp geometry, high-signal data prioritization, technical metrics
 */
const TuitionCard = ({ tuition }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <div className="group flex flex-col h-full glass-card rounded-lg overflow-hidden">
            <div className="p-4 flex-grow relative">
                <div className="mb-3 flex justify-between items-start">
                    <Badge variant="outline" className="rounded-md border-primary/30 text-primary bg-primary/5 text-[9px] font-bold uppercase px-2 py-0.5">
                        Class {tuition.class_name}
                    </Badge>
                    <div className="text-primary opacity-30 group-hover:opacity-100 transition-opacity">
                        <BadgeCheck size={16} />
                    </div>
                </div>
                
                <h2 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                    {tuition.subject}
                </h2>
                
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed line-clamp-2 mb-4">
                    {tuition.description || "Looking for an expert tutor to guide through complex concepts."}
                </p>

                <div className="space-y-2 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin size={12} className="text-primary" />
                            <span className="text-[10px] font-bold uppercase">{tuition.location}</span>
                        </div>
                        <span className="text-xs font-bold text-primary tabular-nums">৳{tuition.salary}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                        <Calendar size={10} className="text-primary" />
                        <span>{tuition.days_per_week || 3} Days/Wk</span>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 mt-auto">
                <Button
                    variant="outline"
                    className="w-full h-8 rounded-md text-foreground font-bold text-[10px] border-primary/20 hover:bg-primary/10 transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2"
                    onClick={handleViewDetails}
                >
                    View Details <ArrowRight size={12} />
                </Button>
            </div>
        </div>
    );
};

export default TuitionCard;
