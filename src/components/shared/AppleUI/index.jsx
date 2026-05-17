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
            tonal ? "bg-[#F5F7FA] border-none" : "bg-white border border-[rgba(15,23,46,0.08)] shadow-sm",
            glass && !tonal && "bg-white/80 backdrop-blur-xl",
            "rounded-2xl md:rounded-3xl",
            hover && (tonal ? "hover:bg-[#EEF2F6]" : "hover:bg-white hover:shadow-md hover:border-[rgba(15,23,46,0.12)]"),
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
        primary: "bg-[#2563EB] text-white hover:opacity-90 shadow-sm",
        secondary: "bg-[#EEF2F6] text-[#111827] hover:bg-[#F5F7FA]",
        outline: "bg-transparent border border-[rgba(15,23,46,0.08)] text-[#111827] hover:bg-[#F5F7FA]",
        ghost: "bg-transparent text-[#111827] hover:bg-[#F5F7FA]",
        glass: "bg-white/40 backdrop-blur-md border border-[rgba(15,23,46,0.08)] text-[#111827] hover:bg-white/60"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-5 py-2.5 text-sm rounded-xl",
        lg: "px-8 py-3.5 text-base rounded-xl",
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
        {label && <label className="text-xs font-semibold text-[#5B6475] ml-1">{label}</label>}
        <input 
            className={cn(
                "w-full bg-[#F5F7FA] border border-[rgba(15,23,46,0.08)] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-200 px-4 py-3 rounded-xl text-sm placeholder:text-[#5B6475]/50",
                error && "ring-red-500/50",
                className
            )}
            {...props}
        />
        {error && <p className="text-xs text-red-600 ml-1">{error}</p>}
    </div>
);

/**
 * AppleBadge: Subtle tag for status or roles.
 */
export const AppleBadge = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: "bg-[#EEF2F6] text-[#111827]",
        success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        warning: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        error: "bg-red-500/10 text-red-600 border-red-500/20",
        primary: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
        muted: "bg-[#F5F7FA] text-[#5B6475] border-[rgba(15,23,46,0.08)]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white"
    };

    return (
        <span className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full border border-transparent shadow-sm whitespace-nowrap",
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
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#111827]">{title}</h1>
            {subtitle && <p className="text-sm md:text-lg text-[#5B6475] max-w-xl font-normal leading-relaxed">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </header>
);

