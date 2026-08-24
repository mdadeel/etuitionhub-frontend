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
            "bg-card border-t border-border shadow-sm relative z-40 transition-all duration-300",
            compact ? "p-3 pb-3.5" : "p-4 pb-6"
        )}>
            {/* Replying To Quote Preview Banner */}
            {replyingTo && (
                <div className="mb-3 mx-1 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                    <div className="px-3 py-2 bg-muted border-l-4 border-primary rounded-lg text-sm flex items-center justify-between gap-4 shadow-sm">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-primary tracking-wider uppercase">Replying to message</p>
                            <p className="text-muted-foreground truncate mt-0.5 text-xs">{replyingTo.text}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancelReply}
                            className="size-6 flex items-center justify-center bg-background hover:bg-muted text-muted-foreground rounded-full shadow-sm transition-all active:scale-90"
                        >
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* Editing Message Quote Preview Banner */}
            {editingMessage && (
                <div className="mb-3 mx-1 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                    <div className="px-3 py-2 bg-muted border-l-4 border-warning rounded-lg text-sm flex items-center justify-between gap-4 shadow-sm">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-warning tracking-wider uppercase">Editing message</p>
                            <p className="text-muted-foreground truncate mt-0.5 text-xs">{editingMessage.text}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="size-6 flex items-center justify-center bg-background hover:bg-muted text-muted-foreground rounded-full shadow-sm transition-all active:scale-90"
                        >
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* Emoji Selection Popover */}
            {showEmojiPicker && (
                <div
                    ref={emojiTrayRef}
                    className="absolute bottom-full mb-3 left-4 z-50 bg-popover border border-border shadow-md rounded-lg p-3 grid grid-cols-8 gap-2 w-72 animate-in zoom-in-95 duration-200"
                >
                    <div className="col-span-8 mb-1 px-1 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quick Reactions</span>
                    </div>
                    {POPULAR_EMOJIS.map(emoji => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji)}
                            className="hover:bg-muted p-1.5 text-xl rounded-lg flex items-center justify-center transition-all active:scale-90"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Composer */}
            <div className="flex items-center gap-2.5 max-w-5xl mx-auto w-full px-1">
                {/* Emoji Action (Left side) */}
                <div className="flex items-center shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="size-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-200 active:scale-95"
                        title="Add Emoji"
                    >
                        <Smile size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Text Area Container (No Voice/Mic) */}
                <div className="flex-1 flex items-end bg-muted border border-border rounded-lg focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200 px-4 py-1.5">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={1}
                        className={cn(
                            "flex-1 bg-transparent outline-none resize-none text-[14.5px] text-foreground placeholder:text-muted-foreground leading-relaxed overflow-hidden py-1 min-h-[34px]",
                            compact ? "max-h-[80px]" : "max-h-[150px]"
                        )}
                    />
                </div>

                {/* Send Button */}
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!value.trim() || sending}
                    aria-label="Send message"
                    className={cn(
                        "shrink-0 flex items-center justify-center transition-all duration-200 rounded-full active:scale-90",
                        value.trim() && !sending
                            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed",
                        "size-9"
                    )}
                >
                    {sending ? (
                        <Loader2 size={16} className="animate-spin text-muted-foreground" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal translate-x-[0.5px]"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatInputBar;
