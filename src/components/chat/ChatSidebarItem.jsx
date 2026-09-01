import React, { memo } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useChat } from '../../contexts/ChatContext';
import { useTranslation } from 'react-i18next';
import { Check, CheckCheck } from 'lucide-react';

const ChatSidebarItem = memo(({ conv, user, isActive, onClick }) => {
    const { t } = useTranslation();
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
                "w-[calc(100%-16px)] mx-2 my-1 px-3.5 py-3 flex items-center gap-3.5 text-left transition-all duration-200 rounded-lg relative group",
                isActive 
                    ? "bg-primary/10 dark:bg-primary/20 text-foreground shadow-sm" 
                    : "hover:bg-[color:hsl(var(--chat-hover))]"
            )}
        >
            <div className="relative shrink-0">
                <Avatar 
                    src={other.photoURL} 
                    alt={other.displayName} 
                    size="md" 
                    className="size-12 rounded-full shadow-sm border border-border/20 group-hover:scale-105 transition-transform" 
                />
                
                {/* Online Indicator */}
                {isOnline && (
                    <span 
                        className={cn(
                            "absolute bottom-0 right-0 size-3.5 bg-success rounded-full border-2 transition-colors duration-200",
                            isActive ? "border-primary/20 dark:border-primary/40" : "border-background"
                        )} 
                        title="Online"
                    />
                )}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Row 1: Name + Timestamp */}
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className={cn(
                        "text-[14px] truncate tracking-tight transition-colors", 
                        conv.unreadCount > 0 && !isActive 
                            ? "font-bold text-foreground" 
                            : "font-semibold text-foreground/90 group-hover:text-foreground"
                    )}>
                        {other.displayName || other.email || 'Unknown User'}
                    </h4>
                    {conv.lastMessage && (
                        <span className={cn(
                            "text-[11px] font-medium shrink-0 ml-2 transition-colors tracking-wide",
                            conv.unreadCount > 0 && !isActive ? "text-primary font-bold" : "text-muted-foreground/70"
                        )}>
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit', 
                                minute: '2-digit' 
                            }).replace(/,.*$/, '')}
                        </span>
                    )}
                </div>
 
                {/* Row 2: Message preview (left) + Unread badge (right) */}
                <div className="flex items-center justify-between gap-2">
                    {isTyping ? (
                        <p className="text-[12.5px] text-primary font-bold animate-pulse flex items-center gap-1">
                            <span className="inline-block size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="inline-block size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="inline-block size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="ml-1 text-xs">{t("chat.typing", "typing...")}</span>
                        </p>
                    ) : (
                        <p className={cn(
                            "text-[13px] truncate flex-1 min-w-0 leading-tight transition-colors font-medium",
                            conv.unreadCount > 0 && !isActive 
                                ? "font-bold text-foreground" 
                                : "text-muted-foreground/80 group-hover:text-muted-foreground"
                        )}>
                            {isLastMessageMine && <span className="opacity-70 text-[12px] font-bold">{t("chat.you", "You: ")}</span>}
                            <span>
                                {conv.lastMessage?.text || "Started a conversation"}
                            </span>
                        </p>
                    )}
                    
                    {/* Unread Badge OR Sent/Seen Indicator */}
                    {conv.unreadCount > 0 && !isActive ? (
                        <div className="shrink-0 size-5 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm animate-pulse animate-duration-1000">
                            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </div>
                    ) : (
                        isLastMessageMine && conv.lastMessage && (
                            <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                                {conv.lastMessage.isRead ? (
                                    <CheckCheck size={16} className="text-primary" title="Seen" strokeWidth={2.5} />
                                ) : (
                                    <Check size={16} className="text-muted-foreground/45" title="Sent" strokeWidth={2.5} />
                                )}
                            </span>
                        )
                    )}
                </div>
            </div>
        </button>
    );
});

export default ChatSidebarItem;
