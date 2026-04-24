import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * AppleCard: A glassmorphic card with subtle depth and smooth transitions.
 */
export const AppleCard = ({ children, className, hover = true, moveOnHover = false, glass = true, tonal = false, onClick, ...props }) => (
    <motion.div 
        whileHover={hover ? { y: moveOnHover ? -4 : 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } } : {}}
        className={cn(
            "relative overflow-hidden transition-all duration-300",
            tonal ? "bg-apple-gray-100 border-none" : "bg-card border border-border shadow-sm",
            glass && !tonal && "bg-card/80 backdrop-blur-xl",
            "rounded-[2rem]",
            hover && (tonal ? "hover:bg-apple-gray-200" : "hover:bg-card/90 hover:shadow-apple-lg hover:border-border/80"),
            className
        )}
        onClick={onClick}
        {...props}
    >
        {children}
    </motion.div>
);


/**
 * AppleButton: A clean, rounded button with human-centric interactions.
 */
export const AppleButton = ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md',
    asChild = false,
    ...props 
}) => {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        glass: "bg-background/40 backdrop-blur-md border border-white/10 text-foreground hover:bg-background/60"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-5 py-2.5 text-sm rounded-xl",
        lg: "px-8 py-3.5 text-base rounded-2xl",
        icon: "p-2 rounded-full"
    };

    const combinedClassName = cn(
        "font-semibold transition-all duration-200 active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
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
            className={combinedClassName}
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
        {label && <label className="text-xs font-semibold text-muted-foreground ml-1">{label}</label>}
        <input 
            className={cn(
                "w-full bg-muted/50 border-none ring-1 ring-border focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all duration-200 px-4 py-3 rounded-xl text-sm placeholder:text-muted-foreground/50",
                error && "ring-destructive/50",
                className
            )}
            {...props}
        />
        {error && <p className="text-[10px] text-destructive ml-1">{error}</p>}
    </div>
);

/**
 * AppleBadge: Subtle tag for status or roles.
 */
export const AppleBadge = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        error: "bg-destructive/10 text-destructive border-destructive/20",
        primary: "bg-primary/10 text-primary border-primary/20",
        muted: "bg-muted/50 text-muted-foreground border-border/50",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white"
    };

    return (
        <span className={cn(
            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border border-transparent shadow-sm whitespace-nowrap",
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-sm md:text-base text-muted-foreground max-w-xl font-medium">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </header>
);

