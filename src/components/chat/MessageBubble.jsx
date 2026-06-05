import React, { useState, useRef, useEffect, memo } from 'react';
import { Smile, Reply, MoreHorizontal, Check, CheckCheck, Copy, Trash2, Edit2, Code, List, CheckCircle, CircleHelp, SendHorizontal, Trophy } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactionTray from './ReactionTray';
import toast from 'react-hot-toast';

const MessageBubble = memo(({ 
    msg, 
    isMe, 
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
    onCopyCode,
    isLatestOutgoing = false // Pass if this is the last sent message by me
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

    // Calculate dynamic border radii (Messenger/2026 UX grouping styling)
    let roundedClass = "rounded-[24px]";
    if (isMe) {
        if (isConsecutivePrev && isConsecutiveNext) roundedClass = "rounded-[24px] rounded-r-[8px]";
        else if (isConsecutivePrev) roundedClass = "rounded-[24px] rounded-tr-[8px]";
        else if (isConsecutiveNext) roundedClass = "rounded-[24px] rounded-br-[8px]";
    } else {
        if (isConsecutivePrev && isConsecutiveNext) roundedClass = "rounded-[24px] rounded-l-[8px]";
        else if (isConsecutivePrev) roundedClass = "rounded-[24px] rounded-tl-[8px]";
        else if (isConsecutiveNext) roundedClass = "rounded-[24px] rounded-bl-[8px]";
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
    const reactionCount = activeReactions.length;

    // Group reactions by emoji
    const reactionGroups = msg.reactions 
        ? Object.values(msg.reactions).reduce((acc, emoji) => {
            acc[emoji] = (acc[emoji] || 0) + 1;
            return acc;
          }, {})
        : {};
    const groupedReactions = Object.entries(reactionGroups).map(([emoji, count]) => ({ emoji, count }));

    const handlePillClick = (e, emoji) => {
        e.stopPropagation();
        handleReact(msg._id, emoji);
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
            <p className="text-[14.5px] text-inherit whitespace-pre-wrap">{text}</p>
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
                reactionCount > 0 ? "mb-6" : (!isConsecutiveNext ? "mb-3" : "mb-0.5"),
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

                {/* Replied Message Preview (Outside and above the bubble) */}
                {msg.replyTo && !isDeleted && (
                    <div 
                        onClick={() => scrollToMessage(msg.replyTo._id || msg.replyTo)}
                        className={cn(
                            "mb-1 px-3.5 py-1.5 text-xs rounded-[16px] max-w-sm truncate cursor-pointer transition-all duration-150 border shadow-sm",
                            isMe 
                                ? "bg-muted/45 hover:bg-muted/65 text-muted-foreground mr-2 border-border/20" 
                                : "bg-muted/45 hover:bg-muted/65 text-muted-foreground ml-2 border-border/20"
                        )}
                        style={{ alignSelf: isMe ? 'flex-end' : 'flex-start' }}
                    >
                        <span className="font-bold block text-[9px] mb-0.5 uppercase tracking-wider opacity-70">
                            {msg.replyTo.isDeleted ? "Deleted Message" : (isMe ? `You replied to ${replySender === 'You' ? 'yourself' : replySender}` : `${replySender} replied`)}
                        </span>
                        <span className="line-clamp-1 leading-normal text-foreground/85">
                            {msg.replyTo.isDeleted ? "This message was deleted" : msg.replyTo.text}
                        </span>
                    </div>
                )}

                <div className="relative flex items-center gap-2 group/actions">
                    {/* Hover Actions - Left for Me (Glass Pill Aesthetic) */}
                    {isMe && !isDeleted && (
                        <div className={cn(
                            "flex items-center gap-1.5 mr-2 px-2.5 py-1 bg-background/80 dark:bg-muted/40 backdrop-blur-md border border-border/30 rounded-full shadow-sm transition-all duration-150 shrink-0",
                            (showReactionTray || showMoreMenu) 
                                ? "opacity-100 scale-100 pointer-events-auto" 
                                : "opacity-0 scale-95 pointer-events-none group-hover/bubble:opacity-100 group-hover/bubble:scale-100 group-hover/bubble:pointer-events-auto"
                        )}>
                            <button 
                                type="button"
                                ref={moreBtnRef}
                                onClick={openMoreMenu}
                                className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground rounded-full transition-colors active:scale-90" 
                                title="More"
                                aria-label="More message options"
                            >
                                <MoreHorizontal size={14} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => onReply?.(msg)}
                                className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground rounded-full transition-colors active:scale-90" 
                                title="Reply"
                                aria-label="Reply to message"
                            >
                                <Reply size={14} />
                            </button>
                            <button 
                                type="button"
                                ref={reactionBtnRef}
                                onClick={openReactionTray}
                                className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground rounded-full transition-colors active:scale-90" 
                                title="React"
                                aria-label="Add reaction"
                            >
                                <Smile size={14} />
                            </button>
                        </div>
                    )}

                    <div 
                        className={cn(
                            "bubble-content px-4 py-2.5 text-[15px] relative leading-relaxed w-fit font-body z-10 flex flex-col gap-1.5 transition-all duration-200",
                            roundedClass,
                            isMe 
                                ? (isDeleted ? "bg-muted text-muted-foreground border border-border/50" : "bg-[color:hsl(var(--chat-sent))] text-[color:hsl(var(--chat-sent-foreground))] ml-auto")
                                : (isDeleted ? "bg-muted/50 text-muted-foreground italic border border-border/30" : "bg-[color:hsl(var(--chat-received))] text-[color:hsl(var(--chat-received-foreground))] mr-auto border border-border/20 dark:border-border/10"),
                            isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20",
                            isDeleted && "py-1.5 px-3 text-[13px]"
                        )}
                    >
                        {!isDeleted && renderMilestoneIndicator()}

                        <div className={cn("break-words select-text", isDeleted && "italic text-muted-foreground/60")} style={{ overflowWrap: 'anywhere' }}>
                            {isDeleted ? "This message was deleted" : renderFormattedContent()}
                        </div>

                        {!isDeleted && renderPollPreview()}
                        {!isDeleted && renderAssignmentPreview()}
                        {!isDeleted && renderTags()}
                    </div>

                    {/* Hover Actions - Right for Them (Glass Pill Aesthetic) */}
                    {!isMe && !isDeleted && (
                        <div className={cn(
                            "flex items-center gap-1.5 ml-2 px-2.5 py-1 bg-background/80 dark:bg-muted/40 backdrop-blur-md border border-border/30 rounded-full shadow-sm transition-all duration-150 shrink-0",
                            (showReactionTray || showMoreMenu) 
                                ? "opacity-100 scale-100 pointer-events-auto" 
                                : "opacity-0 scale-95 pointer-events-none group-hover/bubble:opacity-100 group-hover/bubble:scale-100 group-hover/bubble:pointer-events-auto"
                        )}>
                            <button 
                                type="button"
                                ref={reactionBtnRef}
                                onClick={openReactionTray}
                                className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground rounded-full transition-colors active:scale-90" 
                                title="React"
                                aria-label="Add reaction"
                            >
                                <Smile size={14} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => onReply?.(msg)}
                                className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground rounded-full transition-colors active:scale-90" 
                                title="Reply"
                                aria-label="Reply to message"
                            >
                                <Reply size={14} />
                            </button>
                            <button 
                                type="button"
                                ref={moreBtnRef}
                                onClick={openMoreMenu}
                                className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground rounded-full transition-colors active:scale-90" 
                                title="More"
                                aria-label="More message options"
                            >
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Reaction Container (Reserves layout height, visually connected, non-overlapping) */}
                {reactionCount > 0 && !isDeleted && (
                    <div 
                        className={cn(
                            "flex flex-wrap gap-1 items-center max-w-full mt-[-6px] mb-1 z-20 select-none",
                            isMe ? "justify-end mr-4" : "justify-start ml-4"
                        )}
                    >
                        {groupedReactions.map(({ emoji, count }) => (
                            <div 
                                key={emoji}
                                onClick={(e) => handlePillClick(e, emoji)}
                                className={cn(
                                    "h-7 min-w-[28px] px-2.5 py-0.5 rounded-full text-[12px] flex gap-1.5 items-center justify-center select-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150 border shadow-sm",
                                    "bg-white text-black border-gray-200/80",
                                    "dark:bg-zinc-800 dark:text-white dark:border-zinc-700/80",
                                    "animate-in fade-in zoom-in-90 duration-200 ease-out"
                                )}
                            >
                                <span className="text-[13px] leading-none select-none">{emoji}</span>
                                {count > 1 && (
                                    <span className="text-[10px] font-bold text-muted-foreground/95 pl-0.5 pr-0.5">{count}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 2026 Redesign Metadata row under the bubble */}
                <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground/50 select-none transition-all duration-300",
                    isMe ? "justify-end mr-2" : "justify-start ml-2",
                    // Hide consecutive timestamps by default, show on hover (using group-hover/bubble helper)
                    (isConsecutivePrev && !isLatestOutgoing)
                        ? "h-0 opacity-0 overflow-hidden group-hover/bubble:h-auto group-hover/bubble:opacity-100 group-hover/bubble:mt-1 group-hover/bubble:mb-0.5"
                        : "mt-1 mb-0.5 opacity-100"
                )}>
                    {isEdited && !isDeleted && (
                        <button 
                            type="button"
                            onClick={handleOpenHistory}
                            className="hover:underline italic lowercase cursor-help"
                        >
                            (edited)
                        </button>
                    )}
                    <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Delivery Status & Read Receipts (Only on latest outgoing message) */}
                    {isMe && isLatestOutgoing && !isDeleted && (
                        <span className="shrink-0 flex items-center ml-0.5">
                            {msg.isRead ? (
                                otherParticipant?.photoURL ? (
                                    <img 
                                        src={otherParticipant.photoURL} 
                                        alt="Seen" 
                                        className="size-3.5 rounded-full object-cover ring-1 ring-black/5" 
                                        title="Seen"
                                    />
                                ) : (
                                    <span className="text-[#0A7CFF]" title="Seen">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                    </span>
                                )
                            ) : (
                                <span className="text-muted-foreground/30" title="Sent">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                </span>
                            )}
                        </span>
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
