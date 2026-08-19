import React, { useState, useEffect } from 'react';
import { CircleHelp, Check, X, SendHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PollDisplay = ({ 
    pollId, 
    onClose, 
    onUpdate 
}) => {
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [myVote, setMyVote] = useState(null);
    const [voteSubmitting, setVoteSubmitting] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pollId]);

    const fetchPoll = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/messages/polls/${pollId}`);
            setPoll(res.data);
            
            // Determine current user's vote
            if (res.data.reactions) {
                // eslint-disable-next-line no-unused-vars
                const reactions = Object.fromEntries(Object.entries(res.data.reactions).map(([k, v]) => [Number(k), v]));
                // In a real implementation, we would track individual votes
                // For now, we'll just show if the user has reacted (simplified)
            }
        } catch (err) {
            console.error('Error fetching poll:', err);
            setError('Failed to load poll');
            toast.error('Failed to load poll');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionIndex) => {
        if (voteSubmitting || !poll) return;
        
        try {
            setVoteSubmitting(true);
            // In a real implementation, we would send the specific option index
            // For now, we'll simulate voting
            // eslint-disable-next-line no-unused-vars
            const res = await api.patch(`/api/messages/polls/${pollId}/vote`, {
                selectedOptions: [optionIndex]
            });
            
            // Update local state
            setPoll(prev => {
                if (!prev) return prev;
                const updatedOptions = [...prev.options];
                updatedOptions[optionIndex].voteCount += 1;
                return { ...prev, options: updatedOptions };
            });
            
            // Notify parent of update
            onUpdate && onUpdate({ ...poll, options: [...poll.options] });
            
        } catch (err) {
            console.error('Error voting on poll:', err);
            setError('Failed to vote');
            toast.error('Failed to vote');
        } finally {
            setVoteSubmitting(false);
        }
    };

    const handleClosePoll = async () => {
        if (!poll) return;
        
        try {
            const res = await api.patch(`/api/messages/polls/${pollId}/close`);
            setPoll(res.data);
            onUpdate && onUpdate(res.data);
            toast.success('Poll closed');
        } catch (err) {
            console.error('Error closing poll:', err);
            setError('Failed to close poll');
            toast.error('Failed to close poll');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="text-center py-4">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground">Loading poll...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-primary">
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-bold text-foreground">Poll</h3>
                        </div>
                        <div className="text-center py-6">
                            <CircleHelp size={36} className="text-destructive" />
                            <p className="text-muted-foreground">{error?.message || error}</p>
                            <button 
                                onClick={onClose} 
                                className="mt-4 w-full px-4 py-2 bg-destructive text-destructive/foreground hover:bg-destructive/20 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="text-center py-6">
                        <p className="text-muted-foreground">Poll not found</p>
                        <button 
                            onClick={onClose} 
                            className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate total votes
    const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Poll</h3>
                            <p className="text-muted-foreground">{totalVotes} votes</p>
                        </div>
                        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-primary">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Question */}
                    <div className="mb-4">
                        <p className="text-lg font-medium text-foreground">{poll.question}</p>
                    </div>
                    
                    {/* Options */}
                    <div className="space-y-3">
                        {poll.options.map((option, index) => {
                            const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                            return (
                                <div key={index} className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleVote(index)}
                                        disabled={voteSubmitting}
                                        className={cn(
                                            "flex-1 items-center justify-start px-3 py-2 rounded-lg border border-border/200 hover:bg-muted/50 transition-colors",
                                            voteSubmitting && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <span className="text-sm text-foreground">{option.text}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium">
                                            <span className="text-muted-foreground">{option.voteCount}</span>
                                            <span className="text-muted-foreground">votes</span>
                                        </div>
                                    </button>
                                    <div className="w-3 bg-primary rounded-full" 
                                        style={{ height: `${percentage}%` }}></div>
                                    <span className="text-xs text-muted-foreground ml-2">{percentage.toFixed(1)}%</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        {/* Close Poll Button (only for creator) */}
                        {/* In a real app, we would check if current user is the creator */}
                        <button
                            onClick={handleClosePoll}
                            className="px-3 py-2 text-sm font-medium bg-destructive text-destructive/foreground hover:bg-destructive/20 rounded-lg"
                        >
                            Close Poll
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollDisplay;
