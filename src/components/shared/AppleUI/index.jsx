import React from 'react';
import { cn } from '@/lib/utils';

/**
 * AppleCard: A glassmorphic card with subtle depth and smooth transitions.
 */
export const AppleCard = ({ children, className, hover = true, ...props }) => (
    <div 
        className={cn(
            "bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.05] shadow-sm rounded-3xl overflow-hidden transition-all duration-300",
            hover && "hover:bg-white/90 dark:hover:bg-black/50 hover:shadow-md hover:border-black/[0.08] dark:hover:border-white/[0.1]",
            className
        )}
        {...props}
    >
        {children}
    </div>
);

/**
 * AppleButton: A clean, rounded button with human-centric interactions.
 */
export const AppleButton = ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md',
    ...props 
}) => {
    const variants = {
        primary: "bg-black dark:bg-white text-white dark:text-black hover:opacity-90",
        secondary: "bg-black/[0.05] dark:bg-white/[0.1] text-black dark:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.15]",
        outline: "bg-transparent border border-black/[0.1] dark:border-white/[0.1] text-black dark:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.05]",
        ghost: "bg-transparent text-black dark:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-5 py-2.5 text-sm rounded-xl",
        lg: "px-8 py-3.5 text-base rounded-2xl"
    };

    return (
        <button 
            className={cn(
                "font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

/**
 * AppleInput: Minimalist input fields focused on clarity.
 */
export const AppleInput = ({ label, error, className, ...props }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="text-xs font-semibold text-black/50 dark:text-white/50 ml-1">{label}</label>}
        <input 
            className={cn(
                "w-full bg-black/[0.03] dark:bg-white/[0.05] border-none ring-1 ring-black/[0.05] dark:ring-white/[0.05] focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-black/40 transition-all duration-200 px-4 py-3 rounded-xl text-sm placeholder:text-black/30 dark:placeholder:text-white/30",
                error && "ring-red-500/50",
                className
            )}
            {...props}
        />
        {error && <p className="text-[10px] text-red-500 ml-1">{error}</p>}
    </div>
);

/**
 * AppleBadge: Subtle tag for status or roles.
 */
export const AppleBadge = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: "bg-black/[0.05] dark:bg-white/[0.1] text-black/70 dark:text-white/70",
        success: "bg-green-500/10 text-green-600 dark:text-green-400",
        warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        error: "bg-red-500/10 text-red-600 dark:text-red-400",
        primary: "bg-primary/10 text-primary"
    };

    return (
        <span className={cn(
            "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border border-transparent",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

/**
 * AppleHeader: Human-centric header for pages.
 */
export const AppleHeader = ({ title, subtitle, badge, action }) => (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
            {badge && <div className="mb-2">{badge}</div>}
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-black/50 dark:text-white/50 max-w-xl">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </header>
);
