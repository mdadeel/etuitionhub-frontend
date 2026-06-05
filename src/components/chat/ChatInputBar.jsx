import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Send, Smile, X, Loader2, List, Code, Check, CircleHelp, SendHorizontal, Loader } from 'lucide-react';
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
    sending = false,

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
            "bg-background relative z-40",
            compact ? "p-3" : "p-4 pb-6"
        )}>
            {/* Replying To Quote Preview Banner */}
            {replyingTo && (
                <div className="mb-3 mx-2 overflow-hidden">
                    <div className="px-3 py-2 bg-muted border-l-4 border-primary rounded-xl text-sm flex items-center justify-between gap-4 shadow-sm ring-1 ring-black/5">
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-primary tracking-wide uppercase">Replying to message</p>
                            <p className="text-muted-foreground truncate mt-0.5">{replyingTo.text}</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={onCancelReply}
                            className="size-7 flex items-center justify-center bg-background/50 hover:bg-background text-foreground rounded-full shadow-sm transition-all active:scale-90"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Editing Message Quote Preview Banner */}
            {editingMessage && (
                <div className="mb-3 mx-2 overflow-hidden">
                    <div className="px-3 py-2 bg-muted border-l-4 border-accent rounded-xl text-sm flex items-center justify-between gap-4 shadow-sm ring-1 ring-black/5">
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-accent tracking-wide uppercase">Editing message</p>
                            <p className="text-muted-foreground truncate mt-0.5">{editingMessage.text}</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={onCancelEdit}
                            className="size-7 flex items-center justify-center bg-background/50 hover:bg-background text-foreground rounded-full shadow-sm transition-all active:scale-90"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}



            {/* Emoji Selection Popover */}
            {showEmojiPicker && (
                <div 
                    ref={emojiTrayRef}
                    className="absolute bottom-full mb-4 left-4 z-50 bg-card border border-border shadow-2xl rounded-2xl p-3 grid grid-cols-8 gap-2 w-72 ring-1 ring-black/10"
                >
                    <div className="col-span-8 mb-1 px-1 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Quick Reactions</span>
                    </div>
                    {POPULAR_EMOJIS.map(emoji => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji)}
                            className="hover:bg-muted/80 p-1.5 text-xl rounded-xl flex items-center justify-center transition-all hover:scale-125 active:scale-90"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Composer */}
            <div className="flex items-end gap-2.5 max-w-5xl mx-auto w-full px-2">
                {/* Emoji Action (Left side) */}
                <div className="flex items-center shrink-0 mb-[2px]">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="size-9 rounded-full hover:bg-[color:hsl(var(--chat-hover))] text-muted-foreground/80 hover:text-foreground flex items-center justify-center transition-all active:scale-95"
                        title="Add Emoji"
                    >
                        <Smile size={20} strokeWidth={2.2} />
                    </button>
                </div>

                {/* Text Area & Mic Container */}
                <div className="flex-1 flex items-end gap-2 bg-muted/60 dark:bg-[#202124] border border-transparent rounded-[24px] focus-within:border-primary/20 focus-within:bg-background transition-all duration-300 px-3.5 py-1">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={1}
                        className={cn(
                            "flex-1 bg-transparent outline-none resize-none text-[14.5px] text-foreground placeholder:text-muted-foreground/50 leading-relaxed overflow-hidden py-1.5 min-h-[36px]",
                            compact ? "max-h-[80px]" : "max-h-[150px]"
                        )}
                    />
                    
                    {/* Voice Message Icon */}
                    <button
                        type="button"
                        className="shrink-0 size-8 flex items-center justify-center text-muted-foreground/80 hover:text-foreground hover:bg-muted/80 rounded-full transition-all active:scale-90 mb-[2px]"
                        title="Voice Message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    </button>
                </div>

                {/* Send Button */}
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!value.trim() || sending}
                    aria-label="Send message"
                    className={cn(
                        "shrink-0 flex items-center justify-center transition-all duration-300 mb-[2px] rounded-full active:scale-95",
                        value.trim() && !sending
                            ? "bg-[#0A7CFF] hover:bg-[#0070e3] text-white shadow-sm hover:scale-105"
                            : "bg-muted/50 text-muted-foreground/30 cursor-not-allowed",
                        "size-9"
                    )}
                >
                    {sending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal translate-x-[0.5px]"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatInputBar;
