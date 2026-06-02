import React, { useState, useRef, useEffect, memo } from 'react';
import { Smile, Reply, MoreHorizontal, Check, CheckCheck, Copy, Trash2, Edit2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactionTray from './ReactionTray';
import toast from 'react-hot-toast';

const MessageBubble = memo(({ 
    msg, 
    isMe, 
    myParticipantId,
    isConsecutivePrev, 
    isConsecutiveNext, 
    showAvatar, 
    otherParticipant, 
    handleReact,
    isLastInBlock,
    onReply,
    onEdit,
    onDelete
}) => {
    const [showReactionTray, setShowReactionTray] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [anchorRect, setAnchorRect] = useState(null);
    const [isHighlighted, setIsHighlighted] = useState(false);
    
    const moreMenuRef = useRef(null);
    const reactionBtnRef = useRef(null);
    const moreBtnRef = useRef(null);

    // Determine if message is edited (buffer of 5s)
    const isEdited = msg.isEdited || (msg.updatedAt && (new Date(msg.updatedAt) - new Date(msg.createdAt) > 5000));
    const isDeleted = msg.isDeleted;

    // Calculate dynamic border radii
    let roundedClass = "rounded-[22px]";
    if (isMe) {
        if (isConsecutivePrev && isConsecutiveNext) roundedClass = "rounded-[22px] rounded-r-[6px]";
        else if (isConsecutivePrev) roundedClass = "rounded-[22px] rounded-tr-[6px]";
        else if (isConsecutiveNext) roundedClass = "rounded-[22px] rounded-br-[6px]";
    } else {
        if (isConsecutivePrev && isConsecutiveNext) roundedClass = "rounded-[22px] rounded-l-[6px]";
        else if (isConsecutivePrev) roundedClass = "rounded-[22px] rounded-tl-[6px]";
        else if (isConsecutiveNext) roundedClass = "rounded-[22px] rounded-bl-[6px]";
    }

    const openMoreMenu = () => {
        if (isDeleted) return;
        const rect = moreBtnRef.current.getBoundingClientRect();
        const menuWidth = 180;
        const menuHeight = isMe ? 220 : 120;
        
        let top = rect.bottom + 8;
        let left = isMe ? rect.right - menuWidth : rect.left;

        if (top + menuHeight > window.innerHeight) {
            top = rect.top - menuHeight - 8;
        }
        if (left + menuWidth > window.innerWidth) {
            left = window.innerWidth - menuWidth - 12;
        }
        if (left < 12) left = 12;

        setMenuPosition({ top, left });
        setShowMoreMenu(true);
    };

    const openReactionTray = () => {
        if (isDeleted) return;
        setAnchorRect(reactionBtnRef.current.getBoundingClientRect());
        setShowReactionTray(true);
    };

    const handleOpenHistory = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('open-history', { detail: { messageId: msg._id } }));
    };

    useEffect(() => {
        if (!showMoreMenu) return;
        const handleEvents = (e) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
                setShowMoreMenu(false);
            }
        };
        const handleScroll = () => setShowMoreMenu(false);
        
        document.addEventListener('mousedown', handleEvents);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleEvents);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [showMoreMenu]);

    const scrollToMessage = (targetId) => {
        const el = document.getElementById(`msg-${targetId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Send event to highlight target
            const event = new CustomEvent('highlight-message', { detail: { messageId: targetId } });
            window.dispatchEvent(event);
        }
    };

    // Listen for highlight requests
    useEffect(() => {
        const handleHighlight = (e) => {
            if (e.detail.messageId === msg._id) {
                setIsHighlighted(true);
                setTimeout(() => setIsHighlighted(false), 2000);
            }
        };
        window.addEventListener('highlight-message', handleHighlight);
        return () => window.removeEventListener('highlight-message', handleHighlight);
    }, [msg._id]);

    const activeReactions = msg.reactions ? Object.values(msg.reactions) : [];
    const uniqueReactions = Array.from(new Set(activeReactions));
    const reactionCount = activeReactions.length;
    const myReaction = msg.reactions && myParticipantId ? msg.reactions[myParticipantId] : null;
    const hasReacted = !!myReaction;

    const handleBadgeClick = (e) => {
        e.stopPropagation();
        if (myReaction) handleReact(msg._id, myReaction);
        else handleReact(msg._id, activeReactions[0] || '👍');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(msg.text);
        toast.success("Message copied", {
            icon: '📋',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontSize: '13px'
            }
        });
        setShowMoreMenu(false);
    };

    const replySender = msg.replyTo
        ? (String(msg.replyTo.senderId) === String(msg.senderId)
            ? (isMe ? "You" : (otherParticipant?.displayName || "User"))
            : (isMe ? (otherParticipant?.displayName || "User") : "You"))
        : "";

    return (
        <div 
            id={`msg-${msg._id}`}
            className={cn(
                "flex items-end gap-2 w-full group/bubble relative transition-all duration-300",
                isMe ? "justify-end" : "justify-start",
                !isConsecutiveNext ? "mb-4" : "mb-1",
                isDeleted && "opacity-80",
                isHighlighted && "scale-[1.02]"
            )}
        >
            
            {!isMe && (
                <div className="w-8 shrink-0 flex justify-center mb-1">
                    {showAvatar ? (
                        <Avatar 
                            src={otherParticipant?.photoURL} 
                            alt={otherParticipant?.displayName || "User"}
                            size="sm" 
                            className={cn("size-8 shadow-sm ring-1 ring-black/5", isDeleted && "grayscale")}
                        />
                    ) : (
                        <div className="size-8" />
                    )}
                </div>
            )}

            <div className={cn("flex flex-col relative", isMe ? "items-end" : "items-start")} style={{ maxWidth: 'min(75%, 650px)' }}>
                
                {showReactionTray && !isDeleted && (
                    <ReactionTray 
                        anchorRect={anchorRect}
                        onReact={(emoji) => handleReact(msg._id, emoji)}
                        onClose={() => setShowReactionTray(false)}
                        isMe={isMe}
                    />
                )}

                <div className="relative flex items-center gap-2 group/actions">
                    {/* Hover Actions - Left for Me */}
                    {isMe && !isDeleted && (
                        <div className="opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 flex items-center gap-0.5 mr-1 translate-x-2 group-hover/bubble:translate-x-0">
                            <button 
                                type="button"
                                ref={moreBtnRef}
                                onClick={openMoreMenu}
                                className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90" 
                                title="More"
                                aria-label="More message options"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => onReply?.(msg)}
                                className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90" 
                                title="Reply"
                                aria-label="Reply to message"
                            >
                                <Reply size={16} />
                            </button>
                            <button 
                                type="button"
                                ref={reactionBtnRef}
                                onClick={openReactionTray}
                                className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90" 
                                title="React"
                                aria-label="Add reaction"
                            >
                                <Smile size={16} />
                            </button>
                        </div>
                    )}

                    <div 
                        className={cn(
                            "bubble-content px-4 py-2.5 text-[15px] shadow-sm relative leading-relaxed w-fit font-body transition-all duration-300 z-10",
                            roundedClass,
                            isMe 
                                ? (isDeleted ? "bg-muted text-muted-foreground border border-border/50" : "bg-primary text-primary-foreground ml-auto")
                                : (isDeleted ? "bg-muted/50 text-muted-foreground italic border border-border/30" : "bg-muted text-foreground mr-auto"),
                            isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20 scale-[1.05]",
                            isDeleted && "py-1.5 px-3 text-[13px]"
                        )}
                    >
                        {msg.replyTo && !isDeleted && (
                            <div 
                                onClick={() => scrollToMessage(msg.replyTo._id || msg.replyTo)}
                                className={cn(
                                    "mb-2 px-3 py-2 border-l-4 text-[13px] rounded-lg max-w-full truncate font-body cursor-pointer transition-all",
                                    isMe 
                                        ? "border-primary-foreground/40 bg-black/10 hover:bg-black/20 text-primary-foreground/90" 
                                        : "border-primary bg-background/50 hover:bg-background/80 text-muted-foreground"
                                )}
                            >
                                <span className="font-bold block text-[11px] mb-0.5 uppercase tracking-wider opacity-70">
                                    {msg.replyTo.isDeleted ? "Deleted Message" : replySender}
                                </span>
                                <span className="line-clamp-2 leading-tight">
                                    {msg.replyTo.isDeleted ? "This message was deleted" : msg.replyTo.text}
                                </span>
                            </div>
                        )}

                        <p className={cn("break-words whitespace-pre-wrap select-text", isDeleted && "italic text-muted-foreground/60")} style={{ overflowWrap: 'anywhere' }}>
                            {isDeleted ? "This message was deleted" : msg.text}
                        </p>
                        
                        {reactionCount > 0 && !isDeleted && (
                            <div 
                                onClick={handleBadgeClick}
                                className={cn(
                                    "absolute -bottom-4 bg-background shadow-md border rounded-full px-1.5 py-0.5 text-[12px] flex gap-0.5 items-center z-20 select-none cursor-pointer transition-all duration-200 ring-1 ring-black/5 hover:scale-110 active:scale-90",
                                    hasReacted ? "border-primary/30 bg-primary/[0.03]" : "border-border/50",
                                    isMe ? "right-2" : "left-2"
                                )}
                            >
                                {uniqueReactions.slice(0, 3).map((emoji, i) => (
                                    <span 
                                        key={i} 
                                        className="text-[13px] leading-none drop-shadow-sm"
                                    >
                                        {emoji}
                                    </span>
                                ))}
                                {reactionCount > 1 && (
                                    <span className="text-[11px] text-foreground font-bold font-body pl-1 pr-0.5">{reactionCount}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hover Actions - Right for Them */}
                    {!isMe && !isDeleted && (
                        <div className="opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 flex items-center gap-0.5 ml-1 -translate-x-2 group-hover/bubble:translate-x-0">
                            <button 
                                type="button"
                                ref={reactionBtnRef}
                                onClick={openReactionTray}
                                className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90" 
                                title="React"
                                aria-label="Add reaction"
                            >
                                <Smile size={16} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => onReply?.(msg)}
                                className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90" 
                                title="Reply"
                                aria-label="Reply to message"
                            >
                                <Reply size={16} />
                            </button>
                            <button 
                                type="button"
                                ref={moreBtnRef}
                                onClick={openMoreMenu}
                                className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90" 
                                title="More"
                                aria-label="More message options"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    )}
                </div>
                
                {isLastInBlock && (
                    <div className={cn(
                        "flex items-center gap-1.5 mt-1.5 opacity-0 group-hover/bubble:opacity-100 transition-all duration-300", 
                        (reactionCount > 0 && !isDeleted) ? "mt-5" : "",
                        isMe ? "mr-1" : "ml-1"
                    )}>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold tracking-tight uppercase">
                            {isEdited && !isDeleted && (
                                <button 
                                    type="button"
                                    onClick={handleOpenHistory}
                                    className="hover:text-primary transition-colors italic lowercase opacity-80 cursor-help flex items-center gap-0.5 group/edited"
                                >
                                    (edited)
                                    <span className="w-0 overflow-hidden group-hover/edited:w-auto transition-all"> history</span>
                                </button>
                            )}
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {isMe && !isDeleted && (
                            <span className={cn(msg.isRead ? "text-primary" : "text-muted-foreground/50")}>
                                {msg.isRead ? <CheckCheck size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Fixed Positioning "More" Menu */}
            {showMoreMenu && (
                <div 
                    ref={moreMenuRef}
                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px`, position: 'fixed' }}
                    className="z-[1200] bg-background border border-border/60 shadow-2xl rounded-2xl py-2 min-w-[180px] ring-1 ring-black/5 overflow-hidden transition-all animate-in fade-in zoom-in duration-200"
                >
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="w-full text-left px-4 py-2.5 hover:bg-muted text-[14px] text-foreground transition-colors flex items-center gap-3 active:bg-muted/80"
                    >
                        <Copy size={16} className="text-muted-foreground" /> Copy Text
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onReply?.(msg);
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-muted text-[14px] text-foreground transition-colors flex items-center gap-3 active:bg-muted/80"
                    >
                        <Reply size={16} className="text-muted-foreground" /> Reply
                    </button>
                    {isMe && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    onEdit?.(msg);
                                    setShowMoreMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-muted text-[14px] text-foreground transition-colors flex items-center gap-3 active:bg-muted/80"
                            >
                                <Edit2 size={16} className="text-muted-foreground" /> Edit
                            </button>
                            <div className="h-px bg-border/40 my-1 mx-2" />
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete?.(msg._id);
                                    setShowMoreMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-destructive/10 text-[14px] text-destructive transition-colors flex items-center gap-3 font-medium active:bg-destructive/20"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

export default MessageBubble;
