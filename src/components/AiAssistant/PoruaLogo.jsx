import React from 'react';

/**
 * PoruaLogo Component
 * Renders either the full horizontal logo (using the generated brand PNG)
 * or a clean, modern vector SVG of the butterfly-book icon.
 */
export default function PoruaLogo({ className = '', iconOnly = false, size = 20 }) {
    if (iconOnly) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                {/* Left page / butterfly wing */}
                <path
                    d="M12 21C8 20.5 4 19 4 13.5C4 9.5 7.5 5 12 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 17.5C9.5 17 6.5 16 6.5 13.5C6.5 11.5 9 8 12 6.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                />
                
                {/* Right page / butterfly wing */}
                <path
                    d="M12 21C16 20.5 20 19 20 13.5C20 9.5 16.5 5 12 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 17.5C14.5 17 17.5 16 17.5 13.5C17.5 11.5 14 8 12 6.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                />
                
                {/* Antennae */}
                <path
                    d="M12 4.5C11.5 3.5 10.5 3 9.5 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M12 4.5C12.5 3.5 13.5 3 14.5 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                
                {/* Center book binding / body */}
                <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    return (
        <img
            src="/porua_logo.png"
            alt="Porua"
            style={{ height: size }}
            className={`object-contain ${className}`}
        />
    );
}
