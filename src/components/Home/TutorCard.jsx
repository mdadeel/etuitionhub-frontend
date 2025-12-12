// Tutor Card - individual tutor er info dekhabe
import { Link } from 'react-router-dom';

function TutorCard({ tutor }) {
    let { _id, displayName, photoURL, qualification, location, ratings, subjects, experience, expectedSalary } = tutor;

    return (
        <div className="card bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <figure className="px-4 pt-4">
                <img
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                    alt={displayName}
                    className="rounded-lg h-48 w-full object-cover"
                />
            </figure>
            <div className="card-body p-4">
                <h3 className="card-title text-lg text-gray-800">{displayName}</h3>
                <p className="text-sm text-teal-600 font-medium">{qualification || 'Tutor'}</p>

                {location && <p className="text-sm text-gray-600">📍 {location}</p>}
                {experience && <p className="text-sm text-gray-600">💼 {experience}</p>}

                {/* Subjects tags */}
                {subjects && subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-2">
                        {subjects.slice(0, 3).map((subject, idx) => (
                            <span key={idx} className="badge badge-outline badge-sm text-teal-600 border-teal-300">{subject}</span>
                        ))}
                    </div>
                )}

                {/* Rating and salary */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-gray-700">{ratings || 'N/A'}</span>
                    </div>
                    {expectedSalary && (
                        <span className="text-teal-600 font-bold">৳{expectedSalary}/mo</span>
                    )}
                </div>

                <div className="card-actions justify-end mt-3">
                    <Link
                        to={`/tutor/${_id}`}
                        className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white border-none px-4"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TutorCard;

