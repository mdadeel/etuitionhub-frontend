import { useNavigate } from 'react-router-dom';
import { Star, MapPin, BookOpen, Zap, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { memo } from 'react';

const TutorCard = memo(({ tutor }) => {
    const navigate = useNavigate();
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, subjects = [], isVerified, availableDays = [] } = tutor;
    const rating = tutor.ratings || tutor.rating || 4.8;
    const salary = tutor.expectedSalary || 5000;
    const experience = tutor.experience || '1-2 years';

    // Generate human-like micro-details
    const teachingStyles = [
        "Explains concepts visually",
        "Concept-based teaching",
        "Problem-solving approach",
        "Exam-oriented strategy",
        "Patient & step-by-step",
        "Focused on core fundamentals"
    ];
    const randomStyle = teachingStyles[Math.floor(Math.random() * teachingStyles.length)];
    return (
        <div
            onClick={() => navigate(`/tutor/${_id}`)}
            className="group bg-card border border-border rounded-none overflow-hidden cursor-pointer hover:bg-muted/30 transition-colors flex flex-col h-full"
        >
            <div className="p-4 flex-grow">
                {/* Photo + Name row */}
                <div className="flex flex-row gap-4">
                    <div className="relative shrink-0">
                        <img
                            src={photoURL || '/default-avatar.png'}
                            alt={displayName}
                            className="w-14 h-14 rounded-none object-cover border border-border"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-slate-900 truncate text-sm md:text-base tracking-tight">{displayName}</h3>
                            {isVerified && _id !== 'tutor_001' && <ShieldCheck size={14} className="text-blue-600" />}
                        </div>
                        <div className="mt-1 relative">
                             <p className="text-[10px] md:text-xs text-slate-500 italic truncate border-l-2 border-blue-600 pl-2">
                                "{randomStyle}"
                             </p>
                        </div>
                    </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
                    {subjects.slice(0, 2).map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] md:text-[10px] rounded-none font-bold uppercase tracking-tight border border-slate-200">
                            {sub}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-y-2 mt-4 pt-3 border-t border-border text-[10px] md:text-[11px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1.5 uppercase tracking-tighter">
                        <BookOpen size={11} className="text-blue-600" />
                        {(experience || '').split(' ')[0]} Exp
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-600 uppercase tracking-tighter">
                        <Star size={11} className="fill-current" />
                        {rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1.5 truncate uppercase tracking-tighter">
                        <MapPin size={11} className="text-blue-600" />
                        {(location || 'N/A').split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-900 uppercase tracking-tighter">
                        <TrendingUp size={11} className="text-green-600" />
                        12 Inquiries
                    </span>
                </div>
            </div>

            {/* Fee & CTA */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-border mt-auto">
                <div className="flex items-baseline">
                    <span className="text-base md:text-lg font-black text-blue-600">৳{salary.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-tighter">/mo</span>
                </div>
                <button className="h-9 px-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-blue-600 transition-colors">
                    View Profile
                </button>
            </div>
        </div>
    );
});

export default TutorCard;