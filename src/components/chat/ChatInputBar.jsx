import React, { useRef, useState, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatInputBar = ({ value, onChange, onSend, onTyping, onStopTyping, placeholder = "Message...", compact = false }) => {
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const maxHeight = compact ? 80 : 120;
            textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
        }
    }, [value, compact]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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
        if (!value.trim()) return;
        onSend();
        // Clear typing
        if (isTyping && onStopTyping) {
            clearTimeout(typingTimeoutRef.current);
            setIsTyping(false);
            onStopTyping();
        }
    };

    return (
        <div className={cn(
            "border-t border-border bg-card/95 backdrop-blur-sm",
            compact ? "p-2" : "p-3 px-4"
        )}>
            <div className={cn(
                "flex items-end gap-2 bg-muted/70 border border-border/60 rounded-3xl transition-all duration-200",
                "focus-within:border-[#2563EB]/40 focus-within:bg-card focus-within:shadow-sm",
                compact ? "px-3 py-1.5" : "px-4 py-2"
            )}>
                <button
                    type="button"
                    className="shrink-0 text-muted-foreground hover:text-[#2563EB] transition-colors p-1 mb-0.5"
                    title="Emoji"
                >
                    <Smile size={compact ? 18 : 20} />
                </button>

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className={cn(
                        "flex-1 bg-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground/60 leading-relaxed overflow-hidden",
                        compact ? "text-[13px] py-0.5 max-h-[80px]" : "text-sm py-1 max-h-[120px]"
                    )}
                />

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!value.trim()}
                    className={cn(
                        "shrink-0 rounded-full flex items-center justify-center transition-all duration-200 mb-0.5",
                        value.trim()
                            ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:scale-105 active:scale-95"
                            : "text-muted-foreground/40 cursor-not-allowed",
                        compact ? "w-7 h-7" : "w-9 h-9"
                    )}
                    title="Send"
                >
                    <Send size={compact ? 13 : 15} className={value.trim() ? "translate-x-0.5" : ""} />
                </button>
            </div>
        </div>
    );
};

export default ChatInputBar;
