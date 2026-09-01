import { useState, useEffect } from 'react';

const PHRASES = [
    'Thinking…',
    'Checking notes…',
    'Working it out…',
    'Formulating response…'
];

export default function SkeletonCard() {
    const [phraseIdx, setPhraseIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div role="status" aria-live="polite" aria-label="AI is thinking" className="w-full bg-card border border-border/50 rounded-lg p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-5 w-[30%] mb-3 rounded-md bg-gradient-to-r from-secondary/50 via-border/50 to-secondary/50 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-4 w-[90%] mb-3 rounded-md bg-gradient-to-r from-secondary/50 via-border/50 to-secondary/50 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-4 w-[85%] mb-3 rounded-md bg-gradient-to-r from-secondary/50 via-border/50 to-secondary/50 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-4 w-[60%] mb-3 rounded-md bg-gradient-to-r from-secondary/50 via-border/50 to-secondary/50 bg-[length:200%_100%] animate-shimmer" />

            <div className="text-[13px] text-muted-foreground mt-4 font-medium flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-border border-t-primary rounded-full animate-spin" />
                <span>{PHRASES[phraseIdx]}</span>
            </div>
        </div>
    );
}
