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
        <div className="group flex flex-col h-full fade-up bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-teal-200 hover:-translate-y-1">
            <div className="p-4 flex-grow relative">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full -z-0"></div>

                <div className="relative z-10 flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                            {tuition.class_name}
                        </span>
                        <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-teal-500 transition-all">
                            {tuition.subject}
                        </h2>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 group-hover:border-teal-50 transition-colors">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{tuition.location}</span>
                        </div>
                        <span className="font-bold text-teal-600">৳{tuition.salary}/mo</span>
                    </div>

                    {tuition.days_per_week && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{tuition.days_per_week} days/week</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                className="w-full py-3 bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all duration-300 uppercase tracking-widest"
                onClick={handleViewDetails}
            >
                View Details →
            </button>
        </div>
    );
};

export default TuitionCard;
