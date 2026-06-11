import { useState } from 'react';
import { Plus, X, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const PollCreator = ({ messageId, onCreated, onCancel }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [saving, setSaving] = useState(false);

    const addOption = () => {
        if (options.length >= 10) {
            toast.error('Maximum 10 options allowed');
            return;
        }
        setOptions(prev => [...prev, '']);
    };

    const removeOption = (index) => {
        if (options.length <= 2) {
            toast.error('Minimum 2 options required');
            return;
        }
        setOptions(prev => prev.filter((_, i) => i !== index));
    };

    const updateOption = (index, value) => {
        setOptions(prev => prev.map((opt, i) => i === index ? value : opt));
    };

    const handleSubmit = async () => {
        if (!question.trim()) {
            toast.error('Question is required');
            return;
        }
        const validOptions = options.filter(o => o.trim());
        if (validOptions.length < 2) {
            toast.error('At least 2 options are required');
            return;
        }
        if (!messageId) {
            toast.error('Message ID is required');
            return;
        }

        setSaving(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/messages/polls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question: question.trim(),
                    options: validOptions,
                    messageId,
                    isAnonymous,
                    allowMultipleSelection: allowMultiple,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create poll');
            }

            const poll = await res.json();
            toast.success('Poll created');
            onCreated?.(poll);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to create poll');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 border border-border rounded-2xl bg-card space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary" />
                    <span className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">
                        Create Poll
                    </span>
                </div>
                <button
                    onClick={onCancel}
                    className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Question */}
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                autoFocus
            />

            {/* Options */}
            <div className="space-y-2">
                {options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5 text-center font-mono">{index + 1}</span>
                        <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        {options.length > 2 && (
                            <button
                                onClick={() => removeOption(index)}
                                className="size-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {options.length < 10 && (
                <button
                    onClick={addOption}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                    <Plus size={12} />
                    Add option
                </button>
            )}

            {/* Settings */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="size-3.5 rounded border-border"
                    />
                    Anonymous
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allowMultiple}
                        onChange={(e) => setAllowMultiple(e.target.checked)}
                        className="size-3.5 rounded border-border"
                    />
                    Multiple selection
                </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={saving}>
                    {saving ? <Loader2 size={12} className="mr-1.5 animate-spin" /> : <BarChart3 size={12} className="mr-1.5" />}
                    {saving ? 'Creating...' : 'Create Poll'}
                </Button>
            </div>
        </div>
    );
};

export default PollCreator;
