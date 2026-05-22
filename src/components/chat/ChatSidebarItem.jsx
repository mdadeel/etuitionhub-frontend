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
            className={cn(
                "w-full p-4 flex items-center gap-3 text-left transition-all duration-200 relative group",
                isActive ? "bg-blue-50/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#2563EB] before:rounded-r" : "hover:bg-muted/50"
            )}
        >
            <div className="relative">
                <Avatar src={other.photoURL} alt={other.displayName} size="sm" className="shadow-sm" />
                
                {/* Online Indicator */}
                {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card ring-1 ring-black/5" />
                )}

                {/* Unread Badge */}
                {conv.unreadCount > 0 && !isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white font-bold animate-in zoom-in">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                {/* Row 1: Name + Timestamp */}
                <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={cn("text-sm truncate transition-colors", conv.unreadCount > 0 && !isActive ? "font-bold text-foreground" : "font-semibold text-foreground/90 group-hover:text-foreground")}>
                        {other.displayName}
                    </h4>
                    {conv.lastMessage && (
                        <span className="text-[10px] text-muted-foreground shrink-0 font-medium ml-2">
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    )}
                </div>

                {/* Row 2: Message preview (left) + Sent/Seen (right) */}
                {isTyping ? (
                    <p className="text-xs text-[#2563EB] font-medium animate-pulse">Typing...</p>
                ) : (
                    <div className="flex items-center justify-between gap-1">
                        <p className={cn(
                            "text-xs transition-colors flex-1 min-w-0",
                            conv.unreadCount > 0 && !isActive ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                        )}>
                            {isLastMessageMine && <span className="text-muted-foreground/70">You: </span>}
                            <span className="truncate">
                                {(() => {
                                    const text = conv.lastMessage?.text || "Started a conversation";
                                    return text.length > 28 ? text.slice(0, 28) + '…' : text;
                                })()}
                            </span>
                        </p>
                        {/* Sent / Seen — always on the right */}
                        {isLastMessageMine && conv.lastMessage && (
                            <span className={cn(
                                "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                conv.lastMessage.isRead
                                    ? "text-[#2563EB] bg-blue-50"
                                    : "text-muted-foreground bg-muted"
                            )}>
                                {conv.lastMessage.isRead ? 'Seen' : 'Sent'}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
};

export default ChatSidebarItem;
