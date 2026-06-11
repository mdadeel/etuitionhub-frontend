import { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const ConnectionPrivacySettings = ({ connectionId, onClose }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get(`/api/connections/${connectionId}/privacy`);
                setSettings(res.data.privacySettings || {});
            } catch (error) {
                console.error('Failed to fetch privacy settings', error);
                toast.error('Could not load privacy settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [connectionId]);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch(`/api/connections/${connectionId}/privacy`, { privacySettings: settings });
            toast.success('Privacy settings updated');
            onClose?.();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update privacy settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="animate-spin text-primary" />
            </div>
        );
    }

    const toggles = [
        { key: 'contactInfo', label: 'Contact Information', description: 'Allow the other party to see your email and phone' },
        { key: 'sessionHistory', label: 'Session History', description: 'Allow the other party to see your session records' },
        { key: 'paymentHistory', label: 'Payment History', description: 'Allow the other party to see payment details' },
        { key: 'exactLocation', label: 'Exact Location', description: 'Allow the other party to see your precise location' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings size={14} className="text-muted-foreground" />
                    <span className="text-xs font-label font-semibold uppercase tracking-wider text-muted-foreground">
                        Privacy Settings
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {toggles.map(({ key, label, description }) => (
                    <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
                    >
                        <div className="min-w-0 mr-4">
                            <p className="text-sm font-semibold text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                        <button
                            onClick={() => handleToggle(key)}
                            className={cn(
                                "flex-shrink-0 size-10 rounded-xl flex items-center justify-center transition-all border",
                                settings[key]
                                    ? "bg-primary/10 border-primary/20 text-primary"
                                    : "bg-muted border-border text-muted-foreground"
                            )}
                        >
                            {settings[key] ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 pt-2">
                <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1"
                >
                    {saving ? (
                        <>
                            <Loader2 size={14} className="mr-1.5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Settings'
                    )}
                </Button>
                {onClose && (
                    <Button size="sm" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ConnectionPrivacySettings;
