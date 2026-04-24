import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TutorCard from '../components/shared/TutorCard';
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
    Clock,
    GraduationCap,
    Heart
} from 'lucide-react';
import { AppleBadge, AppleCard, AppleButton } from '../components/shared/AppleUI';
import { motion, AnimatePresence } from 'framer-motion';

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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background min-h-screen py-12 px-6 selection:bg-primary/20 selection:text-primary">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1100px] mx-auto"
            >
                {/* Back Link */}
                <div className="mb-10">
                    <Link to="/tutors" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
                        Back to Tutors
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Identity Card */}
                        <AppleCard className="p-10 flex flex-col md:flex-row gap-10 items-start" hover={false}>
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border border-border/50 shadow-apple-lg">
                                    <img
                                        src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt={tutor.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {tutor.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-2xl shadow-apple-lg border-4 border-background">
                                        <ShieldCheck size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow pt-2">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <AppleBadge variant="primary" className="px-3 py-1">Verified Expert</AppleBadge>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 bg-muted/50 rounded-full border border-border/50">
                                        <MapPin size={10} className="text-primary" /> {tutor.location}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tight">
                                    {tutor.displayName}
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground font-semibold mb-8 flex items-center gap-2">
                                    <GraduationCap size={20} className="text-primary" />
                                    {tutor.qualification}
                                </p>

                                <div className="flex items-center gap-10 pt-8 border-t border-border/50">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Monthly Fee</p>
                                        <p className="text-2xl font-bold text-foreground tabular-nums">৳{tutor.expectedSalary}</p>
                                    </div>
                                    <div className="w-px h-10 bg-border/50"></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Experience</p>
                                        <p className="text-2xl font-bold text-foreground">{tutor.experience}</p>
                                    </div>
                                    <div className="w-px h-10 bg-border/50"></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Rating</p>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-2xl font-bold text-foreground">{tutor.ratings}</p>
                                            <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AppleCard className="p-8" hover={false}>
                                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Award size={16} className="text-primary" /> Specialized Subjects
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects?.map((subject, idx) => (
                                        <span key={idx} className="bg-muted text-foreground px-4 py-2 rounded-xl text-xs font-bold border border-border/50">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </AppleCard>

                            <AppleCard className="p-8" hover={false}>
                                <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" /> Weekly Availability
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.availableDays?.map((day, idx) => (
                                        <span key={idx} className="bg-muted/50 border border-border/50 px-4 py-2 rounded-xl text-xs font-bold text-foreground">
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </AppleCard>
                        </div>

                        {/* About Section */}
                        <AppleCard className="p-10" hover={false}>
                            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">About the Tutor</h2>
                            <p className="text-lg text-foreground font-bold leading-relaxed">
                                {tutor.displayName} is a highly qualified educator specialized in {tutor.subjects?.join(', ')}. 
                                With {tutor.experience} of proven experience, they provide a structured and simplified 
                                learning approach tailored for students in {tutor.location}.
                            </p>
                            <p className="text-base text-muted-foreground mt-4 leading-relaxed font-medium">
                                Committed to academic excellence and student growth, {tutor.displayName.split(' ')[0]} 
                                focuses on building strong conceptual foundations and problem-solving skills.
                            </p>
                        </AppleCard>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <AppleCard className="p-8 bg-card shadow-xl relative overflow-hidden" hover={false}>
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-bold text-foreground mb-3">Learn with {tutor.displayName.split(' ')[0]}</h3>
                                <p className="text-sm text-muted-foreground mb-10 font-medium">
                                    Book a trial class and experience a new standard of academic support.
                                </p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <AppleButton asChild variant="secondary" className="w-full h-14 text-sm">
                                            <Link to="/login">Login to Message</Link>
                                        </AppleButton>
                                    ) : (
                                        <AppleButton 
                                            onClick={handleContact}
                                            className="w-full h-14 shadow-apple-md text-sm"
                                        >
                                            <Send size={18} className="mr-2" /> Contact Tutor
                                        </AppleButton>
                                    )}

                                    <AppleButton 
                                        variant="outline"
                                        onClick={handleSave}
                                        className="w-full h-14 text-sm"
                                    >
                                        <Heart size={18} className="mr-2" /> Save Profile
                                    </AppleButton>
                                </div>

                                <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest">Verified Profile</p>
                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">Documents Validated</p>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>

                        {/* Quick Info */}
                        <AppleCard className="p-8 bg-muted/20 border-dashed" hover={false}>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                                        <Briefcase size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Response Time</p>
                                        <p className="text-sm font-bold text-foreground">Under 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Active Status</p>
                                        <p className="text-sm font-bold text-foreground">Recently Active</p>
                                    </div>
                                </div>
                            </div>
                        </AppleCard>
                    </div>
                </div>

                {/* Similar Tutors */}
                <div className="mt-24 pt-16 border-t border-border/50">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Recommendations</span>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">Similar Expert Tutors</h2>
                        </div>
                        <AppleButton asChild variant="ghost" size="sm" className="group text-xs font-bold uppercase tracking-widest">
                            <Link to="/tutors" className="flex items-center gap-2">
                                View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </AppleButton>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {demoTutors
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map((item, idx) => (
                                <motion.div key={item._id} variants={itemVariants}>
                                    <TutorCard tutor={item} />
                                </motion.div>
                            ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TutorDetails;

