import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TutorCard from '../components/Home/TutorCard';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, 
    ArrowRight,
    Star, 
    Clock, 
    Banknote, 
    CheckCircle2, 
    MapPin, 
    Calendar, 
    ShieldCheck, 
    Award,
    Send,
    Bookmark,
    ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Tutor Details Page
 * Refactored to "Apple macOS Native Density"
 * Features: High-precision typography, translucent glass, pill-shaped UI, compact information grouping.
 */
const TutorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = demoTutors.find(t => t._id === id);
            setTutor(found);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [id]);

    const handleContact = () => {
        toast.success(`Request sent to ${tutor.displayName}. Check your Dashboard.`);
    };

    const handleSave = () => {
        toast.success('Profile saved to favorites.');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-apple-gray-100">
            <LoadingSpinner />
        </div>
    );

    if (!tutor) {
        return (
            <div className="max-w-xl mx-auto px-6 py-20 text-center bg-apple-gray-100 min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-apple-gray-900 mb-2">Profile Unavailable</h1>
                <p className="text-apple-gray-500 mb-8 text-sm">The tutor node you are looking for does not exist or has been moved.</p>
                <Button asChild className="mac-pill bg-apple-blue hover:bg-apple-blue/90 text-white border-none shadow-apple-sm">
                    <Link to="/tutors">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-apple-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8 selection:bg-apple-blue/20 selection:text-apple-blue">
            <div className="max-w-6xl mx-auto">
                {/* Compact Navigation Bar */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/tutors" className="flex items-center gap-1 text-[11px] font-semibold text-apple-gray-500 hover:text-apple-blue transition-colors group">
                        <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" /> 
                        Directory
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={handleSave} className="text-apple-gray-400 hover:text-apple-blue transition-colors">
                            <Bookmark size={16} />
                        </button>
                        <button className="text-apple-gray-400 hover:text-apple-blue transition-colors">
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Primary Identity & Info */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Identity Card (macOS Style) */}
                        <div className="apple-card p-6 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Avatar with Apple Border */}
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border border-apple-gray-200 shadow-apple-sm">
                                    <img
                                        src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt={tutor.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {tutor.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 bg-apple-blue text-white p-1.5 rounded-full shadow-apple-md border-2 border-white">
                                        <ShieldCheck size={14} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge className="bg-apple-gray-800 text-white hover:bg-apple-gray-800 rounded-md text-[10px] px-2 py-0.5 font-bold tracking-tight">
                                        PROFESSIONAL
                                    </Badge>
                                    <span className="text-[11px] font-medium text-apple-gray-400 flex items-center gap-1">
                                        <MapPin size={10} /> {tutor.location}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-apple-gray-900 mb-1 leading-tight">{tutor.displayName}</h1>
                                <p className="text-sm text-apple-gray-500 font-medium mb-6">
                                    {tutor.qualification}
                                </p>

                                <div className="flex items-center gap-8 border-t border-apple-gray-100 pt-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-wider mb-1">Rate</span>
                                        <span className="text-lg font-bold text-apple-gray-900 leading-none">৳{tutor.expectedSalary}<span className="text-[10px] text-apple-gray-400 font-medium lowercase">/mo</span></span>
                                    </div>
                                    <div className="w-px h-8 bg-apple-gray-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-wider mb-1">Exp</span>
                                        <span className="text-lg font-bold text-apple-gray-900 leading-none">{tutor.experience}</span>
                                    </div>
                                    <div className="w-px h-8 bg-apple-gray-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-apple-gray-400 uppercase tracking-wider mb-1">Rating</span>
                                        <div className="flex items-center gap-1 leading-none">
                                            <span className="text-lg font-bold text-apple-gray-900 leading-none">{tutor.ratings}</span>
                                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid (Apple Density) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section className="apple-card p-5">
                                <h2 className="text-xs font-bold text-apple-gray-900 mb-4 flex items-center gap-2">
                                    <Award size={14} className="text-apple-blue" />
                                    Specializations
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {tutor.subjects?.map((subject, idx) => (
                                        <Badge key={idx} className="bg-apple-gray-100 text-apple-gray-700 hover:bg-apple-gray-200 rounded-md text-[11px] font-medium border-none px-2 py-0.5">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </section>

                            <section className="apple-card p-5">
                                <h2 className="text-xs font-bold text-apple-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar size={14} className="text-apple-blue" />
                                    Availability
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {tutor.availableDays?.map((day, idx) => (
                                        <Badge key={idx} className="bg-white text-apple-gray-500 border border-apple-gray-200 rounded-md text-[11px] font-medium px-2 py-0.5">
                                            {day}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* About Section (High Fidelity) */}
                        <section className="apple-card p-6">
                            <h2 className="text-xs font-bold text-apple-gray-900 mb-4">Professional Overview</h2>
                            <p className="text-sm text-apple-gray-600 leading-relaxed">
                                {tutor.displayName} is a highly qualified educator with a focus on {tutor.subjects?.[0]} and {tutor.subjects?.[1]}. 
                                With {tutor.experience} of practical experience, they provide a structured and result-oriented learning environment 
                                for students in the {tutor.location} area.
                            </p>
                        </section>
                    </div>

                    {/* Right Column: Sticky Protocol Panel (Glassmorphism) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8">
                        <div className="glass p-8 rounded-container shadow-apple-lg border-white/40 overflow-hidden relative">
                            {/* Subtle Ambient Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/5 blur-3xl -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-apple-gray-900 mb-2">Connect</h3>
                                <p className="text-xs text-apple-gray-500 mb-8 leading-normal font-medium">
                                    Send a connection request to initiate tuition arrangements.
                                </p>

                                <div className="space-y-3">
                                    {!user ? (
                                        <Button asChild className="w-full mac-pill bg-apple-gray-100 text-apple-gray-800 hover:bg-apple-gray-200 border-none shadow-apple-sm">
                                            <Link to="/login">Login to Message</Link>
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={handleContact}
                                            className="w-full mac-pill bg-apple-blue hover:bg-apple-blue/90 text-white border-none shadow-apple-sm"
                                        >
                                            <Send size={14} className="mr-2" /> Contact Tutor
                                        </Button>
                                    )}

                                    <Button 
                                        variant="outline"
                                        onClick={handleSave}
                                        className="w-full mac-pill bg-white dark:bg-transparent border-apple-gray-200 dark:border-apple-gray-700 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-50"
                                    >
                                        <Bookmark size={14} className="mr-2" /> Save Profile
                                    </Button>
                                </div>

                                <div className="mt-10 pt-6 border-t border-apple-gray-200/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-apple-gray-900 uppercase">Background Verified</p>
                                        <p className="text-[10px] text-apple-gray-400 font-medium">Educational credentials validated</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations (Compact Grid) */}
                <div className="mt-16 pt-12 border-t border-apple-gray-200">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-apple-blue mb-1 block">Suggestions</span>
                            <h2 className="text-xl font-bold text-apple-gray-900">Similar Tutors</h2>
                        </div>
                        <Button asChild variant="ghost" className="text-[11px] font-bold text-apple-blue hover:text-apple-blue/80 h-auto p-0 flex items-center gap-1 group">
                            <Link to="/tutors">
                                Browse all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {demoTutors
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map(item => (
                                <div key={item._id} className="transform hover:scale-[1.02] transition-transform duration-300">
                                    <TutorCard tutor={item} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDetails;
