import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin } from "lucide-react";

const TutorCard = ({ tutor }) => {
    const navigate = useNavigate();
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, subjects = [], isVerified } = tutor;
    const rating = tutor.ratings || tutor.rating || 4.9;
    const salary = tutor.expectedSalary || 5000;

    return (
        <div 
            onClick={() => navigate(`/tutor/${_id}`)}
            className="bg-card border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-border/80 transition-all duration-300"
        >
            <div className="p-4">
                <div className="flex gap-3">
                    <div className="relative shrink-0">
                        <img 
                            src={photoURL || 'https://i.pravatar.cc/150?img=1'} 
                            alt={displayName}
                            className="w-16 h-16 rounded-xl object-cover" 
                        />
                        {isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-md">
                                <ShieldCheck size={12} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{displayName}</h3>
                        <p className="text-xs text-muted-foreground truncate">{qualification || 'Academic Specialist'}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <MapPin size={10} />
                            <span className="truncate">{location || 'Dhaka'}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            {rating.toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                    {subjects.slice(0, 3).map((sub, i) => (
                        <span key={i} className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded-md">
                            {sub}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-sm font-semibold text-primary">৳{salary.toLocaleString()}/mo</span>
                    <span className="text-xs font-medium text-primary">View Profile</span>
                </div>
            </div>
        </div>
    );
};

export default TutorCard;