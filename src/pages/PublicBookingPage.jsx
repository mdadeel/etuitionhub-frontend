import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Calendar, Clock, ChevronLeft, Send, Loader2, User, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SEO from '@/components/shared/SEO';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { groupAvailability, sortByDayOfWeek, formatSlotLabel } from '@/lib/slotBooking';

const PublicBookingPage = () => {
    const { tutorId } = useParams();
    const { user } = useAuth();

    const [tutor, setTutor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const fetchData = useCallback(async () => {
        if (!tutorId) return;
        setLoading(true);
        setError(null);
        try {
            const [tutorRes, availRes] = await Promise.all([
                api.get(`/api/tutors/${tutorId}`),
                api.get(`/api/tutors/${tutorId}/availability`),
            ]);

            setTutor(tutorRes.data);
            const groups = groupAvailability(
                Array.isArray(availRes.data) ? availRes.data
                    : Array.isArray(availRes.data?.$values)
                        ? availRes.data.$values
                        : []
            );
            setAvailability(sortByDayOfWeek(groups));
        } catch (err) {
            setError(err.response?.data?.error || 'Could not load tutor availability');
        } finally {
            setLoading(false);
        }
    }, [tutorId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async () => {
        if (!selectedSlot) return;
        if (!message.trim()) { toast.error('Please introduce yourself'); return; }

        setSubmitting(true);
        try {
            await api.post('/api/hire-requests', {
                toUserId: tutorId,
                message: message.trim(),
                preferredSlot: formatSlotLabel(selectedSlot.slot),
                proposedRate: tutor?.expectedSalary || undefined,
            });
            setSuccess(true);
            toast.success('Booking request sent!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12 px-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Skeleton className="h-6 w-48 rounded-lg" />
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="size-14 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40 rounded-lg" />
                                <Skeleton className="h-4 w-56 rounded-lg" />
                            </div>
                        </div>
                        <div className="h-48 rounded-lg bg-muted animate-pulse" />
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !tutor) {
        return (
            <div className="min-h-screen bg-background py-12 px-4">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                    <Calendar className="size-12 text-muted-foreground/40 mx-auto" strokeWidth={1} />
                    <h2 className="text-lg font-heading font-bold text-foreground">Tutor not found</h2>
                    <p className="text-sm text-muted-foreground">{error || 'This tutor does not exist or has no availability.'}</p>
                    <Button variant="outline" asChild><Link to="/tutors">Browse Tutors</Link></Button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background py-12 px-4">
                <div className="max-w-lg mx-auto text-center space-y-5">
                    <div className="size-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="size-8" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">Request Sent!</h1>
                    <p className="text-sm text-muted-foreground">
                        Your booking request has been sent to {tutor.displayName || 'the tutor'}.
                        They will review it and respond within 48 hours.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                        {user ? (
                            <Button variant="outline" asChild><Link to="/dashboard/requests">View My Requests</Link></Button>
                        ) : (
                            <Button variant="outline" asChild><Link to="/register">Create Account to Track</Link></Button>
                        )}
                        <Button variant="outline" asChild><Link to={`/tutor/${tutorId}`}>View Tutor Profile</Link></Button>
                    </div>
                </div>
            </div>
        );
    }

    const groups = availability;

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <SEO title={`Book a slot with ${tutor.displayName || 'the tutor'}`} description={`Book a tutoring session with ${tutor.displayName || ''}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back link */}
                <Link
                    to={`/tutor/${tutorId}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="size-3" />
                    Back to profile
                </Link>

                <h1 className="text-xl font-heading font-bold text-foreground">
                    Book a Session
                </h1>

                {/* Tutor header */}
                <Card className="p-5" hover={false}>
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={tutor.photoURL}
                            alt={tutor.displayName}
                            size="lg"
                            className="size-14 rounded-xl ring-2 ring-border"
                        />
                        <div className="min-w-0">
                            <h2 className="text-lg font-heading font-bold text-foreground truncate">
                                {tutor.displayName || 'Tutor'}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {tutor.location || ''}{tutor.expectedSalary ? ` • ৳${tutor.expectedSalary.toLocaleString()}/mo` : ''}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Slot selection */}
                <Card className="p-5" hover={false}>
                    <h2 className="text-sm font-semibold text-foreground mb-1">Select a time slot</h2>
                    <p className="text-xs text-muted-foreground mb-4">Choose a day and time that works for you.</p>

                    {groups.length === 0 ? (
                        <div className="py-10 text-center">
                            <Calendar className="size-8 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
                            <p className="text-sm text-muted-foreground">This tutor hasn't set their availability yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {groups.map((group) => (
                                <div key={group.dayOfWeek}>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                        {group.dayLabel}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.slots.map((slot) => {
                                            const isSelected =
                                                selectedSlot?.dayOfWeek === group.dayOfWeek &&
                                                selectedSlot?.slot?.startTime === slot.startTime &&
                                                selectedSlot?.slot?.endTime === slot.endTime;
                                            return (
                                                <button
                                                    key={slot.key}
                                                    type="button"
                                                    onClick={() => setSelectedSlot({ dayOfWeek: group.dayOfWeek, slot })}
                                                    className={`
                                                        px-4 py-2.5 text-xs font-medium rounded-lg border transition-all active:scale-[0.98]
                                                        ${isSelected
                                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                            : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
                                                        }
                                                    `}
                                                >
                                                    <Clock className="size-3 inline mr-1.5" />
                                                    {slot.startTime} – {slot.endTime}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Message + submit */}
                {selectedSlot && (
                    <Card className="p-5" hover={false}>
                        <h2 className="text-sm font-semibold text-foreground mb-1">Introduce yourself</h2>
                        <p className="text-xs text-muted-foreground mb-3">
                            You are requesting <strong>{formatSlotLabel(selectedSlot.slot)}</strong>.
                            Tell the tutor a bit about what you need.
                        </p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Hi, I'd like to book this slot for...`}
                            maxLength={500}
                            rows={3}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                        <p className="text-[11px] text-muted-foreground text-right mt-1">{message.length}/500</p>

                        {!user && (
                            <p className="text-xs text-warning mt-2 flex items-center gap-1">
                                <User className="size-3" />
                                You will need to log in after sending to track your request.
                            </p>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || !message.trim()}
                            className="mt-4 w-full"
                        >
                            {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
                            {submitting ? 'Sending...' : 'Send Booking Request'}
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PublicBookingPage;