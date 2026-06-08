// components/AiAssistant/SubjectSelector.jsx
// Vertical list of subject chips on the left of the chat. Clicking a
// chip updates the global aiStore; the new subject is sent with the
// NEXT chat message (we don't re-route an in-flight message).
import { useAiStore } from '../../store/aiStore';
import { cn } from '@/lib/utils';
import {
    AcademicCapIcon, BookOpenIcon, MapIcon, LanguageIcon, 
    CodeBracketIcon, SparklesIcon, CalculatorIcon
} from '@heroicons/react/24/outline';

const SUBJECT_META = {
    ssc: { label: 'SSC', icon: AcademicCapIcon, hint: 'Secondary School' },
    hsc: { label: 'HSC', icon: AcademicCapIcon, hint: 'Higher Secondary' },
    admission: { label: 'Admission', icon: MapIcon, hint: 'University Entrance' },
    math: { label: 'Math', icon: CalculatorIcon, hint: 'SSC/HSC/Admission Math' },
    ielts: { label: 'IELTS', icon: LanguageIcon, hint: 'English Proficiency' },
    english: { label: 'English', icon: BookOpenIcon, hint: 'General English' },
    programming: { label: 'Programming', icon: CodeBracketIcon, hint: 'Code & Software' },
    general: { label: 'General', icon: SparklesIcon, hint: 'Anything else' },
};

const ORDER = ['ssc', 'hsc', 'admission', 'math', 'ielts', 'english', 'programming', 'general'];

export default function SubjectSelector({ className = '', compact = false }) {
    const subject = useAiStore((s) => s.subject);
    const setSubject = useAiStore((s) => s.setSubject);

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {!compact && (
                <div className="pr-2 pb-2 pt-1">
                    <p className="text-[10px] font-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Subject
                    </p>
                </div>
            )}
            <div className={cn('flex gap-2', compact ? 'overflow-x-auto pb-1' : 'flex-col')}>
                {ORDER.map((key) => {
                    const meta = SUBJECT_META[key];
                    const Icon = meta.icon;
                    const active = subject === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setSubject(key)}
                            className={cn(
                                'group relative flex items-center gap-2 rounded-lg border transition-all duration-300',
                                compact
                                    ? 'shrink-0 h-9 px-3 text-xs'
                                    : 'h-10 px-3 text-sm w-full',
                                active
                                    ? 'border-primary/50 bg-primary/10 text-foreground shadow-sm'
                                    : 'border-border/50 bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-card/50',
                            )}
                            aria-pressed={active}
                            title={meta.hint}
                        >
                            <Icon
                                className={cn(
                                    'transition-colors duration-300 shrink-0',
                                    compact ? 'size-3.5' : 'size-4',
                                    active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                                )}
                            />
                            <span className="font-medium tracking-tight whitespace-nowrap">{meta.label}</span>
                            {active && (
                                <span className="absolute right-2 size-1.5 rounded-full bg-accent" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
