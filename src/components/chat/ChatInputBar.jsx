import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Send, Smile, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const POPULAR_EMOJIS = ['😀', '😂', '🔥', '👍', '❤️', '👏', '🎉', '💡', '✨', '🙏', '🌟', '👀', '💯', '🤔', '💀', '🎈'];

const ChatInputBar = ({ 
    value, 
    onChange, 
    onSend, 
    onTyping, 
    onStopTyping, 
    replyingTo = null, 
    onCancelReply, 
    editingMessage = null,
    onCancelEdit,
    placeholder = "Message...", 
    compact = false,
    sending = false
}) => {
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const emojiTrayRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const maxHeight = compact ? 80 : 150;
            textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
        }
    }, [value, compact]);

    // Close emoji tray on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiTrayRef.current && !emojiTrayRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !sending) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e) => {
        onChange(e);

        // Typing indicator logic
        if (onTyping && !isTyping) {
            setIsTyping(true);
            onTyping();
        }
        if (onStopTyping) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                onStopTyping();
            }, 1500);
        }
    };

    const handleSend = () => {
        if (!value.trim() || sending) return;
        onSend();
        if (isTyping && onStopTyping) {
            clearTimeout(typingTimeoutRef.current);
            setIsTyping(false);
            onStopTyping();
        }
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const insertEmoji = useCallback((emoji) => {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        
        const newValue = before + emoji + after;
        onChange({ target: { value: newValue } });
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newPos = start + emoji.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
        setShowEmojiPicker(false);
    }, [value, onChange]);

    return (
        <div className={cn(
            "bg-background/95 backdrop-blur-xl relative z-40 border-t border-border/50",
            compact ? "p-3" : "p-4 pb-6"
        )}>
            <AnimatePresence>
                {/* Replying To Quote Preview Banner */}
                {replyingTo && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="mb-3 mx-2 overflow-hidden"
                    >
                        <div className="px-3 py-2 bg-muted border-l-4 border-primary rounded-xl text-sm flex items-center justify-between gap-4 shadow-sm ring-1 ring-black/5">
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-bold text-primary tracking-wide uppercase">Replying to message</p>
                                <p className="text-muted-foreground truncate mt-0.5">{replyingTo.text}</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={onCancelReply}
                                className="w-7 h-7 flex items-center justify-center bg-background/50 hover:bg-background text-foreground rounded-full shadow-sm transition-all active:scale-90"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Editing Message Quote Preview Banner */}
                {editingMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="mb-3 mx-2 overflow-hidden"
                    >
                        <div className="px-3 py-2 bg-muted border-l-4 border-accent rounded-xl text-sm flex items-center justify-between gap-4 shadow-sm ring-1 ring-black/5">
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-bold text-accent tracking-wide uppercase">Editing message</p>
                                <p className="text-muted-foreground truncate mt-0.5">{editingMessage.text}</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={onCancelEdit}
                                className="w-7 h-7 flex items-center justify-center bg-background/50 hover:bg-background text-foreground rounded-full shadow-sm transition-all active:scale-90"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Emoji Selection Popover */}
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div 
                        ref={emojiTrayRef}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full mb-4 left-4 z-50 bg-card border border-border shadow-2xl rounded-2xl p-3 grid grid-cols-8 gap-2 w-72 ring-1 ring-black/10"
                    >
                        <div className="col-span-8 mb-1 px-1 flex justify-between items-center">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Quick Reactions</span>
                        </div>
                        {POPULAR_EMOJIS.map(emoji => (
                            <motion.button
                                key={emoji}
                                whileHover={{ scale: 1.25 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => insertEmoji(emoji)}
                                className="hover:bg-muted/80 p-1.5 text-xl rounded-xl flex items-center justify-center transition-colors"
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-end gap-3 max-w-5xl mx-auto">
                <div className={cn(
                    "flex-1 flex items-end gap-2 bg-muted/40 hover:bg-muted/60 border border-transparent focus-within:border-primary/20 focus-within:bg-background focus-within:shadow-sm rounded-[24px] transition-all duration-300 px-3",
                    compact ? "py-1.5" : "py-2"
                )}>
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary transition-all active:scale-90 mb-[2px]"
                    >
                        <Smile size={22} strokeWidth={2.2} />
                    </button>
     
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={1}
                        className={cn(
                            "flex-1 bg-transparent outline-none resize-none text-[15px] text-foreground placeholder:text-muted-foreground/60 leading-relaxed overflow-hidden py-[7px] min-h-[40px]",
                            compact ? "max-h-[80px]" : "max-h-[150px]"
                        )}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: !sending && value.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: !sending && value.trim() ? 0.9 : 1 }}
                    type="button"
                    onClick={handleSend}
                    disabled={!value.trim() || sending}
                    aria-label="Send message"
                    className={cn(
                        "shrink-0 flex items-center justify-center transition-all duration-300 mb-0.5 rounded-full shadow-sm",
                        value.trim() && !sending
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground/40 cursor-not-allowed",
                        compact ? "w-10 h-10" : "w-11 h-11"
                    )}
                >
                    {sending ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} className="translate-x-[1px] -translate-y-[1px]" strokeWidth={2.5} />
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default ChatInputBar;
