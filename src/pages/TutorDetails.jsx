import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import demoTutors from '../data/demoTutors.json';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TutorCard from '../components/Home/TutorCard';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, 
    Star, 
    Clock, 
    Banknote, 
    CheckCircle2, 
    MapPin, 
    Calendar, 
    ShieldCheck, 
    Award,
    Send,
    Bookmark
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Tutor Details Page
 * Refactored to "Technical Emerald Minimalism"
 * Features: Sharp geometry, technical metrics, high-contrast typography
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
        toast.success(`Contact request sent to ${tutor.displayName}! Awaiting response.`);
    };

    const handleSave = () => {
        toast.success('Node saved to favorites.');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner />
        </div>
    );

    if (!tutor) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center bg-background min-h-screen">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Error 404 // NODE_NOT_FOUND</span>
                <h1 className="text-4xl font-black text-foreground mb-8 uppercase italic">Expert profile not found.</h1>
                <Button asChild variant="outline" className="rounded-none px-8 font-black uppercase tracking-widest border-primary text-primary">
                    <Link to="/tutors">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-10 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Breadcrumb */}
                <div className="mb-10">
                    <Link to="/tutors" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group italic">
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
                        Back to Specialist Directory
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-8 space-y-10">
                        <header className="bg-background border border-border p-10 rounded-none relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-none -mr-24 -mt-24 rotate-45"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-10">
                                {/* Avatar */}
                                <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-none overflow-hidden border border-border shadow-lg bg-muted p-1">
                                    <img
                                        src={tutor.photoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt={tutor.displayName}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>

                                <div className="flex-grow flex flex-col justify-center">
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <Badge className="rounded-none bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                            PRO_SPECIALIST
                                        </Badge>
                                        {tutor.isVerified && (
                                            <Badge variant="outline" className="rounded-none border-primary text-primary bg-primary/5 text-[9px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                                                <ShieldCheck size={10} /> VERIFIED_NODE
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-4 uppercase italic leading-none">{tutor.displayName}</h1>
                                    <p className="text-lg text-muted-foreground font-bold mb-8 uppercase tracking-tight max-w-xl border-l-2 border-primary pl-4">
                                        {tutor.qualification}
                                    </p>

                                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1">
                                                <Clock size={10} className="text-primary" /> Experience
                                            </span>
                                            <span className="text-2xl font-black text-foreground tabular-nums uppercase">{tutor.experience}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1">
                                                <Star size={10} className="text-primary" /> Metrics
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-2xl font-black text-foreground tabular-nums">{tutor.ratings}/5</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1">
                                                <Banknote size={10} className="text-primary" /> Rate / mo
                                            </span>
                                            <span className="text-2xl font-black text-primary tabular-nums italic">৳{tutor.expectedSalary}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section className="bg-muted/10 border border-border p-8 rounded-none">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8 flex items-center gap-3">
                                    <div className="w-1 h-4 bg-primary"></div>
                                    Specializations
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects?.map((subject, idx) => (
                                        <Badge key={idx} variant="secondary" className="rounded-none bg-background border border-border text-[10px] font-black text-muted-foreground uppercase tracking-tight px-3 py-2">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-muted/10 border border-border p-8 rounded-none">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8 flex items-center gap-3">
                                    <div className="w-1 h-4 bg-primary"></div>
                                    Availability Matrix
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.availableDays?.map((day, idx) => (
                                        <Badge key={idx} variant="outline" className="rounded-none border-border bg-background text-[10px] font-black text-muted-foreground uppercase tracking-tight px-3 py-2">
                                            {day}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Location */}
                        <section className="bg-muted/10 border border-border p-8 rounded-none">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-6 flex items-center gap-3">
                                <div className="w-1 h-4 bg-primary"></div>
                                Geospacial Coordinates
                            </h2>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={14} className="text-primary" /> {tutor.location}
                            </p>
                        </section>
                    </div>

                    {/* Right Column: Sticky Action Panel */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-background border border-border p-10 rounded-none shadow-xl relative overflow-hidden">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-none -rotate-12"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic tracking-tighter">Connect Protocol</h3>
                                <p className="text-[10px] text-muted-foreground mb-10 leading-relaxed font-bold uppercase tracking-widest">
                                    Initiate professional engagement. Target node will receive transmission within 24 standard hours.
                                </p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <Button asChild variant="secondary" className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] border border-border shadow-sm">
                                            <Link to="/login" className="flex items-center gap-2">
                                                Login to Connect
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={handleContact}
                                            className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Send size={18} /> Contact Specialist
                                        </Button>
                                    )}

                                    <Button 
                                        variant="outline"
                                        onClick={handleSave}
                                        className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] border-border hover:bg-muted transition-all flex items-center justify-center gap-2"
                                    >
                                        <Bookmark size={18} /> Save Identity
                                    </Button>
                                </div>

                                <div className="mt-10 pt-10 border-t border-border flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-foreground tracking-widest">Identity Validated</p>
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Node background verification: PASS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Find More Section */}
                <div className="mt-32 pt-20 border-t border-border">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block italic">Curation Pipeline</span>
                            <h2 className="text-5xl font-black tracking-tighter text-foreground uppercase italic">Simmilar Nodes.</h2>
                        </div>
                        <Button asChild variant="ghost" className="rounded-none font-black text-xs uppercase tracking-[0.2em] group h-auto p-0">
                            <Link to="/tutors" className="flex items-center gap-2 italic">
                                Browse All Specialists <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border bg-border">
                        {demoTutors
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map(item => (
                                <div key={item._id} className="bg-background border-r border-b border-border hover:bg-muted/30 transition-colors">
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
