import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AppleButton, AppleInput } from '../shared/AppleUI';
import { Save, RefreshCw, Info, Globe, Phone, Banknote, Layout } from 'lucide-react';

const DashSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modifiedKeys, setModifiedKeys] = useState(new Set());

    const loadSettings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/settings');
            setSettings(res.data || []);
            setModifiedKeys(new Set());
        } catch {
            toast.error('Failed to load system configurations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const handleInputChange = (key, value) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
        setModifiedKeys(prev => new Set(prev).add(key));
    };

    const handleSave = async () => {
        if (modifiedKeys.size === 0) {
            toast.error('No changes detected');
            return;
        }

        setIsSaving(true);
        const settingsToUpdate = settings
            .filter(s => modifiedKeys.has(s.key))
            .map(s => ({ key: s.key, value: s.value }));

        try {
            await api.patch('/api/settings/bulk', { settings: settingsToUpdate });
            toast.success('System parameters updated successfully');
            setModifiedKeys(new Set());
        } catch {
            toast.error('Strategic update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const groupedSettings = settings.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
    }, {});

    const categoryIcons = {
        general: <Globe size={16} className="text-primary" />,
        contact: <Phone size={16} className="text-primary" />,
        financial: <Banknote size={16} className="text-primary" />,
        appearance: <Layout size={16} className="text-primary" />
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        Global Configurations
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        Environment variables and platform constraints
                    </p>
                </div>

                <div className="flex gap-3">
                    <AppleButton 
                        variant="ghost" 
                        size="sm" 
                        onClick={loadSettings}
                        className="h-10 px-4 rounded-xl"
                    >
                        <RefreshCw size={14} className="mr-2" /> Reset
                    </AppleButton>
                    <AppleButton 
                        variant="primary" 
                        size="sm" 
                        onClick={handleSave}
                        isLoading={isSaving}
                        className="h-10 px-6 rounded-xl shadow-apple-sm"
                    >
                        <Save size={14} className="mr-2" /> Deploy Changes
                    </AppleButton>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(groupedSettings).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 px-1">
                            {categoryIcons[category]} {category} Parameters
                        </h3>
                        
                        <div className="bg-muted/20 border border-border/50 rounded-3xl p-6 space-y-6 backdrop-blur-sm">
                            {items.map(setting => (
                                <div key={setting.key} className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                                            {setting.label}
                                        </label>
                                        <div className="group relative">
                                            <Info size={12} className="text-muted-foreground/50 cursor-help" />
                                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-card border border-border shadow-xl rounded-xl text-[9px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                {setting.description}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <AppleInput
                                        value={setting.value}
                                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                                        className={modifiedKeys.has(setting.key) ? 'ring-primary/40 bg-primary/5' : ''}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {modifiedKeys.size > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10">
                    <span className="text-xs font-bold uppercase tracking-widest">
                        {modifiedKeys.size} Parameters Modified
                    </span>
                    <button 
                        onClick={handleSave}
                        className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-colors"
                    >
                        Apply Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashSettings;
