// Tutor Card - individual tutor er info dekhabe
import { Link } from 'react-router-dom';
// import { useState } from 'react';

const TutorCard = ({ tutor }) => {
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, ratings, subjects, expectedSalary } = tutor;

    return (
        <div className="card-quiet group h-full flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-100 relative">
                <img
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                    alt={displayName}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                {expectedSalary && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-white border border-gray-200 text-sm font-bold text-gray-900 shadow-sm">
                        ৳{expectedSalary}/mo
                    </div>
                )}
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{displayName}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                            <span className="text-indigo-600 text-xs font-bold">★ {ratings || 'N/A'}</span>
                        </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 truncate">{qualification || 'Tutor'}</p>
                </div>

                <div className="space-y-2 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span className="opacity-60 text-xs uppercase tracking-tight font-bold w-12">Area</span>
                        <span className="truncate">{location || 'Dhaka'}</span>
                    </div>
                    {subjects && Array.isArray(subjects) && subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {subjects.slice(0, 3).map((sub, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                                    {sub}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <Link
                    to={`/tutor/${_id}`}
                    className="btn-quiet-secondary w-full text-center"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default TutorCard;

