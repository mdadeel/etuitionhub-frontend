import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, GraduationCap, BookOpen, MapPin, DollarSign } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-500">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Post a tuition requirement</h1>
                    <p className="text-slate-600">Fill in your academic needs and we'll match you with suitable tutors</p>
                </div>

                {!user ? (
                    <div className="bg-white border border-slate-200 p-8 rounded-xl text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap size={28} className="text-slate-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Login required</h2>
                        <p className="text-slate-600 mb-6">You need to be logged in to post a tuition request</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                to="/login"
                                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Subject *</Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Higher Mathematics"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Class Level *</Label>
                                <select
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                    required
                                >
                                    <option value="">Select class</option>
                                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'SSC', 'HSC 1st Year', 'HSC 2nd Year'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Monthly Budget (BDT) *</Label>
                                <Input
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    type="number"
                                    placeholder="5000"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Curriculum *</Label>
                                <select
                                    value={medium}
                                    onChange={(e) => setMedium(e.target.value)}
                                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                    required
                                >
                                    <option value="">Select medium</option>
                                    {['Bangla Medium', 'English Medium', 'Cambridge', 'IB'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Location *</Label>
                            <Textarea
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Full address (area, street, house number)..."
                                className="min-h-[100px] resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 h-11"
                            >
                                {submitting ? 'Posting...' : 'Post Tuition'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="h-11 px-5"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostTuition;