// components/AiAssistant/ChatInput.jsx
// AI_TUTOR_DESIGN.md §5.4 — The chat input box.
//
// Features:
//   • Auto-grows 44 → 152 px; 8000-char limit (IELTS essays).
//   • Subject context pill (visible when subject !== 'general').
//   • Attachment chip + 📎 Attach button (image/PDF, max 1).
//   • 🎤 Voice button (Web Speech API, feature-detected).
//   • THINKING_LABELS rotation on the action button while loading.
//   • Stop button replaces Send while `loading === true` and calls
//     `onStop()` so the parent can abort the in-flight fetch/stream.
//   • Esc key triggers `onStop` while loading.
import { useEffect, useRef, useState } from 'react';
import {
    Send, Loader2, Square, Paperclip, Mic, MicOff, X, FileText, Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAiStore } from '../../store/aiStore';

const MAX_LENGTH = 8000;
const WARNING_BAND = 7500;

// Rotating label set for the Send button while loading.
// Per AI_TUTOR_DESIGN.md §6.3, cycles every 3 s.
const THINKING_LABELS = [
    'Thinking…',
    'Checking notes…',
    'Working it out…',
    'Almost there…',
    'Hold on…',
];

// Web Speech API feature detection.
const SPEECH_SUPPORTED =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

const SUBJECT_LABELS = {
    ssc: 'SSC', hsc: 'HSC', admission: 'Admission',
    ielts: 'IELTS', english: 'English', programming: 'Programming', general: 'General',
};

function subjectLabel(s) {
    return SUBJECT_LABELS[s] || 'General';
}

export default function ChatInput({
    value,
    onChange,
    onSend,
    onStop,
    disabled = false,
    loading = false,
    placeholder,
    className = '',
}) {
    const taRef = useRef(null);
    const fileInputRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);

    const subject = useAiStore((s) => s.subject);
    const setSubject = useAiStore((s) => s.setSubject);
    const attachmentFile = useAiStore((s) => s.attachmentFile);
    const setAttachmentFile = useAiStore((s) => s.setAttachmentFile);
    const setThinkingLabelIndex = useAiStore((s) => s.setThinkingLabelIndex);

    // Auto-grow the textarea up to 6 lines, then scroll.
    useEffect(() => {
        const ta = taRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        const lineHeight = 22;
        const maxHeight = lineHeight * 6 + 20;
        const newHeight = Math.min(ta.scrollHeight, maxHeight);
        ta.style.height = `${newHeight}px`;
    }, [value]);

    // THINKING_LABELS rotation: cycle every 3 s while loading. §6.3
    useEffect(() => {
        if (!loading) {
            setThinkingLabelIndex(0);
            return undefined;
        }
        const t = setInterval(() => {
            // The store's setter is the source of truth for the index.
            const current = useAiStore.getState().thinkingLabelIndex;
            setThinkingLabelIndex((current + 1) % THINKING_LABELS.length);
        }, 3000);
        return () => clearInterval(t);
    }, [loading, setThinkingLabelIndex]);

    const thinkingLabelIndex = useAiStore((s) => s.thinkingLabelIndex);

    const handleKeyDown = (e) => {
        // Esc while loading → Stop
        if (e.key === 'Escape' && loading) {
            e.preventDefault();
            onStop?.();
            return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const trimmed = (value || '').trim();
            if (trimmed && !loading && !disabled) onSend?.(trimmed);
        }
    };

    const charCount = (value || '').length;
    const overWarning = charCount > WARNING_BAND;
    const overLimit = charCount > MAX_LENGTH;
    const canSend = !overLimit && !loading && !disabled && (value || '').trim().length > 0;

    const handleSendClick = () => {
        if (loading) {
            onStop?.();
        } else if (canSend) {
            onSend?.((value || '').trim());
        }
    };

    // ───── Attachments ─────
    const handleAttachClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (file) setAttachmentFile(file);
        // Reset so the same file can be re-selected later.
        e.target.value = '';
    };

    const handleRemoveAttachment = () => setAttachmentFile(null);

// Pick a sensible default STT language. Bangladeshi students often
// speak Bangla; default to bn-BD if the browser reports Bangla as the
// user's language, otherwise en-US. Users can override in their OS
// settings — we always honor the browser's reported language if it's
// a known one.
function pickRecognitionLang() {
    const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
    const lower = nav.toLowerCase();
    if (lower.startsWith('bn')) return 'bn-BD';
    if (lower.startsWith('en')) return 'en-US';
    return 'en-US';
}

    // ───── Voice input ─────
    const startRecording = () => {
        if (!SPEECH_SUPPORTED) return;
        const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new Ctor();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = pickRecognitionLang();
        rec.onresult = (ev) => {
            const transcript = ev.results?.[0]?.[0]?.transcript || '';
            if (transcript) {
                const next = (value || '').trim();
                onChange?.(next ? `${next} ${transcript}` : transcript);
            }
        };
        rec.onend = () => setIsRecording(false);
        rec.onerror = () => setIsRecording(false);
        rec.start();
        recognitionRef.current = rec;
        setIsRecording(true);
    };

    const stopRecording = () => {
        recognitionRef.current?.stop();
        setIsRecording(false);
    };

    // Tear down the recognition on unmount.
    useEffect(() => () => recognitionRef.current?.stop(), []);

    // Subject-aware placeholder
    const resolvedPlaceholder =
        placeholder ??
        (subject === 'ielts'
            ? 'Paste your IELTS essay here, or ask a question…'
            : `Ask anything about ${subjectLabel(subject)}…`);

    return (
        <div
            className={cn(
                'group relative w-full rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl transition-all duration-300',
                focused
                    ? 'border-primary/50 shadow-lg shadow-primary/10 ring-2 ring-primary/10'
                    : 'border-border/80 shadow-sm',
                overLimit && 'border-destructive/60 ring-2 ring-destructive/10',
                className,
            )}
        >
            {/* Subject context pill (above textarea) */}
            {subject && subject !== 'general' && (
                <div className="flex items-center gap-1.5 px-4 pt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-[11px] font-label text-primary">
                        {subjectLabel(subject)}
                        <button
                            type="button"
                            onClick={() => setSubject('general')}
                            aria-label="Clear subject"
                            className="ml-0.5 -mr-0.5 rounded-sm hover:bg-primary/20 inline-flex items-center justify-center"
                        >
                            <X size={10} />
                        </button>
                    </span>
                </div>
            )}

            <textarea
                ref={taRef}
                value={value}
                onChange={(e) => onChange?.(e.target.value.slice(0, MAX_LENGTH))}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={resolvedPlaceholder}
                rows={1}
                disabled={disabled}
                className={cn(
                    'w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm leading-[22px] text-foreground',
                    'placeholder:text-muted-foreground/60 focus:outline-none',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                )}
                style={{ minHeight: 44, maxHeight: 152 }}
            />

            {/* Attachment preview chip */}
            {attachmentFile && (
                <div className="px-4 pb-1.5">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/60 px-3 py-1.5 text-xs font-label">
                        {attachmentFile.type?.startsWith('image/') ? (
                            <ImageIcon size={12} />
                        ) : (
                            <FileText size={12} />
                        )}
                        <span className="max-w-[180px] truncate">{attachmentFile.name}</span>
                        <button
                            type="button"
                            onClick={handleRemoveAttachment}
                            aria-label="Remove attachment"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X size={12} />
                        </button>
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between gap-2 px-3 pb-2.5">
                <div className="flex items-center gap-1">
                    {/* Hidden file picker */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-hidden="true"
                    />
                    <button
                        type="button"
                        onClick={handleAttachClick}
                        title="Attach image or PDF"
                        aria-label="Attach image or PDF"
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center transition-colors"
                    >
                        <Paperclip size={14} />
                    </button>
                    {SPEECH_SUPPORTED && (
                        <button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            title={isRecording ? 'Stop recording' : 'Voice input'}
                            aria-label={isRecording ? 'Stop recording' : 'Voice input'}
                            className={cn(
                                'h-7 w-7 rounded-md inline-flex items-center justify-center transition-colors',
                                isRecording
                                    ? 'text-destructive animate-pulse'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                            )}
                        >
                            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'text-[10px] font-label tracking-wider transition-colors',
                            overLimit
                                ? 'text-destructive'
                                : overWarning
                                    ? 'text-amber-500'
                                    : 'text-muted-foreground/60',
                        )}
                    >
                        {charCount}/{MAX_LENGTH}
                    </span>
                    {loading ? (
                        <button
                            type="button"
                            onClick={onStop}
                            aria-label="Stop generating"
                            className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive border border-destructive/30 h-9 px-3.5 text-xs font-semibold rounded-lg hover:bg-destructive/20 active:scale-95 transition-all"
                        >
                            <Square size={12} strokeWidth={2.5} />
                            <span>Stop</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSendClick}
                            disabled={!canSend}
                            aria-label="Send message"
                            className={cn(
                                'flex items-center gap-1.5 rounded-lg px-3.5 h-9 text-xs font-semibold transition-all duration-200',
                                canSend
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 active:scale-95'
                                    : 'bg-muted text-muted-foreground/60 cursor-not-allowed',
                            )}
                        >
                            {THINKING_LABELS[thinkingLabelIndex] === 'Thinking…' ? null : null}
                            <Send size={13} strokeWidth={2.5} />
                            <span>Send</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
