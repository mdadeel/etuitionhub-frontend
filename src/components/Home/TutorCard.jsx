// Tutor Card - individual tutor er info dekhabe
import { Link } from 'react-router-dom';
// import { useState } from 'react';

const TutorCard = ({ tutor }) => {
    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, ratings, subjects, expectedSalary } = tutor;

    return (

        <div className="card-quiet group h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-xl border border-gray-100 bg-white">
            {/* Colorful top border/accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-600"></div>

            <div className="aspect-[3/2] overflow-hidden bg-gray-50 border-b border-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300"></div>
                <img
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                    alt={displayName}
                    className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />

                {/* Floating Badges */}
                <div className="absolute top-3 right-3 z-20">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-indigo-700 rounded-md shadow-sm">
                        Pro Tutor
                    </span>
                </div>

                {expectedSalary && (
                    <div className="absolute bottom-4 left-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <span>৳</span> {expectedSalary}/mo
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow flex flex-col">
                <div className="mb-3">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-lg font-extrabold text-gray-900 truncate group-hover:text-teal-600 transition-colors">{displayName}</h3>
                        <div className="flex items-center gap-1 shrink-0 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-yellow-600 text-xs font-black">{ratings || '4.5'}</span>
                        </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 truncate">{qualification || 'Certified Tutor'}</p>
                </div>

                <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="truncate font-medium">{location || 'Dhaka'}</span>
                    </div>

                    {subjects && Array.isArray(subjects) && subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {subjects.slice(0, 3).map((sub, i) => (
                                <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-tight rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                    {sub}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <Link
                    to={`/tutor/${_id}`}
                    className="w-full py-2.5 bg-teal-600 text-white font-bold text-xs rounded-lg hover:bg-teal-700 transition-all text-center uppercase tracking-widest"
                >
                    View Profile →
                </Link>
            </div>
        </div>
    );
};

export default TutorCard;

