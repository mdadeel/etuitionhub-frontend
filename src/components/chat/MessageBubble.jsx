import React, { useState, useRef, useEffect, memo } from 'react';
import { Smile, Reply, MoreHorizontal, Check, CheckCheck, Copy, Trash2, Edit2, Code, List, CheckCircle, CircleHelp, SendHorizontal, Trophy } from 'lucide-react';
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
    onReply,
    onEdit,
    onDelete,
    onViewPoll,
    onViewAssignment,
    onCopyCode
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
        const menuHeight = isMe ? 180 : 120;
        
        let top = rect.bottom + 4;
        let left = isMe ? rect.right - menuWidth : rect.left;

        if (top + menuHeight > window.innerHeight) {
            top = rect.top - menuHeight - 4;
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
        navigator.clipboard.writeText(msg.text || '');
        toast.success('Text copied to clipboard');
        setShowMoreMenu(false);
    };

    const handleCopyCode = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (onCopyCode) {
            onCopyCode(msg.text);
        } else {
            navigator.clipboard.writeText(msg.text || '');
            toast.success('Code copied to clipboard');
        }
    };

    const replySender = msg.replyTo
        ? (String(msg.replyTo.senderId) === String(msg.senderId)
            ? (isMe ? "You" : (otherParticipant?.displayName || "User"))
            : (isMe ? (otherParticipant?.displayName || "User") : "You"))
        : "";

    // Format-specific rendering helpers
    const renderFormattedContent = () => {
        const { text, format } = msg;
        
        if (format === 'code') {
            return (
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 my-2">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-primary">Code Block</span>
                        <button
                            onClick={handleCopyCode}
                            className="text-xs text-muted-foreground hover:text-primary hover:underline font-semibold"
                        >
                            Copy Code
                        </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs font-mono text-foreground">{text}</pre>
                </div>
            );
        }
        
        if (format === 'formula') {
            return (
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 my-2 text-center">
                    <span className="text-xs font-medium text-primary">Mathematical Formula</span>
                    <div className="mt-2 text-xl font-mono text-primary">{text}</div>
                </div>
            );
        }
        
        if (format === 'quote') {
            return (
                <div className="border-l-4 border-primary/50 pl-3 italic text-muted-foreground my-1.5">
                    {text}
                </div>
            );
        }
        
        if (format === 'list') {
            const items = text.split('\n').filter(item => item.trim());
            return (
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 my-2">
                    <span className="text-xs font-medium text-primary">List</span>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-foreground">
                        {items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        
        // Default plain text
        return (
            <p className="text-[14.5px] text-foreground whitespace-pre-wrap">{text}</p>
        );
    };

    // Render milestone indicator
    const renderMilestoneIndicator = () => {
        if (!msg.isMilestone) return null;
        
        return (
            <div className="flex items-center gap-1.5 mb-1.5">
                <Trophy size={16} className="text-primary" />
                <span className="text-xs font-semibold text-primary">Learning Milestone</span>
            </div>
        );
    };

    // Render poll preview
    const renderPollPreview = () => {
        if (!msg.pollId) return null;
        
        return (
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 my-1.5 cursor-pointer" onClick={() => onViewPoll && onViewPoll(msg.pollId)}>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-primary">Poll</span>
                    <CircleHelp size={14} className="text-primary/50" />
                </div>
                <p className="text-xs text-muted-foreground">{msg.text.substring(0, 100)}{msg.text.length > 100 ? '...' : ''}</p>
            </div>
        );
    };

    // Render assignment preview
    const renderAssignmentPreview = () => {
        if (!msg.assignmentId) return null;
        
        let statusClass = 'text-muted-foreground';
        let statusIcon = Check;
        if (msg.status === 'submitted') {
            statusClass = 'text-warning';
        } else if (msg.status === 'graded') {
            statusClass = 'text-success';
            statusIcon = CheckCheck;
        } else if (msg.status === 'returned') {
            statusClass = 'text-error';
            statusIcon = SendHorizontal;
        }
        
        const StatusIconComp = statusIcon;
        
        return (
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 my-1.5 cursor-pointer" onClick={() => onViewAssignment && onViewAssignment(msg.assignmentId)}>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-primary">Assignment</span>
                    <List size={14} className="text-primary/50" />
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                    {msg.title && <span className="font-semibold">{msg.title}</span>}
                    <span className={`${statusClass} ml-1 flex items-center gap-0.5`}>
                        <StatusIconComp size={12} />
                        {msg.status === 'submitted' && ' Submitted'}
                        {msg.status === 'graded' && ' Graded'}
                        {msg.status === 'returned' && ' Returned'}
                        {msg.status === 'pending' && ' Pending'}
                    </span>
                </div>
                {msg.dueDate && (
                    <div className="mt-1 text-[10px] text-muted-foreground">
                        Due: {new Date(msg.dueDate).toLocaleDateString()}
                    </div>
                )}
            </div>
        );
    };

    // Render tags
    const renderTags = () => {
        const tags = msg.tags || [];
        if (tags.length === 0) return null;
        
        return (
            <div className="flex flex-wrap gap-1 mt-1.5">
                {tags.map((tag, index) => (
                    <button
                        key={index}
                        type="button"
                        className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20"
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div 
            id={`msg-${msg._id}`}
            className={cn(
                "flex items-end gap-2 w-full group/bubble relative",
                isMe ? "justify-end" : "justify-start",
                reactionCount > 0 ? "mb-3" : (!isConsecutiveNext ? "mb-3" : "mb-0.5"),
                isDeleted && "opacity-80",
                (showReactionTray || showMoreMenu) ? "z-[60]" : "hover:z-50"
            )}
        >
            {!isMe && (
                <div className="w-8 shrink-0 flex justify-center mb-0.5">
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
                        <div className={cn(
                            "flex items-center gap-0.5 mr-1 transition-opacity duration-150",
                            (showReactionTray || showMoreMenu) ? "opacity-100" : "opacity-0 group-hover/bubble:opacity-100"
                        )}>
                            <button 
                                type="button"
                                ref={moreBtnRef}
                                onClick={openMoreMenu}
                                className="size-7 flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full active:bg-muted/80" 
                                title="More"
                                aria-label="More message options"
                            >
                                <MoreHorizontal size={14} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => onReply?.(msg)}
                                className="size-7 flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full active:bg-muted/80" 
                                title="Reply"
                                aria-label="Reply to message"
                            >
                                <Reply size={14} />
                            </button>
                            <button 
                                type="button"
                                ref={reactionBtnRef}
                                onClick={openReactionTray}
                                className="size-7 flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full active:bg-muted/80" 
                                title="React"
                                aria-label="Add reaction"
                            >
                                <Smile size={14} />
                            </button>
                        </div>
                    )}

                    <div 
                        className={cn(
                            "bubble-content px-4 py-2.5 text-[15px] relative leading-relaxed w-fit font-body z-10 flex flex-col gap-1.5",
                            roundedClass,
                            isMe 
                                ? (isDeleted ? "bg-muted text-muted-foreground border border-border/50" : "bg-[#0A7CFF] text-white ml-auto")
                                : (isDeleted ? "bg-muted/50 text-muted-foreground italic border border-border/30" : "bg-[#E4E6EB] dark:bg-[#303030] text-black dark:text-white mr-auto"),
                            isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20",
                            isDeleted && "py-1.5 px-3 text-[13px]"
                        )}
                    >
                        {msg.replyTo && !isDeleted && (
                            <div 
                                onClick={() => scrollToMessage(msg.replyTo._id || msg.replyTo)}
                                className={cn(
                                    "mb-1 px-3 py-1.5 border-l-4 text-xs rounded-lg max-w-full truncate font-body cursor-pointer",
                                    isMe 
                                        ? "border-primary-foreground/40 bg-black/10 hover:bg-black/20 text-primary-foreground/90" 
                                        : "border-primary bg-background/50 hover:bg-background/80 text-muted-foreground"
                                )}
                            >
                                <span className="font-bold block text-[10px] mb-0.5 uppercase tracking-wider opacity-70">
                                    {msg.replyTo.isDeleted ? "Deleted Message" : replySender}
                                </span>
                                <span className="line-clamp-2 leading-tight">
                                    {msg.replyTo.isDeleted ? "This message was deleted" : msg.replyTo.text}
                                </span>
                            </div>
                        )}

                        {!isDeleted && renderMilestoneIndicator()}

                        <div className={cn("break-words select-text", isDeleted && "italic text-muted-foreground/60")} style={{ overflowWrap: 'anywhere' }}>
                            {isDeleted ? "This message was deleted" : renderFormattedContent()}
                        </div>

                        {!isDeleted && renderPollPreview()}
                        {!isDeleted && renderAssignmentPreview()}
                        {!isDeleted && renderTags()}
                        
                        {/* Time & Read Checks */}
                        <div className={cn(
                            "flex items-center justify-end gap-1 mt-0.5 self-end text-[10px] select-none font-semibold tracking-tight",
                            isMe ? "text-primary-foreground/85" : "text-muted-foreground/80"
                        )}>
                            {isEdited && !isDeleted && (
                                <button 
                                    type="button"
                                    onClick={handleOpenHistory}
                                    className="hover:underline italic lowercase opacity-80 cursor-help"
                                >
                                    (edited)
                                </button>
                            )}
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && !isDeleted && (
                                <span className="shrink-0">
                                    {msg.isRead ? <CheckCheck size={13} strokeWidth={3} /> : <Check size={13} strokeWidth={3} />}
                                </span>
                            )}
                        </div>

                        {reactionCount > 0 && !isDeleted && (
                            <div 
                                onClick={handleBadgeClick}
                                className={cn(
                                    "absolute -bottom-2.5 bg-card border border-border/50 shadow-md rounded-full px-1.5 py-0.5 text-[11px] flex gap-0.5 items-center z-20 select-none cursor-pointer hover:scale-105 active:scale-95",
                                    hasReacted ? "border-primary/40 bg-primary/5 text-primary" : "border-border/60 text-foreground",
                                    isMe ? "right-3" : "left-3"
                                )}
                            >
                                {uniqueReactions.slice(0, 3).map((emoji, i) => (
                                    <span 
                                        key={i} 
                                        className="text-[12px] leading-none drop-shadow-sm select-none"
                                    >
                                        {emoji}
                                    </span>
                                ))}
                                {reactionCount > 1 && (
                                    <span className="text-[10px] text-muted-foreground font-semibold font-body pl-0.5 pr-0.5">{reactionCount}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hover Actions - Right for Them */}
                    {!isMe && !isDeleted && (
                        <div className={cn(
                            "flex items-center gap-0.5 ml-1 transition-opacity duration-150",
                            (showReactionTray || showMoreMenu) ? "opacity-100" : "opacity-0 group-hover/bubble:opacity-100"
                        )}>
                            <button 
                                type="button"
                                ref={reactionBtnRef}
                                onClick={openReactionTray}
                                className="size-7 flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full active:bg-muted/80" 
                                title="React"
                                aria-label="Add reaction"
                            >
                                <Smile size={14} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => onReply?.(msg)}
                                className="size-7 flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full active:bg-muted/80" 
                                title="Reply"
                                aria-label="Reply to message"
                            >
                                <Reply size={14} />
                            </button>
                            <button 
                                type="button"
                                ref={moreBtnRef}
                                onClick={openMoreMenu}
                                className="size-7 flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full active:bg-muted/80" 
                                title="More"
                                aria-label="More message options"
                            >
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Positioning "More" Menu */}
            {showMoreMenu && (
                <div 
                    ref={moreMenuRef}
                    style={{ 
                        top: `${menuPosition.top}px`, 
                        left: `${menuPosition.left}px`, 
                        position: 'fixed',
                        transformOrigin: isMe ? 'top right' : 'top left'
                    }}
                    className="z-[1200] bg-background/95 backdrop-blur-xl border border-border/40 shadow-xl rounded-xl py-1.5 min-w-[150px] ring-1 ring-black/5 overflow-hidden"
                >
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="w-full text-left px-3 py-1.5 hover:bg-muted text-[13px] text-foreground flex items-center gap-2.5 active:bg-muted/80"
                    >
                        <Copy size={14} className="text-muted-foreground" /> Copy Text
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onReply?.(msg);
                            setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-muted text-[13px] text-foreground flex items-center gap-2.5 active:bg-muted/80"
                    >
                        <Reply size={14} className="text-muted-foreground" /> Reply
                    </button>
                    {isMe && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    onEdit?.(msg);
                                    setShowMoreMenu(false);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-muted text-[13px] text-foreground flex items-center gap-2.5 active:bg-muted/80"
                            >
                                <Edit2 size={14} className="text-muted-foreground" /> Edit
                            </button>
                            <div className="h-px bg-border/30 my-1 mx-1.5" />
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete?.(msg._id);
                                    setShowMoreMenu(false);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-destructive/10 text-[13px] text-destructive flex items-center gap-2.5 font-medium active:bg-destructive/20"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

export default MessageBubble;
