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
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-1.5 bg-[#2563EB] rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-[#2563EB]">System Settings</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-foreground">System Settings</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage platform constants and environment variables.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={loadSettings}
                        className="h-10 px-4 rounded-none text-muted-foreground hover:text-foreground border border-border hover:bg-muted text-[9px] font-heading font-black uppercase tracking-widest transition-all"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-none bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-[9px] font-heading font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(groupedSettings).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2 px-1">
                            <span className="text-[#2563EB]">{categoryIcons[category]}</span> {category.charAt(0).toUpperCase() + category.slice(1)} Settings
                        </h3>
                        
                        <div className="bg-card border border-border rounded-none p-6 md:p-8 space-y-8 shadow-none">
                            {items.map(setting => (
                                <div key={setting.key} className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[9px] font-heading font-black text-foreground uppercase tracking-widest">
                                            {setting.label}
                                        </label>
                                        <div className="group relative">
                                            <Info size={12} className="text-muted-foreground/40 hover:text-[#2563EB] cursor-help transition-colors" />
                                            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-card border border-border shadow-xl rounded-none text-[9px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                {setting.description}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <input
                                        type={setting.key === 'commission_percentage' ? 'number' : 'text'}
                                        min={setting.key === 'commission_percentage' ? '0' : undefined}
                                        max={setting.key === 'commission_percentage' ? '100' : undefined}
                                        step={setting.key === 'commission_percentage' ? '0.1' : undefined}
                                        value={setting.value}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (setting.key === 'commission_percentage') {
                                                const n = Number(v);
                                                if (v === '' || (!Number.isNaN(n) && n >= 0 && n <= 100)) {
                                                    handleInputChange(setting.key, v === '' ? '' : n);
                                                }
                                            } else {
                                                handleInputChange(setting.key, v);
                                            }
                                        }}
                                        className={`w-full px-4 py-3 text-xs bg-card border rounded-none focus:outline-none focus:border-[#2563EB] transition-all font-heading font-bold placeholder:text-muted-foreground/40 ${
                                            modifiedKeys.has(setting.key) 
                                                ? 'border-[#2563EB] bg-[#2563EB]/5' 
                                                : 'border-border'
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {modifiedKeys.size > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground px-6 py-4 rounded-none shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-[100] backdrop-blur-xl">
                    <span className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">
                        {modifiedKeys.size} settings modified
                    </span>
                    <button 
                        onClick={handleSave}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-2.5 rounded-none text-[9px] font-heading font-black uppercase tracking-widest text-white transition-all shadow-none"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashSettings;
