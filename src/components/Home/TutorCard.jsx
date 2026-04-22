import { Link } from 'react-router-dom';
import { Star, ShieldCheck, ArrowRight, MapPin } from "lucide-react";
import { AppleBadge, AppleCard, AppleButton } from '../shared/AppleUI/index';

const TutorCard = ({ tutor }) => {
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, ratings, subjects, expectedSalary, isVerified } = tutor;

    return (
        <AppleCard className="h-full flex flex-col group" hover={true}>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'} 
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" 
                />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 z-10">
                    {tutor.verificationStatus === 'verified_premium' ? (
                        <AppleBadge variant="primary" className="backdrop-blur-md bg-primary/20 border-primary/30 flex items-center gap-1 py-1 text-primary-foreground">
                            <Star size={10} className="fill-current" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Premium Specialist</span>
                        </AppleBadge>
                    ) : (tutor.verificationStatus === 'verified_basic' || tutor.isVerified) ? (
                        <AppleBadge variant="primary" className="backdrop-blur-md bg-background/50 border-border/50 flex items-center gap-1 py-1">
                            <ShieldCheck size={10} className="text-primary" />
                            <span className="text-[9px]">Verified</span>
                        </AppleBadge>
                    ) : null}
                </div>

                {/* Pricing Overlay */}
                {expectedSalary && (
                    <div className="absolute bottom-3 right-3 z-10">
                        <div className="backdrop-blur-md bg-background/80 px-3 py-1.5 text-foreground text-[11px] font-bold rounded-xl border border-border/50 shadow-sm">
                            ৳{expectedSalary}<span className="text-[9px] font-medium opacity-50">/mo</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <div className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50">
                            <span className="text-xs font-bold text-foreground">{ratings || '4.9'}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5 mb-5 flex-grow">
                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                        {qualification || 'Certified Educator'}
                    </p>
                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                        <MapPin size={12} />
                        <span className="text-[11px] font-medium">{location || 'Dhaka'}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {subjects && Array.isArray(subjects) && subjects.slice(0, 3).map((sub, i) => (
                        <AppleBadge key={i} variant="secondary" className="px-2 py-0.5 normal-case tracking-normal">
                            {sub}
                        </AppleBadge>
                    ))}
                </div>
            </div>

            <div className="p-5 pt-0">
                <AppleButton asChild variant="secondary" size="md" className="w-full group/btn">
                    <Link to={`/tutor/${_id}`} className="flex items-center justify-center gap-2">
                        View Profile <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </AppleButton>
            </div>
        </AppleCard>
    );
};

export default TutorCard;
