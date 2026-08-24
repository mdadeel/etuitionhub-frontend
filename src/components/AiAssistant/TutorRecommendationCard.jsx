// components/AiAssistant/TutorRecommendationCard.jsx
// "Need more help? Recommended Tutors" card that appears below an
// AI response when the AI flagged `needsHumanHelp`. Uses a compact
// horizontal layout (different from the full TutorCard grid card).
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import aiService from '../../services/aiService';

export default function TutorRecommendationCard({ tutors = [], subject, onTrackClick }) {
    if (!tutors || tutors.length === 0) return null;

    const handleClick = (tutorId) => {
        aiService.trackTutorRecommendationClick(tutorId).catch(() => {});
        onTrackClick?.(tutorId);
    };

    return (
        <section
            className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4 animate-fade-in-up"
            style={{ animationDelay: '500ms', animationFillMode: 'both' }}
        >
            <header className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center size-6 rounded-md bg-primary/20 text-primary">
                    <Users size={13} strokeWidth={2.4} />
                </span>
                <h4 className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-primary">
                    Need more help?
                </h4>
                {subject && (
                    <span className="ml-auto text-[10px] font-label tracking-wider text-muted-foreground">
                        {subject}
                    </span>
                )}
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tutors.map((tutor) => {
                    const rating = tutor.ratings || tutor.rating || 0;
                    return (
                        <Link
                            key={tutor._id}
                            to={`/tutor/${tutor._id}`}
                            onClick={() => handleClick(tutor._id)}
                            className={cn(
                                'group flex items-center gap-3 rounded-lg border border-border bg-card/80 p-2.5',
                                'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300',
                            )}
                        >
                            <div className="shrink-0 size-10 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                                <Avatar size="sm" className="size-10 rounded-lg">
                                    <AvatarImage src={tutor.photoURL} alt={tutor.displayName} />
                                    <AvatarFallback className="text-sm font-heading font-bold rounded-lg">
                                        {tutor.displayName?.charAt(0)?.toUpperCase() || 'T'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 max-w-full">
                                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                        {tutor.displayName}
                                    </p>
                                    {tutor.isRisingStar && (
                                        <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-1 py-0.5 rounded">
                                            Rising Star
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                                    {rating > 0 ? (
                                        <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                            <Star size={10} className="fill-current" />
                                            {rating.toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="font-semibold">New</span>
                                    )}
                                    {tutor.location && (
                                        <>
                                            <span>·</span>
                                            <span className="flex items-center gap-0.5 truncate">
                                                <MapPin size={9} />
                                                {tutor.location.split(',')[0]}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <ArrowRight
                                size={14}
                                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                            />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
