import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, ShieldCheck, Banknote } from 'lucide-react';
import { AppleBadge, AppleCard, AppleButton } from '../shared/AppleUI';

const TuitionCard = ({ tuition }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <AppleCard className="flex flex-col h-full group" hover={true}>
            <div className="p-5 flex-grow flex flex-col">
                {/* Header: Class & Status */}
                <div className="mb-4 flex justify-between items-center">
                    <AppleBadge variant="secondary" className="px-2.5 py-1 normal-case tracking-normal">
                        Class {tuition.class_name}
                    </AppleBadge>
                    <div className="text-primary/40 group-hover:text-primary transition-colors">
                        <ShieldCheck size={16} />
                    </div>
                </div>
                
                {/* Title */}
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight tracking-tight">
                    {tuition.subject}
                </h2>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 mb-6">
                    {tuition.description || "In-depth academic support required for specialized node processing."}
                </p>

                {/* Metrics */}
                <div className="mt-auto space-y-4 pt-5 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                            <MapPin size={14} className="shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-tight truncate max-w-[120px]">{tuition.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-foreground bg-muted/50 px-2 py-1 rounded-lg border border-border/50">
                            <Banknote size={14} className="text-green-500" />
                            <span className="text-sm font-bold tabular-nums tracking-tight">৳{tuition.salary}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold uppercase tracking-tight">
                        <Calendar size={13} className="text-primary/70" />
                        <span>{tuition.days_per_week || 3} Days Per Week</span>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 pt-0">
                <AppleButton
                    variant="outline"
                    size="md"
                    className="w-full group/btn"
                    onClick={handleViewDetails}
                >
                    View Details <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                </AppleButton>
            </div>
        </AppleCard>
    );
};

export default TuitionCard;
