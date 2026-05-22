import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ReactionTray = ({ onReact, onClose, isMe }) => {
    const trayRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (trayRef.current && !trayRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div 
            ref={trayRef}
            className={cn(
                "absolute -top-12 z-50 flex items-center gap-1 bg-card/95 backdrop-blur-sm border border-border shadow-xl rounded-full px-2 py-1.5 animate-in zoom-in-95 duration-200",
                isMe ? "right-0" : "left-0"
            )}
        >
            {EMOJIS.map(emoji => (
                <button 
                    key={emoji}
                    onClick={() => {
                        onReact(emoji);
                        onClose();
                    }}
                    className="hover:bg-muted p-1.5 rounded-full hover:scale-125 transition-all duration-200 text-xl leading-none flex items-center justify-center active:scale-95"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default ReactionTray;
