import React from 'react';
import { SearchX, RefreshCw } from "lucide-react";
import { AppleButton } from "./AppleUI";
import { cn } from "@/lib/utils";

/**
 * Unified EmptyState component for consistent messaging across the app.
 */
const EmptyState = ({ 
    title = 'No Results Found',
    message = 'We couldn\'t find what you were looking for. Please try adjusting your filters.', 
    onAction, 
    actionLabel = 'Reset Filters',
    variant = 'card', // 'card' or 'minimal'
    className
}) => {
    if (variant === 'minimal') {
        return (
            <div className={cn("flex flex-col items-center justify-center py-20 px-6 text-center", className)}>
                <SearchX size={40} className="text-muted-foreground mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-xs">{message}</p>
                {onAction && (
                    <AppleButton variant="secondary" size="md" onClick={onAction}>
                        {actionLabel}
                    </AppleButton>
                )}
            </div>
        );
    }

    return (
        <div className={cn(
            "text-center py-24 bg-muted/20 border border-dashed border-border rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 hover:bg-muted/30",
            className
        )}>
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="size-20 bg-background border border-border shadow-apple-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <SearchX size={32} className="text-muted-foreground group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                </div>
                
                <span className="mb-4 px-3 py-1 bg-muted/50 text-muted-foreground rounded-full text-[10px] font-bold uppercase tracking-widest border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    Empty Result
                </span>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">{title}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-10 max-w-xs mx-auto leading-relaxed">
                    {message}
                </p>
                
                {onAction && (
                    <AppleButton
                        variant="secondary"
                        size="md"
                        className="shadow-apple-sm h-11 px-8 rounded-xl"
                        onClick={onAction}
                    >
                        <RefreshCw size={14} className="mr-2 opacity-50 group-hover:rotate-180 transition-transform duration-700" />
                        {actionLabel}
                    </AppleButton>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
