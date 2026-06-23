// pages/AiAssistant/AiAssistantHome.jsx
// Porua AI home landing page.
//
// Layout:
//   - Premium animated hero with Porua AI identity + greeting
//   - Intent-categorized action cards (8 intents from spec)
//   - Compact subject selector on mobile
//   - Chat input to start a conversation
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useAiStore from '../../store/aiStore';
import aiService from '../../services/aiService';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import SubjectSelector from '../../components/AiAssistant/SubjectSelector';
import { SUGGESTED_ACTIONS } from '../../components/AiAssistant/SuggestedActions';
import ChatInput from '../../components/AiAssistant/ChatInput';
import PoruaLogo from '../../components/AiAssistant/PoruaLogo';
import { cn } from '@/lib/utils';

// eslint-disable-next-line no-unused-vars
function formatRelative(dateLike) {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'now';
    if (diffMin < 60) return `${diffMin}m`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d`;
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

export default function AiAssistantHome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const subject = useAiStore((s) => s.subject);
    const [text, setText] = useState('');

    // Fetch AI usage limits with 5-min cache.
    const setUsage = useAiStore((s) => s.setUsage);
    useQuery({
        queryKey: ['ai-usage'],
        queryFn: async () => { const d = await aiService.getUsage(); setUsage(d); return d; },
        staleTime: 5 * 60 * 1000,
    });

    // Recent chat sessions for the sidebar preview.
    const { data: recentData } = useQuery({
        queryKey: ['ai-sessions-preview'],
        queryFn: () => aiService.listChatSessions({ limit: 5 }),
        staleTime: 30_000,
    });
    // eslint-disable-next-line no-unused-vars
    const recentChats = Array.isArray(recentData?.sessions)
        ? recentData.sessions
        : Array.isArray(recentData)
            ? recentData
            : [];

    const handleSend = async (msg) => {
        const trimmed = (msg || '').trim();
        if (!trimmed) return;
        navigate('/ai-assistant/chat/new', { state: { initialMessage: trimmed } });
    };

    const greetingName = user?.displayName?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AiAssistantLayout>
            <div className="flex flex-col items-center justify-start min-h-full py-8 overflow-y-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl w-full space-y-8 my-auto">

                    {/* ── Hero ─────────────────────────────────────────── */}
                    <header className="space-y-3 text-center">
                        {/* Porua AI logo + animated glow */}
                        <div className="relative flex justify-center mb-4">
                            <div className="relative size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                                <PoruaLogo iconOnly size={28} className="text-primary" />
                                {/* Subtle pulse ring */}
                                <span className="absolute inset-0 rounded-2xl border border-primary/30 animate-ping opacity-20 pointer-events-none" />
                            </div>
                        </div>

                        {/* Greeting */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1.5">
                                <Sparkles size={13} className="text-primary/60" />
                                <span className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    Porua AI · E-TuitionBD Official AI Tutor
                                </span>
                                <Sparkles size={13} className="text-primary/60" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
                                {greeting},{' '}
                                <span className="text-primary">{greetingName}</span>
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                Your AI study companion for SSC, HSC, Admission, IELTS, Programming, and more.
                                What would you like to learn today?
                            </p>
                        </div>
                    </header>

                    {/* ── Subject selector (mobile only) ───────────────── */}
                    <div className="lg:hidden">
                        <SubjectSelector compact />
                    </div>

                    {/* ── Intent action cards ───────────────────────────── */}
                    <div className="space-y-2.5">
                        <p className="text-[10px] font-label font-semibold uppercase tracking-[0.1em] text-muted-foreground px-0.5">
                            Quick actions
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SUGGESTED_ACTIONS.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={action.id}
                                        type="button"
                                        onClick={() => {
                                            setText(action.prompt);
                                            // Immediately jump to chat input and focus
                                            setTimeout(() => {
                                                const ta = document.querySelector('textarea');
                                                if (ta) {
                                                    ta.focus();
                                                    ta.setSelectionRange(ta.value.length, ta.value.length);
                                                    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }
                                            }, 50);
                                        }}
                                        className={cn(
                                            'group relative flex flex-col items-start gap-2 rounded-xl border border-border/60',
                                            'bg-card/60 p-3.5 text-left transition-all duration-300 overflow-hidden',
                                            'hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5',
                                        )}
                                    >
                                        {/* Gradient layer */}
                                        <span
                                            className={cn(
                                                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
                                                action.color,
                                            )}
                                        />
                                        {/* Icon */}
                                        <div className="relative z-10 size-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Icon size={14} strokeWidth={2.2} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        {/* Labels */}
                                        <div className="relative z-10">
                                            <p className="text-xs font-semibold text-foreground leading-tight">{action.label}</p>
                                            {action.mode && (
                                                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{action.mode}</p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Chat input ────────────────────────────────────── */}
                    <div className="pt-2">
                        <ChatInput
                            value={text}
                            onChange={setText}
                            onSend={handleSend}
                            loading={false}
                            placeholder={`Ask anything about ${subjectLabel(subject)}...`}
                        />
                        <p className="text-[10px] text-center text-muted-foreground mt-4 px-4">
                            Porua AI specializes in education. It can make mistakes — always verify important info.
                        </p>
                    </div>
                </div>
            </div>
        </AiAssistantLayout>
    );
}

function subjectLabel(s) {
    const map = {
        ssc: 'SSC',
        hsc: 'HSC',
        admission: 'University Admission',
        math: 'Math',
        physics: 'Physics',
        chemistry: 'Chemistry',
        biology: 'Biology',
        ict: 'ICT',
        ielts: 'IELTS',
        toefl: 'TOEFL',
        sat: 'SAT',
        english: 'English',
        bangla: 'Bangla',
        programming: 'Programming',
        general: 'anything',
    };
    return map[s] || 'anything';
}
