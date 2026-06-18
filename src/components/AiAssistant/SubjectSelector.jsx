import { useAiStore } from '../../store/aiStore';
import { cn } from '@/lib/utils';
import {
    GraduationCap, BookOpen, FileSearch, Globe,
    Code2, Sparkles, Calculator, Atom, FlaskConical,
    Dna, Monitor, Languages, PenTool, Award
} from 'lucide-react';

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

const ORDER = [
    'ssc', 'hsc', 'admission',
    'math', 'physics', 'chemistry', 'biology', 'ict',
    'english', 'bangla',
    'ielts', 'toefl', 'sat',
    'programming', 'general',
];

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
