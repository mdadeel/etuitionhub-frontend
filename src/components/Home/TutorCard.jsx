// Tutor Card - individual tutor er info dekhabe
// lists and grids e use hobe - TODO: favorite button add korbo
import { Link } from 'react-router-dom';

function TutorCard({ tutor }) {
    let { _id, displayName, photoURL, qualification, location, ratings, subjects, experience, expectedSalary } = tutor;

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <figure className="px-4 pt-4">
                <img
                    src={photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                    alt={displayName}
                    className="rounded-xl h-48 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h3 className="card-title">{displayName}</h3>
                <p className="text-sm text-gray-600">{qualification}</p>
                <p className="text-sm">📍 {location}</p>
                {experience && <p className="text-sm">💼 {experience} experience</p>}

                {/* Subjects tags */}
                {subjects && subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-2">
                        {subjects.slice(0, 3).map((subject, idx) => (
                            <span key={idx} className="badge badge-outline badge-sm">{subject}</span>
                        ))}
                    </div>
                )}

                {/* Rating display */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{ratings || 'N/A'}</span>
                    </div>
                    {expectedSalary && (
                        <span className="text-teal-600 font-bold">৳{expectedSalary}/mo</span>
                    )}
                </div>

                <div className="card-actions justify-end mt-2">
                    <Link to={`/tutor/${_id}`} className="btn bg-teal-600 text-white hover:bg-teal-700 btn-sm border-none">
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TutorCard;
