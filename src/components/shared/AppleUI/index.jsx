import React from 'react';
import { cn } from '@/lib/utils';

/**
 * AppleCard: A sharp-edged card with strong borders and visual depth.
 */
export const AppleCard = ({ children, className, hover = true, moveOnHover = false, glass = false, tonal = false, onClick, ...props }) => (
    <div 
        className={cn(
            "relative transition-all duration-300 rounded-none",
            tonal ? "bg-background border border-border/40" : "bg-card border border-border",
            glass && !tonal && "bg-card/90 backdrop-blur-md",
            hover && (tonal ? "hover:bg-muted" : "hover:border-[#2563EB]/40 hover:shadow-sm"),
            hover && moveOnHover && "hover:-translate-y-0.5",
            className
        )}
        onClick={onClick}
        {...props}
    >
        {children}
    </div>
);


/**
 * AppleButton: A sharp-edged button with strong contrast and editorial font style.
 */
export const AppleButton = ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md',
    asChild = false,
    type = 'button',
    ...props 
}) => {
    const variants = {
        primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF]",
        secondary: "bg-muted text-foreground border border-border hover:bg-muted/80",
        outline: "bg-transparent border border-foreground text-foreground hover:bg-foreground hover:text-background",
        ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        glass: "bg-card/60 backdrop-blur-md border border-border text-foreground hover:bg-card/80"
    };

    const sizes = {
        sm: "px-4 py-2 text-[10px] tracking-wider uppercase font-heading font-black",
        md: "px-6 py-3 text-xs tracking-widest uppercase font-heading font-black",
        lg: "px-8 py-4 text-xs tracking-[0.15em] uppercase font-heading font-black",
        icon: "p-2.5"
    };

    const combinedClassName = cn(
        "font-heading font-black rounded-none transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
    );

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: cn(combinedClassName, children.props.className),
            ...props
        });
    }

    return (
        <button 
            type={type}
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
};

/**
 * AppleInput: Sharp-edged input field focused on clarity and contrast.
 */
export const AppleInput = ({ label, error, className, ...props }) => (
    <div className="space-y-2 w-full">
        {label && <label className="text-[10px] font-heading font-black uppercase tracking-widest text-muted-foreground">{label}</label>}
        <input 
            className={cn(
                "w-full bg-card border border-border focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-all duration-200 px-4 py-3 rounded-none text-sm placeholder:text-muted-foreground/40",
                error && "border-red-500 focus:border-red-500",
                className
            )}
            {...props}
        />
        {error && <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-red-600">{error}</p>}
    </div>
);

/**
 * AppleBadge: Sharp-edged tag for status or roles with editorial typography.
 */
export const AppleBadge = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: "bg-muted text-foreground border-border",
        success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
        warning: "bg-orange-500/10 text-orange-700 border-orange-500/20",
        error: "bg-red-500/10 text-red-700 border-red-500/20",
        primary: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
        muted: "bg-background text-muted-foreground border-border",
        glass: "bg-card/10 backdrop-blur-md border border-white/20 text-white"
    };

    return (
        <span className={cn(
            "px-2.5 py-1 text-[10px] font-heading font-black uppercase tracking-wider rounded-none border shadow-none whitespace-nowrap",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

/**
 * AppleHeader: Redesigned header for pages featuring a bold vertical brand accent bar.
 */
export const AppleHeader = ({ title, subtitle, badge, action }) => (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
        <div className="flex gap-5 items-start">
            <div className="w-1.5 h-16 bg-[#2563EB] shrink-0 mt-1" />
            <div className="space-y-1.5">
                {badge && <div className="mb-1">{badge}</div>}
                <h1 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tight text-foreground">{title}</h1>
                {subtitle && <p className="text-xs md:text-sm text-muted-foreground max-w-xl font-normal leading-relaxed">{subtitle}</p>}
            </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </header>
);


