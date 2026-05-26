import React from 'react';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useChat } from '../../contexts/ChatContext';

const ChatSidebarItem = ({ conv, user, isActive, onClick }) => {
    const { onlineUsers, typingUsers } = useChat();

    const other = conv.participants.find(p => p.email !== user?.email);
    if (!other) return null;

    const myParticipant = conv.participants.find(p => p.email?.toLowerCase() === user?.email?.toLowerCase());
    const isLastMessageMine = conv.lastMessage && (String(conv.lastMessage.senderId) === (myParticipant ? String(myParticipant._id) : String(user.dbUser?._id)) || String(conv.lastMessage.senderId) === String(user.uid));

    // Determine online and typing statuses
    const isOnline = onlineUsers.has(other._id) || onlineUsers.has(other.uid);
    // Determine if typing in THIS specific room
    const typingKey = `${conv._id}_${other._id}`;
    const isTyping = typingUsers.has(typingKey);

    return (
        <button
            onClick={() => onClick(conv)}
            aria-label={`Chat with ${other.displayName || other.email || 'Unknown User'}`}
            className={cn(
                "w-full px-3 py-3 mx-2 my-1 max-w-[calc(100%-16px)] flex items-center gap-3 text-left transition-all duration-200 relative group rounded-xl",
                isActive 
                    ? "bg-primary/10 dark:bg-primary/20" 
                    : "hover:bg-muted/60"
            )}
        >
            <div className="relative shrink-0">
                <Avatar src={other.photoURL} alt={other.displayName} size="md" className="w-12 h-12 rounded-full shadow-sm" />
                
                {/* Online Indicator */}
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background ring-1 ring-black/5" />
                )}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Row 1: Name + Timestamp */}
                <div className="flex justify-between items-center mb-0.5">
                    <h4 className={cn(
                        "text-[15px] truncate transition-colors", 
                        conv.unreadCount > 0 && !isActive ? "font-bold text-foreground" : "font-medium text-foreground/90 group-hover:text-foreground"
                    )}>
                        {other.displayName || other.email || 'Unknown User'}
                    </h4>
                    {conv.lastMessage && (
                        <span className={cn(
                            "text-xs shrink-0 ml-2 transition-colors",
                            conv.unreadCount > 0 && !isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        )}>
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    )}
                </div>
 
                {/* Row 2: Message preview (left) + Unread badge (right) */}
                <div className="flex items-center justify-between gap-2">
                    {isTyping ? (
                        <p className="text-[13px] text-primary font-medium animate-pulse">typing...</p>
                    ) : (
                        <p className={cn(
                            "text-[13px] truncate flex-1 min-w-0 transition-colors",
                            conv.unreadCount > 0 && !isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                            {isLastMessageMine && <span className="text-muted-foreground/70">You: </span>}
                            <span>
                                {(() => {
                                    const text = conv.lastMessage?.text || "Started a conversation";
                                    return text;
                                })()}
                            </span>
                        </p>
                    )}
                    
                    {/* Unread Badge OR Sent/Seen Indicator */}
                    {conv.unreadCount > 0 && !isActive ? (
                        <div className="shrink-0 min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </div>
                    ) : (
                        isLastMessageMine && conv.lastMessage && (
                            <span className={cn(
                                "shrink-0 text-[11px] font-medium px-1.5 py-0.5 rounded-full",
                                conv.lastMessage.isRead
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground/60"
                            )}>
                                {conv.lastMessage.isRead ? 'Seen' : 'Sent'}
                            </span>
                        )
                    )}
                </div>
            </div>
        </button>
    );
};

export default ChatSidebarItem;
