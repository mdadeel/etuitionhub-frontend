/**
 * Tutor Details Page
 * Displays full tutor profile information - Compact redesign
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TutorCard from '../components/Home/TutorCard';
import toast from 'react-hot-toast';

const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const found = demoTutors.find(t => t._id === id);
            setTutor(found);
            setLoading(false);
        }, 300);
    }, [id]);

    const handleContact = () => {
        toast.success(`Contact request sent to ${tutor.displayName}! They will reach out via email.`);
    };

    const handleSave = () => {
        toast.success('Profile saved to your favorites!');
    };

    if (loading) return <LoadingSpinner />;

    if (!tutor) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">Error 404</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Expert profile not found.</h1>
                <Link to="/tutors" className="btn-quiet-secondary inline-block px-8">
                    Return to Professionals
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-text-primary)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/tutors" className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <span>←</span> Back to Professionals
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <header className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-xl shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-0"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                {/* Avatar */}
                                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-[var(--color-surface)] shadow-xl bg-[var(--color-surface-muted)]">
                                    <img
                                        src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt={tutor.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                                            Pro Tutor
                                        </span>
                                        {tutor.isVerified && (
                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wide border border-green-500/20 rounded">
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-2">{tutor.displayName}</h1>
                                    <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-6">{tutor.qualification}</p>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Experience</span>
                                            <span className="text-lg font-extrabold text-[var(--color-text-primary)]">{tutor.experience}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Rating</span>
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-lg font-extrabold text-yellow-500">{tutor.ratings}/5</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Fee / month</span>
                                            <span className="text-lg font-extrabold text-teal-600">৳{tutor.expectedSalary}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-[var(--color-surface-muted)]/50 border border-[var(--color-border)] p-6 rounded-xl">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                                    Specializations
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects?.map((subject, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-tight rounded-lg">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-[var(--color-surface-muted)]/50 border border-[var(--color-border)] p-6 rounded-xl">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                                    Availability
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.availableDays?.map((day, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] rounded-lg">
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Location */}
                        <section className="bg-[var(--color-surface-muted)]/50 border border-[var(--color-border)] p-6 rounded-xl">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-red-500 rounded-full"></span>
                                Location
                            </h2>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">{tutor.location}</p>
                        </section>
                    </div>

                    {/* Right Column: Sticky Action Panel */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full -z-0"></div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-2">Connect with {tutor.displayName.split(' ')[0]}</h3>
                                <p className="text-xs text-[var(--color-text-muted)] mb-8 leading-relaxed font-medium">Request a professional engagement. The tutor will respond within 24 hours.</p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <Link
                                            to="/login"
                                            className="w-full h-14 flex items-center justify-center gap-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all font-mono tracking-tighter"
                                        >
                                            Login to Connect
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleContact}
                                            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                        >
                                            Contact Professional
                                        </button>
                                    )}

                                    <button
                                        onClick={handleSave}
                                        className="w-full h-14 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold rounded-lg hover:bg-[var(--color-surface-muted)] transition-all text-sm uppercase tracking-widest"
                                    >
                                        Save Profile
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-[var(--color-text-primary)]">Identity Verified</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-tighter">Background check passed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Find More Section */}
                <div className="mt-20 border-t border-[var(--color-border)] pt-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Curation</span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">Find More Tutors</h2>
                        </div>
                        <Link to="/tutors" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2">
                            Browse All Professionals <span>→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {demoTutors
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map(item => (
                                <TutorCard key={item._id} tutor={item} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

        export default TutorDetails;
