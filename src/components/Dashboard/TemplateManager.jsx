import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, FileText, Loader2, X, Save } from 'lucide-react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';

const TemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', category: 'general', isPublic: false });
    const [saving, setSaving] = useState(false);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/api/templates');
            setTemplates(res.data?.templates || res.data || []);
        } catch (error) {
            console.error('Failed to fetch templates', error);
            toast.error('Could not load templates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleCreate = async () => {
        if (!form.title || !form.content) {
            toast.error('Title and content are required');
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/api/templates', form);
            setTemplates(prev => [res.data, ...prev]);
            toast.success('Template created');
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to create template');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!form.title || !form.content) {
            toast.error('Title and content are required');
            return;
        }
        setSaving(true);
        try {
            const res = await api.put(`/api/templates/${editing._id}`, form);
            setTemplates(prev => prev.map(t => t._id === editing._id ? res.data : t));
            toast.success('Template updated');
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to update template');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this template?')) return;
        try {
            await api.delete(`/api/templates/${id}`);
            setTemplates(prev => prev.filter(t => t._id !== id));
            toast.success('Template deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete template');
        }
    };

    const resetForm = () => {
        setForm({ title: '', content: '', category: 'general', isPublic: false });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (template) => {
        setForm({
            title: template.title,
            content: template.content,
            category: template.category || 'general',
            isPublic: template.isPublic || false,
        });
        setEditing(template);
        setShowForm(true);
    };

    if (loading) {
        return (
            <CardSkeleton className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40 rounded-lg" />
                        <Skeleton className="h-3 w-48 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-8 rounded-lg shrink-0" />
                                <div className="space-y-1.5">
                                    <LineSkeleton width="32" className="h-4" />
                                    <LineSkeleton width="48" className="h-3" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="size-8 rounded-lg" />
                                <Skeleton className="size-8 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardSkeleton>
        );
    }

    return (
        <Card className="p-6 md:p-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Message Templates</h2>
                    <p className="text-sm text-muted-foreground mt-1">Create and manage reusable message templates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        size="sm"
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className={cn(
                            "text-xs font-heading font-bold uppercase tracking-wider",
                            showForm ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                        )}
                    >
                        {showForm ? <X size={12} className="mr-1.5" /> : <Plus size={12} className="mr-1.5" />}
                        {showForm ? 'Cancel' : 'New Template'}
                    </Button>
                </div>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <div className="mb-6 p-5 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
                    <p className="text-xs font-label font-semibold uppercase tracking-wider text-primary">
                        {editing ? 'Edit Template' : 'New Template'}
                    </p>

                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Template title"
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />

                    <textarea
                        value={form.content}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Template content..."
                        rows={5}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                            >
                                <option value="general">General</option>
                                <option value="session">Session</option>
                                <option value="payment">Payment</option>
                                <option value="follow-up">Follow-up</option>
                                <option value="welcome">Welcome</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={form.isPublic}
                                onChange={(e) => setForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                                className="size-4 rounded border-border"
                            />
                            <label htmlFor="isPublic" className="text-sm text-muted-foreground">Public</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={editing ? handleUpdate : handleCreate} disabled={saving}>
                            {saving ? <Loader2 size={12} className="mr-1.5 animate-spin" /> : <Save size={12} className="mr-1.5" />}
                            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Template List */}
            {templates.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-background rounded-lg border border-border">
                    <FileText size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium text-foreground">No templates yet</p>
                    <p className="text-xs mt-1">Create your first template to reuse messages quickly.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {templates.map(template => (
                        <div
                            key={template._id}
                            className="p-5 border border-border rounded-lg bg-card hover:border-primary/20 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-foreground">{template.title}</h3>
                                    <span className="text-[10px] font-label text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                                        {template.category}
                                    </span>
                                    {template.isPublic && (
                                        <span className="text-[10px] font-label text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                                            Public
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(template)}
                                        className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template._id)}
                                        className="size-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                                {template.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TemplateManager;
