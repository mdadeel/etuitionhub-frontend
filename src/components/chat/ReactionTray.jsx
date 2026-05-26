import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ReactionTray = ({ onReact, onClose, anchorRect, isMe }) => {
    const trayRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!anchorRect) return;

        const trayWidth = 260; 
        const trayHeight = 48;
        
        let top = anchorRect.top - trayHeight - 12;
        let left = isMe 
            ? anchorRect.right - trayWidth + 10 
            : anchorRect.left - 10;

        // Viewport bounds check
        if (left < 10) left = 10;
        if (left + trayWidth > window.innerWidth - 10) {
            left = window.innerWidth - trayWidth - 10;
        }
        if (top < 10) {
            top = anchorRect.bottom + 12; // Flip to bottom if no space above
        }

        setPosition({ top, left });
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

    return (
        <motion.div 
            ref={trayRef}
            initial={{ opacity: 0, scale: 0.5, y: 10, x: isMe ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                mass: 0.8
            }}
            style={{ 
                top: `${position.top}px`, 
                left: `${position.left}px`,
                position: 'fixed'
            }}
            className={cn(
                "z-[1100] flex items-center gap-1.5 bg-background/90 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-full px-2.5 py-1.5 ring-1 ring-black/5"
            )}
        >
            {EMOJIS.map((emoji, index) => (
                <motion.button 
                    key={emoji}
                    whileHover={{ scale: 1.3, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => {
                        onReact(emoji);
                        onClose();
                    }}
                    className="w-10 h-10 rounded-full hover:bg-muted/50 transition-colors text-2xl leading-none flex items-center justify-center relative group"
                >
                    <span className="drop-shadow-sm select-none">{emoji}</span>
                    <span className="absolute -top-8 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize">
                        {emoji === '👍' ? 'Like' : emoji === '❤️' ? 'Love' : emoji === '😂' ? 'Haha' : emoji === '😮' ? 'Wow' : emoji === '😢' ? 'Sad' : 'Pray'}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
};

export default ReactionTray;
