import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, Database, GraduationCap, BookOpen, MapPin, DollarSign } from "lucide-react";

const PostTuition = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [subject, setSubject] = useState('');
    const [className, setClassName] = useState('');
    const [salary, setSalary] = useState('');
    const [medium, setMedium] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to post a tuition');
            navigate('/login');
            return;
        }

        if (!subject || !className || !salary || !medium || !location) {
            toast.error('All fields are required');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/api/tuitions', {
                subject,
                class_name: className,
                salary: parseInt(salary),
                medium,
                location,
                student_email: user.email,
                status: 'pending'
            });
            toast.success('Tuition posted successfully!');
            navigate('/tuitions');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to post tuition');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <header className="mb-16 border-b border-border pb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-1 bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Tuition Posting Interface</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] mb-8">
                        Post a <br />
                        <span className="text-muted-foreground">Tuition.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground font-bold leading-relaxed max-w-2xl uppercase tracking-tight">
                        Define your academic requirements and connect with qualified tutors in your area.
                    </p>
                </header>

                {!user ? (
                    <div className="bg-muted/30 border border-border p-12 text-center relative">
                        <Database size={48} className="mx-auto mb-6 text-primary opacity-30" />
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-4">Authentication Required</h2>
                        <p className="text-sm text-muted-foreground font-medium mb-8 uppercase tracking-wide">
                            You must be logged in to post a tuition request.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button asChild variant="outline" className="rounded-none h-12 px-8 text-xs font-black uppercase tracking-widest">
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="rounded-none h-12 px-8 text-xs font-black uppercase tracking-widest">
                                <Link to="/register">Create Account</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-background border border-border relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Database size={100} className="text-foreground" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <BookOpen size={12} className="text-primary" /> Subject *
                                </Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Higher Mathematics"
                                    className="h-12 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <GraduationCap size={12} className="text-primary" /> Class Level *
                                </Label>
                                <select
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    className="h-12 w-full rounded-none border border-border bg-muted/20 font-bold text-sm px-3 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2"
                                    required
                                >
                                    <option value="">Select class</option>
                                    {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'HSC'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <DollarSign size={12} className="text-primary" /> Monthly Budget (BDT) *
                                </Label>
                                <Input
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    type="number"
                                    placeholder="5000"
                                    className="h-12 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <BookOpen size={12} className="text-primary" /> Curriculum *
                                </Label>
                                <select
                                    value={medium}
                                    onChange={(e) => setMedium(e.target.value)}
                                    className="h-12 w-full rounded-none border border-border bg-muted/20 font-bold text-sm px-3 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2"
                                    required
                                >
                                    <option value="">Select medium</option>
                                    {['Bangla Medium', 'English Medium'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <MapPin size={12} className="text-primary" /> Location Details *
                            </Label>
                            <Textarea
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Full address for tutor reference..."
                                className="min-h-[120px] rounded-none border-border bg-muted/20 font-medium focus-visible:ring-primary resize-none p-5 text-sm"
                                required
                            />
                        </div>

                        <div className="pt-4 relative z-10 flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 h-14 rounded-none text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg"
                            >
                                {submitting ? (
                                    <>Publishing...</>
                                ) : (
                                    <>Post Tuition <Send size={18} /></>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="h-14 rounded-none text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3"
                            >
                                <ArrowLeft size={18} /> Back
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostTuition;
