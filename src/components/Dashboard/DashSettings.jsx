import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FormSkeleton } from "@/components/shared/skeletons";
import { Info, Globe, Phone, Banknote, Layout, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashSettings = () => {
    const navigate = useNavigate();
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

    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <FormSkeleton key={i} fields={3} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 animate-fade-in-up">
            {/* My Profile Card */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 bg-muted rounded-lg flex items-center justify-center">
                        <User size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-sm font-heading font-bold text-foreground">My Profile</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Edit your personal information and preferences</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="h-9 px-4 rounded-lg border border-border text-[9px] font-label font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
                >
                    Edit Profile
                </button>
            </div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
                            <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-primary">System Settings</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">System Settings</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage platform constants and environment variables.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={loadSettings}
                        className="h-10 px-4 rounded-lg text-muted-foreground hover:text-foreground border border-border hover:bg-muted text-[9px] font-label font-semibold uppercase tracking-wider transition-all"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-[9px] font-label font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(groupedSettings).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
                            <span className="text-primary">{categoryIcons[category]}</span> {category.charAt(0).toUpperCase() + category.slice(1)} Settings
                        </h3>
                        
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8 shadow-none">
                            {items.map(setting => (
                                <div key={setting.key} className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[9px] font-label font-semibold text-foreground uppercase tracking-wider">
                                            {setting.label}
                                        </label>
                                        <div className="group relative">
                                            <Info size={12} className="text-muted-foreground/40 hover:text-primary cursor-help transition-colors" />
                                            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-card border border-border shadow-xl rounded-lg text-[9px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
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
                                        className={`w-full px-4 py-3 text-xs bg-card border rounded-lg focus:outline-none focus:border-primary transition-all font-heading font-bold placeholder:text-muted-foreground/40 ${
                                            modifiedKeys.has(setting.key) 
                                                ? 'border-primary bg-primary/5' 
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
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground px-6 py-4 rounded-lg shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-[100] backdrop-blur-xl">
                    <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                        {modifiedKeys.size} settings modified
                    </span>
                    <button 
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg text-[9px] font-label font-semibold uppercase tracking-wider text-primary-foreground transition-all shadow-none"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashSettings;
