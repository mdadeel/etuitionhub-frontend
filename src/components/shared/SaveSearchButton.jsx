import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const emptyFilters = {};

const SaveSearchButton = ({ query, filters = emptyFilters }) => {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!query) return;
        setSaving(true);
        try {
            await api.post('/api/search-alerts', { query, filters });
            toast.success('Search alert saved! We\'ll notify you when new results appear.');
        } catch (err) {
            if (err.response?.status === 409) {
                toast('Alert already exists', { icon: '🔔' });
            } else {
                toast.error('Failed to save alert');
            }
        } finally {
            setSaving(false);
        }
    };

    if (!query) return null;

    return (
        <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground border border-border hover:bg-background transition-colors disabled:opacity-50"
            title="Get notified when new results match this search"
        >
            {saving ? (
                <span className="size-3 border border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : (
                <Bell size={12} />
            )}
            Save Search
        </button>
    );
};

export default SaveSearchButton;
