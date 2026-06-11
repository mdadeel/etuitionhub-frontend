import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, User } from 'lucide-react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const SessionConfirmationList = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(null);
    const [disputeReason, setDisputeReason] = useState('');
    const [showDisputeFor, setShowDisputeFor] = useState(null);

    const fetchSessions = useCallback(async () => {
        try {
            const res = await api.get('/api/sessions', { params: { status: 'scheduled', limit: 50 } });
            const pendingSessions = (res.data || []).filter(s => s.studentStatus === 'pending');
            setSessions(pendingSessions);
        } catch (error) {
            console.error('Failed to fetch sessions', error);
            toast.error('Could not load sessions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const [now, setNow] = useState(() => Date.now());

    // Update time every minute
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    const getTimeInfo = (createdAt) => {
        const created = new Date(createdAt).getTime();
        const hoursElapsed = (now - created) / (1000 * 60 * 60);
        const hoursRemaining = 24 - hoursElapsed;
        if (hoursRemaining <= 0) return { text: 'Expired', expired: true };
        const h = Math.floor(hoursRemaining);
        const m = Math.floor((hoursRemaining - h) * 60);
        return { text: `${h}h ${m}m remaining`, expired: false };
    };

    const handleConfirm = async (sessionId) => {
        setActing(sessionId);
        try {
            await api.patch(`/api/sessions/${sessionId}/confirm`);
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            toast.success('Session confirmed');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to confirm session');
        } finally {
            setActing(null);
        }
    };

    const handleDispute = async (sessionId) => {
        setActing(sessionId);
        try {
            await api.patch(`/api/sessions/${sessionId}/dispute`, { reason: disputeReason });
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            setDisputeReason('');
            setShowDisputeFor(null);
            toast.success('Session disputed');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to dispute session');
        } finally {
            setActing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Card className="p-6 md:p-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Session Confirmations</h2>
                    <p className="text-sm text-muted-foreground mt-1">Review and confirm sessions logged by your tutors.</p>
                </div>
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Clock size={24} />
                </div>
            </div>

            {sessions.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-background rounded-2xl border border-border">
                    <CheckCircle size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-foreground">No pending sessions</p>
                    <p className="text-xs mt-1">All caught up! Sessions logged by tutors will appear here for confirmation.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map(session => {
                        const timeInfo = getTimeInfo(session.createdAt);
                        const tutor = session.tutorId;
                        const isActing = acting === session._id;
                        const isDisputing = showDisputeFor === session._id;

                        return (
                            <div
                                key={session._id}
                                className={cn(
                                    "p-5 border rounded-2xl transition-all",
                                    timeInfo.expired
                                        ? "bg-muted border-border opacity-70"
                                        : "bg-card border-border"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                            {tutor?.photoURL ? (
                                                <img src={tutor.photoURL} alt="" className="size-full object-cover rounded-full" />
                                            ) : (
                                                <User size={16} className="text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {tutor?.displayName || 'Tutor'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {session.topic || 'Tutoring Session'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!timeInfo.expired && (
                                            <span className="text-[10px] font-label font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1">
                                                <AlertTriangle size={10} />
                                                {timeInfo.text}
                                            </span>
                                        )}
                                        {timeInfo.expired && (
                                            <span className="text-[10px] font-label font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                                Auto-confirmed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-xs text-muted-foreground mb-4 space-y-1">
                                    {session.scheduledAt && (
                                        <p>Scheduled: {new Date(session.scheduledAt).toLocaleString()}</p>
                                    )}
                                    {session.durationMinutes && (
                                        <p>Duration: {session.durationMinutes} minutes</p>
                                    )}
                                    {session.topicsCovered && (
                                        <p>Topics: {session.topicsCovered}</p>
                                    )}
                                </div>

                                {!timeInfo.expired && (
                                    <>
                                        {isDisputing ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={disputeReason}
                                                    onChange={(e) => setDisputeReason(e.target.value)}
                                                    placeholder="Reason for dispute (optional)..."
                                                    className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleDispute(session._id)}
                                                        disabled={isActing}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        {isActing ? 'Submitting...' : 'Submit Dispute'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => { setShowDisputeFor(null); setDisputeReason(''); }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleConfirm(session._id)}
                                                    disabled={isActing}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                >
                                                    <CheckCircle size={14} className="mr-1.5" />
                                                    {isActing ? 'Confirming...' : 'Confirm Session'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowDisputeFor(session._id)}
                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    <XCircle size={14} className="mr-1.5" />
                                                    Dispute
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default SessionConfirmationList;
