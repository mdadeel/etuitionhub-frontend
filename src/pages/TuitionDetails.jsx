import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";
import demoTuitions from '../data/demoTuitions.json';
import api from '../services/api';
import { isValidObjectId } from '../utils/validators';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TuitionCard from '../components/Tuitions/TuitionCard';
import { 
    ArrowLeft, 
    Banknote, 
    MapPin, 
    Calendar, 
    Clock, 
    User, 
    CheckCircle2, 
    ShieldCheck, 
    FileText, 
    Send,
    Database,
    ChevronRight,
    ArrowRight,
    Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * Tuition Details Page
 * Refactored to "Technical Emerald Minimalism"
 */
const TuitionDetails = () => {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    const navigate = useNavigate();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        qualifications: "",
        experience: '',
        expectedSalary: ""
    });

    useEffect(() => {
        const fetchTuitionDetails = async () => {
            try {
                const response = await api.get(`/api/tuitions/${id}`);
                setTuition(response.data);
            } catch (error) {
                const demoTuition = demoTuitions.find(t => t._id === id);
                if (demoTuition) {
                    setTuition(demoTuition);
                } else {
                    toast.error('Requirement node not found.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTuitionDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !dbUser) {
            toast.error('Session required.');
            navigate('/login');
            return;
        }

        if (!formData.qualifications || !formData.experience || !formData.expectedSalary) {
            toast.error("All parameters required.");
            return;
        }

        if (formData.expectedSalary < 1000) {
            toast.error('Minimum salary threshold not met.');
            return;
        }

        if (!isValidObjectId(id)) {
            toast.error('Demo data interaction restricted.');
            return;
        }

        const applicationData = {
            tutorId: dbUser._id,
            tutorEmail: user.email,
            tutorName: user.displayName,
            tuitionId: id,
            studentEmail: tuition.student_email,
            qualifications: formData.qualifications,
            experience: formData.experience,
            expectedSalary: Number(formData.expectedSalary)
        };

        try {
            const response = await api.post('/api/applications', applicationData);
            if (response.status === 201) {
                toast.success("Application registered. Awaiting validation.");
                setShowModal(false);
                setFormData({ qualifications: '', experience: "", expectedSalary: '' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Submission failure.";
            toast.error(errorMessage);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner />
        </div>
    );

    if (!tuition) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center bg-background min-h-screen">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Error 404 // NODE_NOT_FOUND</span>
                <h1 className="text-4xl font-black text-foreground mb-8 uppercase italic">Requirement not found.</h1>
                <Button asChild variant="outline" className="rounded-none px-8 font-black uppercase tracking-widest border-primary text-primary">
                    <Link to="/tuitions">Return to Marketplace</Link>
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
                    <Link to="/tuitions" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group italic">
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
                        Back to Requirement Marketplace
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Visuals & Core Info */}
                    <div className="lg:col-span-8 space-y-10">
                        <header className="bg-background border border-border p-10 rounded-none relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-none -mr-24 -mt-24 rotate-45"></div>

                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-8">
                                    <Badge className="rounded-none bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                        CLASS_{tuition.class_name.toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className={`rounded-none border-border text-[9px] font-black uppercase tracking-widest px-3 py-1 ${
                                        tuition.status === 'approved' ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground'
                                    }`}>
                                        STATUS: {tuition.status.toUpperCase()}
                                    </Badge>
                                </div>

                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-10 uppercase italic leading-none">
                                    {tuition.subject}
                                </h1>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-border">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1">
                                            <Banknote size={10} className="text-primary" /> Budget / mo
                                        </span>
                                        <span className="text-2xl font-black text-primary tabular-nums italic">৳{tuition.salary}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1">
                                            <MapPin size={10} className="text-primary" /> Coordinates
                                        </span>
                                        <span className="text-lg font-black text-foreground uppercase tracking-tight">{tuition.location}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1">
                                            <Calendar size={10} className="text-primary" /> Intensity
                                        </span>
                                        <span className="text-lg font-black text-foreground uppercase tracking-tight">{tuition.days_per_week} DAYS_PER_WEEK</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Compact Image Gallery */}
                        <div className="grid grid-cols-3 gap-4 h-64">
                            <div className="col-span-2 relative group overflow-hidden border border-border">
                                <img
                                    src={tuition.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    alt="Education"
                                />
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="grid grid-rows-2 gap-4">
                                <div className="overflow-hidden border border-border group">
                                    <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Classroom" />
                                </div>
                                <div className="overflow-hidden border border-border group">
                                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Books" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section className="bg-muted/10 border border-border p-8 rounded-none">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8 flex items-center gap-3">
                                    <div className="w-1 h-4 bg-primary"></div>
                                    Node Requirements
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest border-b border-border pb-4">
                                        <span className="text-muted-foreground flex items-center gap-2"><User size={12} className="text-primary" /> Gender Preference</span>
                                        <span className="text-foreground italic">{tuition.gender || 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                                        <span className="text-muted-foreground flex items-center gap-2"><Clock size={12} className="text-primary" /> Operational Days</span>
                                        <div className="flex gap-1">
                                            {tuition.available_days?.slice(0, 3).map((day, idx) => (
                                                <Badge key={idx} variant="secondary" className="rounded-none bg-background border border-border text-[9px] font-black px-2 py-0.5">{day.slice(0, 3).toUpperCase()}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-muted/10 border border-border p-8 rounded-none">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8 flex items-center gap-3">
                                    <div className="w-1 h-4 bg-primary"></div>
                                    Strategic Context
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {tuition.description || "The client is looking for a professional who can deliver high-quality pedagogical support for the specified subject. Reliability and subject-matter expertise are the primary selection criteria for this position."}
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Sticky Action Profile */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-background border border-border p-10 rounded-none shadow-xl relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-none -rotate-12"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic tracking-tighter">Engagement Protocol</h3>
                                <p className="text-[10px] text-muted-foreground mb-10 leading-relaxed font-bold uppercase tracking-widest">
                                    Register your professional interest. Profile node will be transmitted to the client for immediate validation.
                                </p>

                                <div className="space-y-4">
                                    {!user ? (
                                        <Button asChild variant="secondary" className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] border border-border shadow-sm">
                                            <Link to="/login" className="flex items-center gap-2">
                                                Login to Apply
                                            </Link>
                                        </Button>
                                    ) : !dbUser ? (
                                        <Button disabled className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] opacity-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                                Synchronizing...
                                            </div>
                                        </Button>
                                    ) : dbUser?.role === 'tutor' && tuition.status === "approved" ? (
                                        <Dialog open={showModal} onOpenChange={setShowModal}>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    className="w-full h-16 rounded-none text-xs font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <Send size={18} /> Register Interest
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl rounded-none border-border p-0 gap-0 selection:bg-primary/30 selection:text-primary">
                                                <DialogHeader className="p-10 border-b border-border bg-muted/20">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <DialogTitle className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Professional Submission</DialogTitle>
                                                        <Badge variant="outline" className="rounded-none border-primary text-primary px-3 py-1 text-[9px] font-black">PROTOCOL: APP_01</Badge>
                                                    </div>
                                                    <DialogDescription className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                                        <Database size={12} className="text-primary" /> {tuition.subject} // {tuition.class_name.toUpperCase()}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                                                    <div className="space-y-8">
                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                                <Award size={14} className="text-primary" /> Professional Qualifications
                                                            </Label>
                                                            <Textarea
                                                                name="qualifications"
                                                                value={formData.qualifications}
                                                                onChange={handleChange}
                                                                className="min-h-[120px] rounded-none bg-muted/20 border-border font-medium focus-visible:ring-primary transition-all resize-none"
                                                                placeholder="DESCRIBE_ACADEMIC_CERTIFICATIONS..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                                <FileText size={14} className="text-primary" /> Specialized Experience
                                                            </Label>
                                                            <Textarea
                                                                name="experience"
                                                                value={formData.experience}
                                                                onChange={handleChange}
                                                                className="min-h-[120px] rounded-none bg-muted/20 border-border font-medium focus-visible:ring-primary transition-all resize-none"
                                                                placeholder="DESCRIBE_PREVIOUS_PEDAGOGICAL_RESULTS..."
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                                <Banknote size={14} className="text-primary" /> Expected Honorarium (BDT/mo)
                                                            </Label>
                                                            <div className="relative">
                                                                <Input
                                                                    type="number"
                                                                    name="expectedSalary"
                                                                    value={formData.expectedSalary}
                                                                    onChange={handleChange}
                                                                    className="h-14 rounded-none border-border bg-muted/20 font-black tabular-nums pl-10 focus-visible:ring-primary"
                                                                    placeholder={`MIN_THRESHOLD: ৳${tuition.salary}`}
                                                                    required
                                                                />
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">৳</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <DialogFooter className="flex flex-col sm:flex-row gap-4 pt-4">
                                                        <Button type="button" variant="ghost" className="flex-1 h-14 rounded-none text-[10px] font-black uppercase tracking-[0.2em]" onClick={() => setShowModal(false)}>
                                                            Abort Transmission
                                                        </Button>
                                                        <Button type="submit" className="flex-1 h-14 rounded-none text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2">
                                                            <Send size={16} /> Execute Submission
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="p-6 bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest leading-relaxed text-center">
                                            {dbUser?.role !== 'tutor' ? "Specialist validation required." : "Transmission channel closed."}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-10 pt-10 border-t border-border flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-foreground tracking-widest">Verified Client</p>
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Safe Engagement Guaranteed</p>
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
                            <h2 className="text-5xl font-black tracking-tighter text-foreground uppercase italic">Active Nodes.</h2>
                        </div>
                        <Button asChild variant="ghost" className="rounded-none font-black text-xs uppercase tracking-[0.2em] group h-auto p-0">
                            <Link to="/tuitions" className="flex items-center gap-2 italic">
                                Browse Marketplace <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border bg-border">
                        {demoTuitions
                            .filter(t => t._id !== id)
                            .slice(0, 3)
                            .map(item => (
                                <div key={item._id} className="bg-background border-r border-b border-border hover:bg-muted/30 transition-colors">
                                    <TuitionCard tuition={item} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuitionDetails;
