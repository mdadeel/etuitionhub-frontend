import React from 'react';
import { AppleButton, AppleBadge } from '../shared/AppleUI';
import { SearchX } from 'lucide-react';

const EmptyState = ({ onReset }) => {
    return (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="mb-10 relative">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
                <div className="relative w-24 h-24 bg-muted/50 border border-border/50 rounded-[2rem] flex items-center justify-center shadow-apple-sm">
                    <SearchX size={40} className="text-muted-foreground/40" strokeWidth={1.5} />
                </div>
            </div>
            
            <AppleBadge variant="secondary" className="mb-6">Protocol Alert</AppleBadge>
            
            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                No Stream Detected
            </h3>
            
            <p className="text-sm font-medium text-muted-foreground mb-12 max-w-sm leading-relaxed">
                We couldn't locate any academic requirements matching your current filtering parameters. 
            </p>
            
            <AppleButton
                onClick={onReset}
                variant="primary"
                size="lg"
                className="h-14 px-10 shadow-apple-md"
            >
                Reset Parameters
            </AppleButton>
        </div>
    );
};

export default EmptyState;