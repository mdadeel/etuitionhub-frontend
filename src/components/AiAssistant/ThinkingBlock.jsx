import { useState, lazy, Suspense } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

const LazyMarkdownRenderer = lazy(() => import('./MarkdownRenderer'));
function MarkdownRenderer(props) {
    return (
        <Suspense fallback={<div className="h-8 w-full animate-pulse bg-muted/40 rounded" />}>
            <LazyMarkdownRenderer {...props} />
        </Suspense>
    );
}

export default function ThinkingBlock({ thinking, className = '' }) {
    const [expanded, setExpanded] = useState(false);

    if (!thinking) return null;

    return (
        <div className={cn('my-3 rounded-xl border border-border/40 overflow-hidden', className)}>
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors duration-150"
                aria-expanded={expanded}
                aria-label={expanded ? 'Hide thinking process' : 'Show thinking process'}
            >
                <Brain size={14} className="text-primary/60" />
                <span className="uppercase tracking-wider">Thinking Process</span>
                <span className="ml-auto">
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
            </button>
            {expanded && (
                <div className="px-4 pb-3 pt-1 text-[13px] leading-relaxed text-muted-foreground/80 border-t border-border/30 bg-muted/10">
                    <MarkdownRenderer content={thinking} />
                </div>
            )}
        </div>
    );
}
