import { useNavigate } from 'react-router-dom';
import { Star, MapPin, BookOpen } from "lucide-react";

const TutorCard = ({ tutor }) => {
    const navigate = useNavigate();
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, subjects = [], isVerified, availableDays = [] } = tutor;
    const rating = tutor.ratings || tutor.rating || 4.8;
    const salary = tutor.expectedSalary || 5000;
    const experience = tutor.experience || '1-2 years';

    // Generate human-like micro-details
    const teachingStyles = [
        "Visual learner focused",
        "Concept-based teaching",
        "Problem-solving approach",
        "Exam-oriented strategy",
        "Patient & step-by-step"
    ];
    const randomStyle = teachingStyles[Math.floor(Math.random() * teachingStyles.length)];
    return (
        <div
            onClick={() => navigate(`/tutor/${_id}`)}
            className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all"
        >
            <div className="p-4">
                {/* Photo + Name row */}
                <div className="flex gap-4">
                    <div className="relative shrink-0">
                        <img
                            src={photoURL || '/default-avatar.png'}
                            alt={displayName}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{displayName}</h3>
                        <p className="text-xs text-slate-500 italic">{randomStyle}</p>
                    </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-100">
                    {subjects.slice(0, 2).map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                            {sub}
                        </span>
                    ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {experience}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                        <Star size={12} className="fill-current" />
                        {rating.toFixed(1)}
                    </span>
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {location.split(',')[0]}
                        </span>
                    )}
                </div>
            </div>

            {/* Fee & CTA */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
                <div>
                    <span className="text-lg font-semibold text-blue-600">৳{salary.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">/month</span>
                </div>
                <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    View
                </button>
            </div>
        </div>
    );
};

export default TutorCard;