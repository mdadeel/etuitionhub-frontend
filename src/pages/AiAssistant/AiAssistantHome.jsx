// pages/AiAssistant/AiAssistantHome.jsx
// AI_TUTOR_DESIGN.md §5.9 — The AI Assistant landing page.
//
// Desktop sidebar (260 px) is now a multi-section rail (§4.2):
//   1. SubjectSelector (compact pill grid — no "Subject" label)
//   2. Recent Chats       (last 5 sessions, no delete buttons)
//   3. [View all history →]
// On mobile: only the centered hero + suggested actions + input.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ArrowRight, Wrench, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useAiStore from '../../store/aiStore';
import aiService from '../../services/aiService';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import SubjectSelector from '../../components/AiAssistant/SubjectSelector';
import SuggestedActions from '../../components/AiAssistant/SuggestedActions';
import ChatInput from '../../components/AiAssistant/ChatInput';
// eslint-disable-next-line no-unused-vars
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

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
    const [sending, setSending] = useState(false);

    // AI_TUTOR_DESIGN.md §5.9 — recent chats preview in the sidebar.
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

    const handleSend = async (msg, forceTemplate = null) => {
        const trimmed = (msg || '').trim();
        if (!trimmed || sending) return;
        setSending(true);
        try {
            const res = await aiService.sendChatMessage({
                userMessage: trimmed,
                subject,
                forceTemplate,
            });
            const sessionId = res?.session?._id;
            if (sessionId) {
                navigate(`/ai-assistant/chat/${sessionId}`);
            } else {
                toast.error('Could not start a chat session. Please try again.');
            }
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || 'Failed to send';
            toast.error(msg);
        } finally {
            setSending(false);
        }
    };

    const greetingName = user?.displayName?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AiAssistantLayout>
            <div className="flex flex-col items-center justify-center min-h-full py-10 overflow-y-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl w-full space-y-8 my-auto">
                    <header className="space-y-2 text-center">
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
                            {greeting}, <span className="text-primary">{greetingName}</span> 👋
                        </h2>
                        <p className="text-base text-muted-foreground">
                            What would you like to learn today?
                        </p>
                    </header>

                    {/* Subject selector on mobile (compact) */}
                    <div className="lg:hidden">
                        <SubjectSelector compact />
                    </div>

                    {/* Suggested actions */}
                    <SuggestedActions
                        onAction={(action) => {
                            setText(action.prompt);
                        }}
                    />

                    {/* Chat input */}
                    <div className="pt-4">
                        <ChatInput
                            value={text}
                            onChange={setText}
                            onSend={handleSend}
                            loading={sending}
                            placeholder={`Ask anything about ${subjectLabel(subject)}...`}
                        />
                        <p className="text-[10px] text-center text-muted-foreground mt-4 px-4">
                            Porua AI can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
            </div>
        </AiAssistantLayout>
    );
}

function subjectLabel(s) {
    const map = {
        ssc: 'SSC', hsc: 'HSC', admission: 'University Admission',
        ielts: 'IELTS', english: 'English', programming: 'Programming', general: 'anything',
    };
    return map[s] || 'anything';
}
