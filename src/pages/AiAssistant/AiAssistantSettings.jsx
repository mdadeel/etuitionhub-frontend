// pages/AiAssistant/AiAssistantSettings.jsx
// AI Assistant settings — theme, language, and AI preferences.
import { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Monitor, Globe, Sparkles, Save, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import { Card } from '@/components/ui/card';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';

const THEME_OPTIONS = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Always use light mode' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark mode' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Follow your device setting' },
];

const LANGUAGE_OPTIONS = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'bn', label: 'বাংলা', flag: '🇧🇩' },
];

const AI_MODEL_OPTIONS = [
    { id: 'default', label: 'Default', description: 'Best balance of speed and quality' },
    { id: 'fast', label: 'Fast', description: 'Quick responses, lighter detail' },
    { id: 'detailed', label: 'Detailed', description: 'Comprehensive, in-depth answers' },
];

export default function AiAssistantSettings() {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState('en');
    const [aiModel, setAiModel] = useState('default');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load settings from backend on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await api.get('/api/ai/settings');
                const s = res.data;
                if (s.theme) setTheme(s.theme);
                if (s.language) setLanguage(s.language);
                if (s.aiModel) setAiModel(s.aiModel);
            } catch {
                // Fallback to localStorage
                try {
                    setLanguage(localStorage.getItem('ai-lang') || 'en');
                    setAiModel(localStorage.getItem('ai-model-pref') || 'default');
                } catch { /* ignore */ }
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [setTheme]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/api/ai/settings', { theme, language, aiModel });
            // Also save to localStorage as fallback
            try {
                localStorage.setItem('ai-lang', language);
                localStorage.setItem('ai-model-pref', aiModel);
            } catch { /* ignore */ }
            setSaved(true);
            toast.success('Settings saved');
            setTimeout(() => setSaved(false), 2000);
        } catch {
            // Fallback to localStorage only
            try {
                localStorage.setItem('ai-lang', language);
                localStorage.setItem('ai-model-pref', aiModel);
            } catch { /* ignore */ }
            setSaved(true);
            toast.success('Settings saved locally');
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setTheme('system');
        setLanguage('en');
        setAiModel('default');
        toast.success('Settings reset to defaults');
    };

    if (loading) {
        return (
            <AiAssistantLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={24} className="animate-spin text-primary" />
                </div>
            </AiAssistantLayout>
        );
    }

    return (
        <AiAssistantLayout>
            <div className="w-full min-h-full px-4 md:px-8 lg:px-12 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                    <div>
                        <h1 className="text-2xl font-heading font-black text-foreground flex items-center gap-3 uppercase tracking-tight">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Settings size={24} />
                            </div>
                            Settings
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">
                            Personalize your AI learning environment and preferences.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all px-4 h-11 rounded-xl hover:bg-muted border border-border/60 uppercase tracking-widest"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl px-6 h-11 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.98]',
                                saved
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20',
                                saving && 'opacity-70 cursor-not-allowed'
                            )}
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Appearance */}
                        <Card className="p-6 md:p-8 space-y-6 rounded-lg border-border/40 bg-card shadow-none" hover={false}>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Sun size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-heading font-bold text-foreground uppercase tracking-tight">Appearance</h2>
                                    <p className="text-xs text-muted-foreground font-medium">Choose a theme that fits your learning style</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {THEME_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    const isActive = theme === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => setTheme(opt.id)}
                                            className={cn(
                                                'flex flex-col items-center gap-3 p-5 rounded-lg border-2 transition-all group',
                                                isActive
                                                    ? 'border-primary bg-primary/5 shadow-inner'
                                                    : 'border-border/40 hover:border-primary/30 hover:bg-muted/30'
                                            )}
                                        >
                                            <div className={cn(
                                                'size-12 rounded-xl flex items-center justify-center transition-all duration-300',
                                                isActive 
                                                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20' 
                                                    : 'bg-muted text-muted-foreground group-hover:scale-110'
                                            )}>
                                                <Icon size={22} />
                                            </div>
                                            <div className="text-center">
                                                <p className={cn(
                                                    'text-xs font-bold uppercase tracking-widest',
                                                    isActive ? 'text-primary' : 'text-foreground'
                                                )}>{opt.label}</p>
                                                <p className="text-xs text-muted-foreground mt-1 font-medium leading-tight">{opt.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Language */}
                        <Card className="p-6 md:p-8 space-y-6 rounded-lg border-border/40 bg-card shadow-none" hover={false}>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Globe size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-heading font-bold text-foreground uppercase tracking-tight">Language</h2>
                                    <p className="text-xs text-muted-foreground font-medium">Select your primary learning language</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {LANGUAGE_OPTIONS.map((opt) => {
                                    const isActive = language === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => setLanguage(opt.id)}
                                            className={cn(
                                                'flex items-center gap-4 p-5 rounded-lg border-2 transition-all group',
                                                isActive
                                                    ? 'border-primary bg-primary/5 shadow-inner'
                                                    : 'border-border/40 hover:border-primary/30 hover:bg-muted/30'
                                            )}
                                        >
                                            <span className="text-3xl transition-transform group-hover:scale-125 duration-300">{opt.flag}</span>
                                            <div className="text-left">
                                                <p className={cn(
                                                    'text-sm font-bold uppercase tracking-widest',
                                                    isActive ? 'text-primary' : 'text-foreground'
                                                )}>{opt.label}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium italic">
                                                    {opt.id === 'bn' ? 'Default for many subjects' : 'Global standard'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* AI Preferences */}
                        <Card className="p-6 md:p-8 space-y-6 rounded-lg border-border/40 bg-card shadow-none" hover={false}>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Sparkles size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-heading font-bold text-foreground uppercase tracking-tight">AI Personality</h2>
                                    <p className="text-xs text-muted-foreground font-medium">Control how the AI assistant responds to you</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {AI_MODEL_OPTIONS.map((opt) => {
                                    const isActive = aiModel === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => setAiModel(opt.id)}
                                            className={cn(
                                                'w-full flex items-center gap-4 p-5 rounded-lg border-2 transition-all text-left group',
                                                isActive
                                                    ? 'border-primary bg-primary/5 shadow-inner'
                                                    : 'border-border/40 hover:border-primary/30 hover:bg-muted/30'
                                            )}
                                        >
                                            <div className={cn(
                                                'size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0',
                                                isActive ? 'border-primary bg-primary/20' : 'border-border group-hover:border-primary/50'
                                            )}>
                                                {isActive && <div className="size-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />}
                                            </div>
                                            <div>
                                                <p className={cn(
                                                    'text-sm font-bold uppercase tracking-widest',
                                                    isActive ? 'text-primary' : 'text-foreground'
                                                )}>{opt.label}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 font-medium leading-tight">{opt.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* About & Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="p-6 bg-primary/[0.03] border-primary/10 rounded-lg" hover={false}>
                                <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-2">Platform</h4>
                                <p className="text-sm font-bold text-foreground">Porua AI v1.0</p>
                                <p className="text-[11px] text-muted-foreground mt-1 font-medium">Build #2026.06.08</p>
                            </Card>
                            <Card className="p-6 bg-muted/20 border-border/40 rounded-lg" hover={false}>
                                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Accuracy</h4>
                                <p className="text-sm font-bold text-foreground">Self-Correction</p>
                                <p className="text-[11px] text-muted-foreground mt-1 font-medium italic">AI can make mistakes.</p>
                            </Card>
                        </div>

                        {/* System Status */}
                        <Card className="p-6 rounded-lg border-border/40 bg-card shadow-none" hover={false}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-foreground">API Status: Operational</span>
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Latency: 24ms</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AiAssistantLayout>
    );
}
