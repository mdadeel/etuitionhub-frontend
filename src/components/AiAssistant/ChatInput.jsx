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
    GraduationCap, BookOpen, FileSearch, Calculator, Atom, FlaskConical,
    Dna, Monitor, Globe, Languages, PenTool, Award, Code2, Sparkles, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAiStore } from '../../store/aiStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    math: 'Math', ielts: 'IELTS', english: 'English', programming: 'Programming', general: 'General',
};

function subjectLabel(s) {
    return SUBJECT_LABELS[s] || 'General';
}

const SUBJECT_META = {
    ssc:         { label: 'SSC',         icon: GraduationCap,  hint: 'Class 9-10 (NCTB)' },
    hsc:         { label: 'HSC',         icon: BookOpen,        hint: 'Class 11-12 (NCTB)' },
    admission:   { label: 'Admission',   icon: FileSearch,      hint: 'BUET, DU, Medical' },
    math:        { label: 'Math',        icon: Calculator,      hint: 'SSC/HSC/Admission Math' },
    physics:     { label: 'Physics',     icon: Atom,            hint: 'SSC/HSC/Admission Physics' },
    chemistry:   { label: 'Chemistry',   icon: FlaskConical,    hint: 'SSC/HSC/Admission Chemistry' },
    biology:     { label: 'Biology',     icon: Dna,             hint: 'SSC/HSC/Medical Admission' },
    ict:         { label: 'ICT',         icon: Monitor,         hint: 'Information & Communication Technology' },
    english:     { label: 'English',     icon: Globe,           hint: 'Grammar, Vocabulary, Writing' },
    bangla:      { label: 'Bangla',      icon: Languages,       hint: 'SSC/HSC Bangla Literature & Grammar' },
    ielts:       { label: 'IELTS',       icon: PenTool,         hint: 'Band scoring (0-9)' },
    toefl:       { label: 'TOEFL',       icon: Award,           hint: 'TOEFL iBT (0-120)' },
    sat:         { label: 'SAT',         icon: Award,           hint: 'Math + Reading & Writing' },
    programming: { label: 'Programming', icon: Code2,           hint: 'Code & Software' },
    general:     { label: 'General',     icon: Sparkles,        hint: 'Anything else' },
};

const SUBJECT_ORDER = [
    'ssc', 'hsc', 'admission',
    'math', 'physics', 'chemistry', 'biology', 'ict',
    'english', 'bangla',
    'ielts', 'toefl', 'sat',
    'programming', 'general',
];

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
    const slashMenuRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [slashMenuOpen, setSlashMenuOpen] = useState(false);
    const [slashFilter, setSlashFilter] = useState('');
    const [slashIndex, setSlashIndex] = useState(0);
    const recognitionRef = useRef(null);

    const subject = useAiStore((s) => s.subject);
    const setSubject = useAiStore((s) => s.setSubject);
    const attachmentFile = useAiStore((s) => s.attachmentFile);
    const setAttachmentFile = useAiStore((s) => s.setAttachmentFile);
    const setThinkingLabelIndex = useAiStore((s) => s.setThinkingLabelIndex);
    const usage = useAiStore((s) => s.usage);

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

    // const thinkingLabelIndex = useAiStore((s) => s.thinkingLabelIndex);

    // ───── Slash-command menu ─────
    const filteredSubjects = SUBJECT_ORDER.filter((key) => {
        if (!slashFilter) return true;
        const meta = SUBJECT_META[key];
        return (
            key.startsWith(slashFilter.toLowerCase()) ||
            meta.label.toLowerCase().startsWith(slashFilter.toLowerCase())
        );
    });

    useEffect(() => {
        if (!slashMenuOpen) return;
        const handler = (e) => {
            if (slashMenuRef.current && !slashMenuRef.current.contains(e.target)) {
                setSlashMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [slashMenuOpen]);

    const selectSlashSubject = (key) => {
        const meta = SUBJECT_META[key];
        setSubject(key);
        setSlashMenuOpen(false);
        const prefix = `/${meta.label.toLowerCase()} `;
        onChange?.(prefix);
        taRef.current?.focus();
    };

    const handleValueChange = (newValue) => {
        const slashMatch = newValue.match(/^\/([a-zA-Z]*)$/);
        if (slashMatch) {
            setSlashFilter(slashMatch[1]);
            setSlashMenuOpen(true);
            setSlashIndex(0);
        } else {
            setSlashMenuOpen(false);
        }
        onChange?.(newValue);
    };

    const handleKeyDown = (e) => {
        if (slashMenuOpen && filteredSubjects.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSlashIndex((i) => Math.min(i + 1, filteredSubjects.length - 1));
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSlashIndex((i) => Math.max(i - 1, 0));
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                selectSlashSubject(filteredSubjects[slashIndex]);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setSlashMenuOpen(false);
                return;
            }
        }
        // Esc while loading → Stop
        if (e.key === 'Escape' && loading) {
            e.preventDefault();
            onStop?.();
            return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const trimmed = (value || '').trim();
            if (trimmed && !loading && !disabled) {
                // Parse /command prefix from the message text
                let msg = trimmed;
                const commandMatch = trimmed.match(/^\/(\w+)\s*(.*)/);
                if (commandMatch) {
                    const key = commandMatch[1].toLowerCase();
                    if (SUBJECT_META[key]) {
                        setSubject(key);
                        msg = commandMatch[2] || '';
                    }
                }
                onSend?.(msg);
            }
        }
    };

    const charCount = (value || '').length;
    // const overWarning = charCount > WARNING_BAND;
    const overLimit = charCount > MAX_LENGTH;
    const canSend = !overLimit && !loading && !disabled && (value || '').trim().length > 0;

    const handleSendClick = () => {
        if (loading) {
            onStop?.();
        } else if (canSend) {
            const trimmed = (value || '').trim();
            let msg = trimmed;
            const commandMatch = trimmed.match(/^\/(\w+)\s*(.*)/);
            if (commandMatch) {
                const key = commandMatch[1].toLowerCase();
                if (SUBJECT_META[key]) {
                    setSubject(key);
                    msg = commandMatch[2] || '';
                }
            }
            onSend?.(msg);
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
                'group relative w-full rounded-2xl border bg-background/80 backdrop-blur-xl transition-all duration-200',
                focused
                    ? 'border-primary/40 shadow-sm'
                    : 'border-border/60 shadow-sm',
                overLimit && 'border-destructive/50',
                className,
            )}
        >
            <div className="flex items-end gap-1.5 px-3 pb-2.5 pt-2">
                {/* Hidden file picker */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-hidden="true"
                />
                <div className="flex items-center gap-0.5 pb-1">
                    <button
                        type="button"
                        onClick={handleAttachClick}
                        title="Attach image or PDF"
                        aria-label="Attach image or PDF"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center transition-colors"
                    >
                        <Paperclip size={16} />
                    </button>
                </div>
                <div className="flex-1 relative">
                    {/* Slash-command subject menu */}
                    {slashMenuOpen && filteredSubjects.length > 0 && (
                        <div
                            ref={slashMenuRef}
                            className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-xl border border-border/40 bg-background shadow-lg overflow-hidden"
                        >
                            <div className="max-h-48 overflow-y-auto py-1">
                                {filteredSubjects.map((key, i) => {
                                    const meta = SUBJECT_META[key];
                                    const Icon = meta.icon;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => selectSlashSubject(key)}
                                            onMouseEnter={() => setSlashIndex(i)}
                                            className={cn(
                                                'w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors',
                                                i === slashIndex
                                                    ? 'bg-primary/10 text-foreground'
                                                    : 'text-muted-foreground hover:bg-muted/50',
                                            )}
                                        >
                                            <span className="size-5 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                <Icon size={11} className={i === slashIndex ? 'text-primary' : ''} />
                                            </span>
                                            <span className="flex-1">{meta.label}</span>
                                            <span className="text-[10px] text-muted-foreground/50 font-mono">/{key}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {/* Attachment preview inline above textarea */}
                    {attachmentFile && (
                        <div className="pb-1">
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
                    <textarea
                        ref={taRef}
                        value={value}
                        onChange={(e) => handleValueChange(e.target.value.slice(0, MAX_LENGTH))}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={slashMenuOpen ? 'Type a subject name…' : resolvedPlaceholder}
                        rows={1}
                        disabled={disabled}
                        className={cn(
                            'w-full resize-none bg-transparent text-sm leading-[22px] text-foreground',
                            'placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                            'disabled:opacity-60 disabled:cursor-not-allowed',
                        )}
                        style={{ minHeight: 24, maxHeight: 152 }}
                    />
                </div>
                <div className="flex items-end gap-1.5 pb-1">
                    {usage && usage.limit.daily !== Infinity && (
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            'flex items-center gap-1 rounded-full px-2.5 py-1 mr-1.5 border transition-all cursor-default select-none',
                                            usage.remaining.daily === 0 || usage.remaining.monthly === 0
                                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                                : usage.remaining.daily / usage.limit.daily < 0.3 || usage.remaining.monthly / usage.limit.monthly < 0.3
                                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                                    : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border/60 hover:text-foreground'
                                        )}
                                    >
                                        <Zap 
                                            size={13} 
                                            className={cn(
                                                usage.remaining.daily > 0 && usage.remaining.monthly > 0 ? "fill-current" : ""
                                            )} 
                                        />
                                        <span className="text-[11px] font-bold tracking-tight">
                                            {usage.remaining.daily}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" sideOffset={12} className="px-3 py-2 text-xs">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Daily limits:</span>
                                            <span className="font-medium">{usage.remaining.daily} / {usage.limit.daily}</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Monthly limits:</span>
                                            <span className="font-medium">{usage.remaining.monthly} / {usage.limit.monthly}</span>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {loading ? (
                        <button
                            type="button"
                            onClick={onStop}
                            aria-label="Stop generating"
                            className="inline-flex items-center justify-center bg-destructive/10 text-destructive border border-destructive/30 h-9 w-9 rounded-lg hover:bg-destructive/20 active:scale-95 transition-all"
                        >
                            <Square size={14} strokeWidth={2.5} />
                        </button>
                    ) : (value || '').trim().length > 0 ? (
                        <button
                            type="button"
                            onClick={handleSendClick}
                            disabled={!canSend}
                            aria-label="Send message"
                            className={cn(
                                'inline-flex items-center justify-center rounded-lg h-9 w-9 transition-all duration-200',
                                canSend
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 active:scale-95'
                                    : 'bg-muted text-muted-foreground/60 cursor-not-allowed',
                            )}
                        >
                            <Send size={16} strokeWidth={2} />
                        </button>
                    ) : SPEECH_SUPPORTED ? (
                        <button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            title={isRecording ? 'Stop recording' : 'Voice input'}
                            aria-label={isRecording ? 'Stop recording' : 'Voice input'}
                            className={cn(
                                'inline-flex items-center justify-center rounded-lg h-9 w-9 transition-all duration-200',
                                isRecording
                                    ? 'bg-destructive/10 text-destructive animate-pulse border border-destructive/30'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95',
                            )}
                        >
                            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                        </button>
                    ) : (
                        <span className="h-9 w-9" />
                    )}
                </div>
            </div>
        </div>
    );
}
