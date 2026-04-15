import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Star, GraduationCap, ChevronRight } from "lucide-react";

/**
 * TutorCard Component
 * Refactored to "Figma-inspired Human Crafted"
 * Features: Restrained geometry, subtle shadows, crisp typography
 */
const TutorCard = ({ tutor }) => {
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, ratings, subjects, expectedSalary } = tutor;

    return (
        <Card className="group h-full flex flex-col bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-200">
            <div className="relative aspect-[3/2] overflow-hidden bg-muted/30">
                <img 
                    src={photoURL} 
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 z-10">
                    <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm border-none text-[10px] font-medium text-foreground rounded px-2 py-0.5 shadow-sm">
                        Verified
                    </Badge>
                </div>

                {/* Pricing Overlay */}
                {expectedSalary && (
                    <div className="absolute bottom-3 right-3 z-10">
                        <div className="px-2.5 py-1 bg-background/95 backdrop-blur-sm text-foreground text-xs font-semibold shadow-sm rounded-md border border-border/50">
                            ৳{expectedSalary}/mo
                        </div>
                    </div>
                )}
            </div>

            <CardContent className="p-4 flex-grow flex flex-col">
                <div className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-medium text-muted-foreground">{ratings || '4.9'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5 mb-5 flex-grow">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap size={14} className="shrink-0 opacity-70" />
                        <p className="text-xs font-medium truncate">
                            {qualification || 'Certified Tutor'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={14} className="shrink-0 opacity-70" />
                        <p className="text-xs font-medium truncate">
                            {location || 'Dhaka'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {subjects && Array.isArray(subjects) && subjects.slice(0, 3).map((sub, i) => (
                        <Badge key={i} variant="outline" className="rounded-md border-border/50 bg-muted/20 text-[10px] font-medium text-muted-foreground px-1.5 py-0.5">
                            {sub}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full h-9 text-xs font-medium rounded-md bg-transparent border-border/80 hover:bg-muted/40 transition-colors">
                    <Link to={`/tutor/${_id}`} className="flex items-center justify-center gap-1.5">
                        View Profile
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TutorCard;
