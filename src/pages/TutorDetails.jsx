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
    MapPin, 
    Calendar, 
    ShieldCheck, 
    Award,
    Send,
    Bookmark,
    ExternalLink,
    CheckCircle2,
    Briefcase,
    Clock
} from 'lucide-react';
import { AppleBadge, AppleCard, AppleButton } from '../components/shared/AppleUI';
import AOS from 'aos';

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

    useEffect(() => {
        if (typeof AOS !== 'undefined' && AOS.refresh) {
            AOS.refresh();
        }
    }, [tutor]);

    const handleContact = () => {
        toast.success(`Message sent to ${tutor.displayName}.`);
    };

    const handleSave = () => {
        toast.success('Saved to favorites.');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner />
        </div>
    );

    if (!tutor) {
        return (
            <div className="max-w-xl mx-auto px-6 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
                <p className="text-muted-foreground mb-8 text-sm">We couldn't find the tutor you are looking for.</p>
                <AppleButton asChild variant="primary">
                    <Link to="/tutors">Back to Tutors</Link>
                </AppleButton>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-8 px-6 selection:bg-primary/20 selection:text-primary">
            <div className="max-w-[1100px] mx-auto">
                {/* Back Link */}
                <div className="mb-8">
                    <Link to="/tutors" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
                        Back to Tutors
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Identity Card */}
                        <AppleCard className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center" hover={false}>
                            <div className="relative shrink-0">
                                <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border border-border shadow-apple-md">
                                    <img
                                        src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt={tutor.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {tutor.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-xl shadow-apple-lg border-2 border-background">
                                        <ShieldCheck size={16} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <AppleBadge variant="primary">Verified Tutor</AppleBadge>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={10} className="text-primary" /> {tutor.location}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{tutor.displayName}</h1>
                                <p className="text-base text-muted-foreground font-medium mb-6">
                                    {tutor.qualification}
                                </p>

                                <div className="flex items-center gap-8 pt-6 border-t border-border/50">
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Fee</p>
                                        <p className="text-xl font-bold text-foreground tabular-nums">৳{tutor.expectedSalary}</p>
                                    </div>
                                    <div className="w-px h-8 bg-border/50"></div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Experience</p>
                                        <p className="text-xl font-bold text-foreground">{tutor.experience}</p>
                                    </div>
                                    <div className="w-px h-8 bg-border/50"></div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rating</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-xl font-bold text-foreground">{tutor.ratings}</p>
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AppleCard className="p-6" hover={false}>
                                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Award size={14} className="text-primary" /> Subjects
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {tutor.subjects?.map((subject, idx) => (
                                        <span key={idx} className="bg-muted px-3 py-1 rounded-lg text-xs font-medium text-foreground">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </AppleCard>

                            <AppleCard className="p-6" hover={false}>
                                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Calendar size={14} className="text-primary" /> Availability
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {tutor.availableDays?.map((day, idx) => (
                                        <span key={idx} className="bg-muted/50 border border-border/50 px-3 py-1 rounded-lg text-xs font-medium text-foreground">
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </AppleCard>
                        </div>

                        {/* About Section */}
                        <AppleCard className="p-8" hover={false}>
                            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">About the Tutor</h2>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                {tutor.displayName} is a qualified teacher helping students in {tutor.subjects?.join(', ')}. 
                                With {tutor.experience} of experience, they provide simple and effective learning 
                                for students in {tutor.location}.
                            </p>
                        </AppleCard>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <AppleCard className="p-8 bg-card shadow-xl relative overflow-hidden" hover={false}>
                            <div className="relative z-10 text-center">
                                <h3 className="text-xl font-bold text-foreground mb-2">Want to learn?</h3>
                                <p className="text-xs text-muted-foreground mb-8">
                                    Send a message to start classes with {tutor.displayName.split(' ')[0]}.
                                </p>

                                <div className="space-y-3">
                                    {!user ? (
                                        <AppleButton asChild variant="secondary" className="w-full h-12">
                                            <Link to="/login">Login to Message</Link>
                                        </AppleButton>
                                    ) : (
                                        <AppleButton 
                                            onClick={handleContact}
                                            className="w-full h-12 shadow-apple-md"
                                        >
                                            <Send size={16} className="mr-2" /> Contact Tutor
                                        </AppleButton>
                                    )}

                                    <AppleButton 
                                        variant="outline"
                                        onClick={handleSave}
                                        className="w-full h-12"
                                    >
                                        <Bookmark size={16} className="mr-2" /> Save Profile
                                    </AppleButton>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-bold text-foreground uppercase tracking-widest">Profile Verified</p>
                                        <p className="text-[8px] text-muted-foreground font-medium uppercase">Documents checked</p>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>

                        {/* Quick Info */}
                        <AppleCard className="p-6 bg-muted/20 border-dashed" hover={false}>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Briefcase size={14} className="text-primary" />
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Response Time</p>
                                        <p className="text-xs font-bold text-foreground">Under 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={14} className="text-primary" />
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active Status</p>
                                        <p className="text-xs font-bold text-foreground">Online recently</p>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>
                    </div>
                </div>

                {/* Similar Tutors */}
                <div className="mt-20 pt-12 border-t border-border/50">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">Suggestions</span>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">Similar Tutors</h2>
                        </div>
                        <AppleButton asChild variant="ghost" size="sm" className="group text-xs">
                            <Link to="/tutors" className="flex items-center gap-2">
                                View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </AppleButton>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {demoTutors
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map((item, idx) => (
                                <div key={item._id} data-aos="fade-up" data-aos-delay={idx * 100}>
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
