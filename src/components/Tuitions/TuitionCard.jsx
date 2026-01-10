/**
 * TuitionCard Component
 * 
 * Displays single tuition post with high-signal data prioritization.
 */
import { useNavigate } from 'react-router-dom';

const TuitionCard = ({ tuition }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/tuition/${tuition._id}`);
    };

    return (
        <div className="group flex flex-col h-full fade-up bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] transition-all duration-300 hover:shadow-xl hover:border-teal-200 hover:-translate-y-1">
            <div className="p-5 flex-grow relative">
                <div className="mb-3">
                    <span className="px-3 py-1 bg-teal-600/10 text-teal-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-teal-600/20">
                        {tuition.class_name}
                    </span>
                </div>
                <h2 className="text-lg font-black text-[var(--color-text-primary)] mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">
                    {tuition.subject}
                </h2>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 mb-4">
                    {tuition.description || "Looking for an expert tutor to guide through complex concepts and ensure academic excellence. Direct communication protocol active."}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--color-border)] transition-colors">
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium tracking-tight">{tuition.location}</span>
                        </div>
                        <span className="font-black text-teal-600">৳{tuition.salary}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{tuition.days_per_week || 3} Days / Week</span>
                    </div>
                </div>
            </div>

            <button
                className="w-full py-4 bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] font-black text-[10px] hover:bg-teal-600 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] border-t border-[var(--color-border)]"
                onClick={handleViewDetails}
            >
                Synchronize Details →
            </button>
        </div>
    );
};

export default TuitionCard;
