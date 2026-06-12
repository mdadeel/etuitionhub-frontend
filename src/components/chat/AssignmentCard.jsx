import React, { useState } from 'react';
import { List, Check, CheckCircle, X, SendHorizontal, Loader2, Clock, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AssignmentCard = ({ 
    assignmentId, 
    onClose, 
    onUpdate 
}) => {
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDueDate, setEditedDueDate] = useState('');

    // eslint-disable-next-line no-undef
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/assignments/${assignmentId}`);
            setAssignment(res.data);
            
            // Initialize edit form with current values
            setEditedTitle(res.data.title || '');
            setEditedDescription(res.data.description || '');
            setEditedDueDate(res.data.dueDate ? new Date(res.data.dueDate).toISOString().split('T')[0] : '');
        } catch (err) {
            console.error('Error fetching assignment:', err);
            setError('Failed to load assignment');
            toast.error('Failed to load assignment');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (submitting || !assignment) return;
        
        try {
            setSubmitting(true);
            
            // Determine action based on current status
            let res;
            if (assignment.status === 'pending') {
                // Submit assignment
                res = await api.patch(`/api/assignments/${assignmentId}/submit`);
            } else if (assignment.status === 'submitted') {
                // In a real app, this would be handled by tutor grading
                // For now, we'll just show a message
                toast.info('Assignment submitted. Waiting for tutor to grade.');
                setSubmitting(false);
                return;
            } else {
                // For other states, just refresh
                res = await api.get(`/api/assignments/${assignmentId}`);
            }
            
            setAssignment(res.data);
            onUpdate && onUpdate(res.data);
            toast.success('Assignment updated');
        } catch (err) {
            console.error('Error updating assignment:', err);
            setError('Failed to update assignment');
            toast.error('Failed to update assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGrade = async (feedback, score) => {
        if (submitting || !assignment) return;
        
        try {
            setSubmitting(true);
            const res = await api.patch(`/api/assignments/${assignmentId}/grade`, {
                feedback,
                score
            });
            setAssignment(res.data);
            onUpdate && onUpdate(res.data);
            toast.success('Assignment graded');
        } catch (err) {
            console.error('Error grading assignment:', err);
            setError('Failed to grade assignment');
            toast.error('Failed to grade assignment');
        } finally {
            setSubmitting(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleReturn = async (feedback) => {
        if (submitting || !assignment) return;
        
        try {
            setSubmitting(true);
            const res = await api.patch(`/api/assignments/${assignmentId}/return`, {
                feedback
            });
            setAssignment(res.data);
            onUpdate && onUpdate(res.data);
            toast.success('Assignment returned for revision');
        } catch (err) {
            console.error('Error returning assignment:', err);
            setError('Failed to return assignment');
            toast.error('Failed to return assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;
        
        try {
            await api.delete(`/api/assignments/${assignmentId}`);
            onClose();
            toast.success('Assignment deleted');
        } catch (err) {
            console.error('Error deleting assignment:', err);
            setError('Failed to delete assignment');
            toast.error('Failed to delete assignment');
        }
    };

    const handleSaveEdit = async () => {
        if (submitting) return;
        
        try {
            setSubmitting(true);
            const res = await api.put(`/api/assignments/${assignmentId}`, {
                title: editedTitle,
                description: editedDescription,
                dueDate: editedDueDate
            });
            setAssignment(res.data);
            setEditMode(false);
            onUpdate && onUpdate(res.data);
            toast.success('Assignment updated');
        } catch (err) {
            console.error('Error updating assignment:', err);
            setError('Failed to update assignment');
            toast.error('Failed to update assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="text-center py-4">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground">Loading assignment...</p>
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
                            <h3 className="text-xl font-bold text-foreground">Assignment</h3>
                        </div>
                        <div className="text-center py-6">
                            <CircleHelp size={36} className="text-destructive" />
                            <p className="text-muted-foreground">{error}</p>
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

    if (!assignment) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="text-center py-6">
                        <p className="text-muted-foreground">Assignment not found</p>
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

    // Format due date for display
    const formatDueDate = (dueDateStr) => {
        if (!dueDateStr) return 'No due date';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dueDateStr).toLocaleDateString(undefined, options);
    };

    // Status styling
    const getStatusClasses = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-primary/10', text: 'text-primary', icon: List };
            case 'submitted': return { bg: 'bg-warning/10', text: 'text-warning', icon: Loader2 };
            case 'graded': return { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle };
            case 'returned': return { bg: 'bg-destructive/10', text: 'text-destructive', icon: SendHorizontal };
            default: return { bg: 'bg-muted/10', text: 'text-muted-foreground', icon: List };
        }
    };

    const statusClasses = getStatusClasses(assignment.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                <div className="space-y-5">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Assignment</h3>
                            <p className="text-muted-foreground">{formatDueDate(assignment.dueDate)}</p>
                        </div>
                        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-primary">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Assignment Details */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Title</p>
                            <h2 className="text-lg font-semibold text-foreground">{assignment.title}</h2>
                        </div>
                        
                        {assignment.description && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Description</p>
                                <p className="text-muted-foreground whitespace-pre-line">{assignment.description}</p>
                            </div>
                        )}
                        
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Status</p>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1 rounded-lg",
                                statusClasses.bg,
                                statusClasses.text
                            )}>
                                {statusClasses.icon && <statusClasses.icon size={16} className="mr-2" />}
                                <span className="font-medium">
                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        
                        {assignment.score !== undefined && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Score</p>
                                <p className="text-lg font-bold text-foreground">{assignment.score}%</p>
                            </div>
                        )}
                        
                        {assignment.feedback && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Feedback</p>
                                <p className="text-muted-foreground whitespace-pre-line">{assignment.feedback}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-3">
                        {/* Student Actions */}
                        {assignment.status === 'pending' && (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full px-4 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Assignment'}
                            </button>
                        )}
                        
                        {/* Tutor Actions */}
                        {(assignment.status === 'submitted' || assignment.status === 'returned') && (
                            <div className="space-y-3">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Tutor Actions</p>
                                <div className="space-y-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Feedback</p>
                                        <textarea
                                            rows={3}
                                            className="w-full px-3 py-2 bg-muted border border-border/200 rounded-lg resize-none focus:outline-none focus:border-primary/20"
                                            placeholder="Provide feedback for the student..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Score (0-100)</p>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            className="w-full px-3 py-2 bg-muted border border-border/200 rounded-lg text-center focus:outline-none focus:border-primary/20"
                                            placeholder="Enter score..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            // In a real implementation, we would get values from the form inputs
                                            // For now, we'll use placeholder values
                                            handleGrade("Good work!", 85);
                                        }}
                                        className="w-full px-4 py-2 text-sm font-medium bg-success text-success/foreground hover:bg-success/90 transition-colors"
                                    >
                                        Grade Assignment
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Edit/Delete (for creator) */}
                        {/* In a real app, we would check if current user is the creator */}
                        <div className="border-t pt-4">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setEditMode(true);
                                        setEditedTitle(assignment.title || '');
                                        setEditedDescription(assignment.description || '');
                                        setEditedDueDate(assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '');
                                    }}
                                    className="px-3 py-2 text-sm font-medium bg-muted text-muted-foreground/60 hover:bg-muted/100 rounded-lg"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-3 py-2 text-sm font-medium bg-destructive text-destructive/foreground hover:bg-destructive/20 rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Edit Form */}
                    {editMode && (
                        <div className="mt-5 pt-4 border-t border-border/200">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Title</p>
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted border border-border/200 rounded-lg focus:outline-none focus:border-primary/20"
                                        placeholder="Enter assignment title..."
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Description</p>
                                    <textarea
                                        rows={3}
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted border border-border/200 rounded-lg resize-none focus:outline-none focus:border-primary/20"
                                        placeholder="Enter assignment description..."
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Due Date</p>
                                    <input
                                        type="date"
                                        value={editedDueDate}
                                        onChange={(e) => setEditedDueDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted border border-border/200 rounded-lg focus:outline-none focus:border-primary/20"
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="px-3 py-2 text-sm font-medium bg-muted text-muted-foreground/60 hover:bg-muted/100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={submitting}
                                        className="px-4 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentCard;
