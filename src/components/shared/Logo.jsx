import React from 'react';
import { cn } from '@/lib/utils';

const Logo = ({ 
    className, 
    iconSize = "size-7", 
    boxSize = "size-11", 
    textSize = "text-2xl", 
    variant = "default", // "default", "light", "dark-box"
    showText = true 
}) => {
    // default: blue box, text-foreground, BD-primary
    // light: white box, text-white, BD-white
    // dark-box: blue box, text-white, BD-white (good for dark footers)

    return (
        <div className={cn("flex items-center gap-3 shrink-0", className)}>
            <div className={cn(
                "rounded-lg flex items-center justify-center shadow-sm transition-all duration-300",
                boxSize,
                variant === "light" ? "bg-white" : "bg-primary"
            )}>
                {/* Custom Educational Tech Logo Mark */}
                <svg 
                    className={cn(
                        variant === "light" ? "text-primary" : "text-white", 
                        iconSize
                    )}
                    viewBox="25 23 50 54" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Graduation Cap Mortarboard (Top) */}
                    <path 
                        d="M 36.5 25.5 L 56.5 24.8 C 57 24.8, 57.5 25, 57.8 25.4 L 71.5 38 C 72 38.5, 71.8 39.2, 71.2 39.3 L 62.5 39.8 C 62 39.8, 61.5 39.6, 61.2 39.2 L 36.2 27 C 35.6 26.7, 35.8 25.8, 36.5 25.5 Z" 
                        fill="currentColor" 
                    />

                    {/* Graduation Cap Skullcap & Transition */}
                    <path 
                        d="M 43.5 32 C 43.5 32, 42.5 36, 47 39 C 52 42, 59 40, 61 36 L 61 31.5 C 61 31.5, 52 35.5, 43.5 32 Z" 
                        fill="currentColor" 
                    />

                    {/* Sweeping 'e' Loop & Book Bottom Spine */}
                    <path 
                        d="M 42 36.5 C 34.5 40.5, 27 49, 27.2 59.5 C 27.4 70.5, 36 75.5, 46.5 75.2 C 51.5 75, 60.5 72, 73 64.5 C 73.5 64.2, 73.2 63.5, 72.6 63.5 C 63.5 63.5, 53.5 66.5, 46.5 68 C 36.5 70, 32.5 63, 32.2 57.5 C 32 50.5, 38.5 42, 54.5 40.5 C 61 40, 61 36, 54.5 36.5 C 48.5 37, 44 36.2, 42 36.5 Z" 
                        fill="currentColor" 
                    />

                    {/* Tassel (Gold/Amber Accent) */}
                    <path 
                        d="M 64.5 32 C 66.5 32, 68 35, 68 38 C 68 40, 66.5 42.5, 64.8 45.5 C 64 47, 62.5 48.5, 62.5 49 C 62.5 49.5, 63.5 49, 64 48 C 65.5 45.5, 67.8 41, 68 38 C 68.2 34.5, 66.5 31.5, 64.5 32 Z" 
                        fill="#f59e0b" 
                    />
                    <circle cx="62.5" cy="49" r="1.5" fill="#f59e0b" />

                    {/* Book Pages - 3 Fanning Leaves (Gold/Amber Accent) */}
                    {/* Leaf 1 (Top page) */}
                    <path 
                        d="M 46.5 68 C 49 63.5, 56.5 52, 65 52.2 C 65.5 52.2, 65.5 52.8, 65 53 C 59.5 55.5, 51.5 64, 46.5 68 Z" 
                        fill="#f59e0b" 
                    />
                    {/* Leaf 2 (Middle page) */}
                    <path 
                        d="M 46.5 68 C 50.5 64.5, 59.5 56.5, 69.5 56.8 C 70 56.8, 70 57.4, 69.5 57.6 C 62.5 60.5, 53.5 65.5, 46.5 68 Z" 
                        fill="#f59e0b" 
                    />
                    {/* Leaf 3 (Bottom page) */}
                    <path 
                        d="M 46.5 68 C 52 66, 62.5 61, 72.5 61.2 C 73 61.2, 73 61.8, 72.5 62 C 65 64.5, 55 66.8, 46.5 68 Z" 
                        fill="#f59e0b" 
                    />
                </svg>
            </div>
            
            {showText && (
                <span className={cn(
                    "font-heading tracking-tight transition-colors duration-300",
                    textSize,
                    (variant === "light" || variant === "dark-box") ? "text-white" : "text-foreground"
                )}>
                    e-tuition<span className={(variant === "light" || variant === "dark-box") ? "text-white" : "text-primary"}>BD</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
