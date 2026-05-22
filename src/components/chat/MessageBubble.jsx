import React, { useState } from 'react';
import { Smile, Reply, MoreHorizontal, Check, CheckCheck } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import ReactionTray from './ReactionTray';

const MessageBubble = ({ 
    msg, 
    isMe, 
    isConsecutivePrev, 
    isConsecutiveNext, 
    showAvatar, 
    otherParticipant, 
    handleReact,
    isLastInBlock
}) => {
    const [showReactionTray, setShowReactionTray] = useState(false);

    // Calculate dynamic border radii
    let roundedClass = "rounded-2xl";
    if (isMe) {
        if (isConsecutivePrev && isConsecutiveNext) roundedClass = "rounded-2xl rounded-r-md";
        else if (isConsecutivePrev) roundedClass = "rounded-2xl rounded-br-md";
        else if (isConsecutiveNext) roundedClass = "rounded-2xl rounded-tr-md";
    } else {
        if (isConsecutivePrev && isConsecutiveNext) roundedClass = "rounded-2xl rounded-l-md";
        else if (isConsecutivePrev) roundedClass = "rounded-2xl rounded-bl-md";
        else if (isConsecutiveNext) roundedClass = "rounded-2xl rounded-tl-md";
    }

    // Convert reactions map to array of unique emojis and total count
    const activeReactions = msg.reactions ? Object.values(msg.reactions) : [];
    const uniqueReactions = Array.from(new Set(activeReactions));
    const reactionCount = activeReactions.length;

    return (
        <div className={cn("flex items-end gap-2 w-full animate-in slide-in-from-bottom-2 fade-in duration-300", isMe ? "justify-end" : "justify-start", !isConsecutiveNext && "mb-1")}>
            
            {/* Avatar for received messages */}
            {!isMe && (
                <div className="w-6 shrink-0 flex justify-center mb-1">
                    {showAvatar ? (
                        <Avatar 
                            src={otherParticipant?.photoURL} 
                            size="xs" 
                            className="w-6 h-6 shadow-sm rounded-full overflow-hidden border border-border/50"
                        />
                    ) : (
                        <div className="w-6 h-6" />
                    )}
                </div>
            )}

            {/* Max-width container: bubbles never exceed 72% of the chat width */}
            <div className={cn("flex flex-col relative group", isMe ? "items-end" : "items-start")} style={{ maxWidth: 'min(72%, 440px)' }}>
                
                {/* Reaction Tray Popup */}
                {showReactionTray && (
                    <ReactionTray 
                        onReact={(emoji) => handleReact(msg._id, emoji)}
                        onClose={() => setShowReactionTray(false)}
                        isMe={isMe}
                    />
                )}

                <div className="relative flex items-center gap-2">
                    {/* Hover Actions - Left side for me */}
                    {isMe && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 mr-1">
                            <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-full" title="More">
                                <MoreHorizontal size={14} />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-full" title="Reply">
                                <Reply size={14} className="scale-x-[-1]" />
                            </button>
                            <button 
                                onClick={() => setShowReactionTray(true)}
                                className="p-1.5 text-muted-foreground hover:bg-muted rounded-full" title="React"
                            >
                                <Smile size={14} />
                            </button>
                        </div>
                    )}

                    {/* The Bubble — width fits content, wraps at container boundary */}
                    <div className={cn(
                        "px-4 py-2.5 text-[15px] shadow-sm relative leading-relaxed w-fit",
                        "min-w-[44px]",   /* never collapse smaller than a short word */
                        roundedClass,
                        isMe 
                            ? "bg-gradient-to-tr from-[#0084FF] to-[#2563EB] text-white" 
                            : "bg-muted/80 text-foreground border border-border/50"
                    )}>
                        <p className="break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere' }}>{msg.text}</p>
                        
                        {/* Active Reactions Badge */}
                        {reactionCount > 0 && (
                            <div className={cn(
                                "absolute -bottom-3 bg-card border border-border shadow-sm rounded-full px-1.5 py-0.5 text-xs flex gap-0.5 items-center z-10 select-none cursor-pointer hover:scale-105 transition-transform",
                                isMe ? "right-2" : "left-2"
                            )}>
                                {uniqueReactions.slice(0, 3).map((emoji, i) => (
                                    <span key={i} className="text-[11px] leading-none">{emoji}</span>
                                ))}
                                {reactionCount > 1 && (
                                    <span className="text-[10px] text-muted-foreground ml-0.5 font-medium">{reactionCount}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hover Actions - Right side for them */}
                    {!isMe && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 ml-1">
                            <button 
                                onClick={() => setShowReactionTray(true)}
                                className="p-1.5 text-muted-foreground hover:bg-muted rounded-full" title="React"
                            >
                                <Smile size={14} />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-full" title="Reply">
                                <Reply size={14} />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-full" title="More">
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Status & Time under last message block */}
                {isLastInBlock && (
                    <div className={cn("flex items-center gap-1 mt-1.5 px-1", reactionCount > 0 ? "mt-3" : "")}>
                        <span className="text-[11px] text-muted-foreground font-medium">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                            <span className={cn(msg.isRead ? "text-[#0084FF]" : "text-muted-foreground")}>
                                {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
