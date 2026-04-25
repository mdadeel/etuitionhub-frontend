import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Users, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TutorCard = ({ tutor }) => {
    const navigate = useNavigate();
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, subjects = [], isVerified, studentsCount = 0 } = tutor;
    const rating = tutor.ratings || tutor.rating || 4.9;
    const salary = tutor.expectedSalary || 5000;

    return (
        <div 
            onClick={() => navigate(`/tutor/${_id}`)}
            className="group relative bg-white border border-border/50 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 p-6"
        >
            {/* Top Header: Avatar, Name & Rating */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                    <div className="relative shrink-0">
                        <img 
                            src={photoURL || 'https://i.pravatar.cc/150?img=1'} 
                            alt={displayName}
                            className="w-14 h-14 rounded-2xl object-cover shadow-sm transition-all duration-300 group-hover:shadow-md" 
                        />
                        {isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-lg border-2 border-white shadow-sm">
                                <ShieldCheck size={10} />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-black text-base text-foreground group-hover:text-primary transition-colors truncate">{displayName}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{qualification || 'Academic Specialist'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full shrink-0">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black text-yellow-700">{rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Middle Section: Subjects */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {subjects.slice(0, 3).map((sub, i) => (
                        <Badge key={i} variant="secondary" className="bg-muted/50 text-[9px] font-black px-2.5 py-0.5 rounded-lg border-none uppercase tracking-tight">
                            {sub}
                        </Badge>
                    ))}
                </div>
            </div>


            {/* Bottom Section: Stats & Pricing */}
            <div className="pt-5 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users size={14} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{studentsCount || 100}+ Students</span>
                </div>
                <div className="text-right">
                    <span className="text-sm font-black text-primary">৳{salary.toLocaleString()}/hr</span>
                </div>
            </div>

            {/* Subtle Hover Reveal */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-5 h-5 text-muted-foreground/20" />
            </div>
        </div>
    );
};

export default TutorCard;