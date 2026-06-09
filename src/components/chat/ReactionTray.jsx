import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ReactionTray = ({ onReact, onClose, anchorRect, isMe }) => {
    const trayRef = useRef(null);
    
    // Pre-calculate position to avoid initial jump from 0,0
    const getCalculatedPosition = () => {
        if (!anchorRect) return { top: 0, left: 0, flipped: false };
        const trayWidth = 240; 
        const trayHeight = 40;
        let top = anchorRect.top - trayHeight - 8;
        let flipped = false;
        let left = isMe ? anchorRect.right - trayWidth + 4 : anchorRect.left - 4;

        if (left < 10) left = 10;
        if (left + trayWidth > window.innerWidth - 10) left = window.innerWidth - trayWidth - 10;
        if (top < 10) { top = anchorRect.bottom + 8; flipped = true; }
        return { top, left, flipped };
    };

    const initial = getCalculatedPosition();
    const [position, setPosition] = useState({ top: initial.top, left: initial.left });
    const [isFlipped, setIsFlipped] = useState(initial.flipped);

    useEffect(() => {
        const pos = getCalculatedPosition();
        setPosition({ top: pos.top, left: pos.left });
        setIsFlipped(pos.flipped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchorRect, isMe]);

    useEffect(() => {
        const handleEvents = (e) => {
            if (trayRef.current && !trayRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleEvents);
        window.addEventListener('scroll', handleScroll, true);
        
        return () => {
            document.removeEventListener('mousedown', handleEvents);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    if (!anchorRect) return null;

    const originY = isFlipped ? 'top' : 'bottom';
    const originX = isMe ? 'right' : 'left';

    return (
        <div 
            ref={trayRef}
            style={{ 
                top: `${position.top}px`, 
                left: `${position.left}px`,
                position: 'fixed',
                transformOrigin: `${originY} ${originX}`
            }}
            className={cn(
                "z-[1100] flex items-center gap-1 bg-background/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-full px-1 py-1 ring-1 ring-black/5 tray-animate"
            )}
        >
            <style>
                {`
                @keyframes tray-pop {
                    0% { transform: scale(0.4); opacity: 0; }
                    70% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .tray-animate {
                    animation: tray-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes emoji-pop {
                    0% { transform: scale(0) translateY(15px); opacity: 0; }
                    60% { transform: scale(1.2) translateY(-4px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                .emoji-animate {
                    animation: emoji-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    opacity: 0;
                }
                `}
            </style>
            {EMOJIS.map((emoji, index) => (
                <button 
                    key={emoji}
                    type="button"
                    style={{ animationDelay: `${index * 40}ms` }}
                    onClick={() => {
                        onReact(emoji);
                        onClose();
                    }}
                    className="emoji-animate size-9 rounded-full hover:bg-muted/60 transition-all text-xl leading-none flex items-center justify-center relative group hover:scale-125 active:scale-95"
                >
                    <span className="drop-shadow-sm select-none">{emoji}</span>
                    <span className="absolute -top-7 bg-foreground/90 text-background text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize">
                        {emoji === '👍' ? 'Like' : emoji === '❤️' ? 'Love' : emoji === '😂' ? 'Haha' : emoji === '😮' ? 'Wow' : emoji === '😢' ? 'Sad' : 'Pray'}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ReactionTray;
