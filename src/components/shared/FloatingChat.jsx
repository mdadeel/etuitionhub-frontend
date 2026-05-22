import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import api from '../../services/api';
import { MessageCircle, X, ArrowLeft, Edit, MessageSquare } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ChatSidebarItem from '../chat/ChatSidebarItem';
import MessageBubble from '../chat/MessageBubble';
import ChatInputBar from '../chat/ChatInputBar';

const formatDateGroup = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric',
        year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
};

const FloatingChat = () => {
    const { user } = useAuth();
    const {
        socket,
        conversations,
        unreadTotal,
        markAsRead,
        fetchConversations,
        isFloatingOpen,
        setIsFloatingOpen,
        floatingActiveConv,
        setFloatingActiveConv,
        typingUsers,
        onlineUsers,
    } = useChat();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
    }, []);

    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (!floatingActiveConv) return;

        const fetchMessages = async () => {
            setLoading(true);
            setMessages([]);
            if (socket) {
                socket.emit('join-room', floatingActiveConv._id, user.uid);
            }
            try {
                const res = await api.get(`/api/messages/${floatingActiveConv._id}`);
                setMessages(res.data.filter(m => m && m.text));
                scrollToBottom();
                if (floatingActiveConv.unreadCount > 0) {
                    markAsRead(floatingActiveConv._id);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [floatingActiveConv]);

    // Listen for incoming socket events
    useEffect(() => {
        if (!socket || !floatingActiveConv) return;

        const handleNewMessage = (data) => {
            if (data.conversationId === floatingActiveConv._id && data.text) {
                setMessages(prev => {
                    if (data.senderId === user.uid || data.senderId === user.dbUser?._id) return prev;
                    return [...prev, data];
                });
                scrollToBottom();
                if (isFloatingOpen) {
                    markAsRead(floatingActiveConv._id);
                }
            }
        };

        const handleMessagesRead = (data) => {
            if (data.conversationId === floatingActiveConv._id) {
                setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
            }
        };

        const handleMessageReaction = (data) => {
            if (data.room === floatingActiveConv._id) {
                setMessages(prev => prev.map(msg =>
                    msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
                ));
            }
        };

        socket.on('chat-message', handleNewMessage);
        socket.on('messages-read', handleMessagesRead);
        socket.on('message-reaction', handleMessageReaction);

        return () => {
            socket.off('chat-message', handleNewMessage);
            socket.off('messages-read', handleMessagesRead);
            socket.off('message-reaction', handleMessageReaction);
        };
    }, [socket, floatingActiveConv, isFloatingOpen]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !floatingActiveConv) return;

        const otherParticipant = floatingActiveConv.participants.find(p => p.email !== user.email);
        if (!otherParticipant) return;

        const text = newMessage.trim();
        setNewMessage('');

        try {
            const res = await api.post('/api/messages', { receiverId: otherParticipant._id, text });
            const sentMsg = res.data;

            setMessages(prev => [...prev, sentMsg]);
            scrollToBottom();

            if (socket) {
                socket.emit('chat-message', { ...sentMsg, room: floatingActiveConv._id });
                socket.emit('stop-typing', { room: floatingActiveConv._id, senderId: user.uid });
            }
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleReact = async (messageId, emoji) => {
        try {
            const res = await api.post(`/api/messages/${messageId}/react`, { emoji });
            const updatedReactions = res.data.reactions;
            setMessages(prev => prev.map(msg =>
                msg._id === messageId ? { ...msg, reactions: updatedReactions } : msg
            ));
            if (socket) {
                socket.emit('message-reaction', {
                    room: floatingActiveConv._id,
                    messageId,
                    reactions: updatedReactions
                });
            }
        } catch (err) {
            console.error('Failed to react:', err);
        }
    };

    const handleTyping = () => {
        if (socket && floatingActiveConv) {
            socket.emit('typing', { room: floatingActiveConv._id, senderId: user.uid });
        }
    };

    const handleStopTyping = () => {
        if (socket && floatingActiveConv) {
            socket.emit('stop-typing', { room: floatingActiveConv._id, senderId: user.uid });
        }
    };

    if (!user) return null;

    // Info about the other person in the active chat
    const otherParticipant = floatingActiveConv
        ? floatingActiveConv.participants.find(p => p.email !== user?.email)
        : null;

    const isOtherOnline = otherParticipant && (onlineUsers.has(otherParticipant._id) || onlineUsers.has(otherParticipant.uid));

    const myParticipantId = floatingActiveConv
        ? (() => {
            const me = floatingActiveConv.participants.find(p => p.email?.toLowerCase() === user?.email?.toLowerCase());
            return me ? String(me._id) : String(user.dbUser?._id);
        })()
        : null;

    const otherIsTyping = floatingActiveConv && otherParticipant
        ? typingUsers.has(`${floatingActiveConv._id}_${otherParticipant._id}`) ||
          typingUsers.has(`${floatingActiveConv._id}_${otherParticipant.uid}`)
        : false;

    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end select-none">
            
            {/* ── Chat Window ── */}
            {isFloatingOpen && (
                <div className="mb-3 w-[360px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-100px)] bg-card border border-border/70 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-250">

                    {/* Header */}
                    {floatingActiveConv ? (
                        /* Active Chat Header */
                        <div className="shrink-0 px-3 py-2.5 bg-card border-b border-border flex items-center gap-2">
                            <button
                                onClick={() => { setFloatingActiveConv(null); setMessages([]); }}
                                className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                            >
                                <ArrowLeft size={17} />
                            </button>
                            <div className="relative">
                                <Avatar src={otherParticipant?.photoURL} alt={otherParticipant?.displayName} size="xs" className="w-8 h-8" />
                                {isOtherOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-foreground truncate leading-tight">
                                    {otherParticipant?.displayName}
                                </p>
                                <p className="text-[10px] font-medium leading-none mt-0.5">
                                    {isOtherOnline
                                        ? <span className="text-green-600">Active now</span>
                                        : <span className="text-muted-foreground">Offline</span>
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFloatingOpen(false)}
                                className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        /* Conversation List Header */
                        <div className="shrink-0 px-4 py-3 bg-card border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-base text-foreground">Messages</h3>
                            <div className="flex items-center gap-1">
                                <button className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => setIsFloatingOpen(false)}
                                    className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {!floatingActiveConv ? (
                            /* Conversation List */
                            <div className="flex-1 overflow-y-auto py-1">
                                {conversations.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                                        <MessageSquare size={28} className="mb-2 opacity-20" />
                                        <p className="text-sm">No conversations yet.</p>
                                        <p className="text-xs mt-1 opacity-60">Contact a tutor to start chatting.</p>
                                    </div>
                                ) : (
                                    conversations.map(conv => (
                                        <ChatSidebarItem
                                            key={conv._id}
                                            conv={conv}
                                            user={user}
                                            isActive={false}
                                            onClick={(c) => setFloatingActiveConv(c)}
                                        />
                                    ))
                                )}
                            </div>
                        ) : (
                            /* Chat Messages */
                            <>
                                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 bg-background/40">
                                    {loading ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                            <div className="w-12 h-12 rounded-full overflow-hidden mb-3 border border-border">
                                                {otherParticipant?.photoURL
                                                    ? <img src={otherParticipant.photoURL} className="w-full h-full object-cover" alt="" />
                                                    : <div className="w-full h-full bg-muted" />
                                                }
                                            </div>
                                            <p className="font-semibold text-sm text-foreground">{otherParticipant?.displayName}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Say hello! 👋</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            if (!msg || !msg.text) return null;

                                            const senderIdStr = String(msg.senderId);
                                            const isMe = senderIdStr === myParticipantId || senderIdStr === String(user.uid);

                                            const prevMsg = messages[idx - 1];
                                            const nextMsg = messages[idx + 1];

                                            const prevDateGroup = prevMsg ? formatDateGroup(prevMsg.createdAt) : null;
                                            const dateGroup = formatDateGroup(msg.createdAt);
                                            const showDateGroup = dateGroup !== prevDateGroup;

                                            const isPrevSameSender = prevMsg && String(prevMsg.senderId) === senderIdStr && !showDateGroup;
                                            const nextDateGroup = nextMsg ? formatDateGroup(nextMsg.createdAt) : null;
                                            const isNextSameSender = nextMsg && String(nextMsg.senderId) === senderIdStr && nextDateGroup === dateGroup;

                                            const isLastInBlock = !isNextSameSender;
                                            const showAvatar = !isMe && isLastInBlock;

                                            return (
                                                <React.Fragment key={msg._id || idx}>
                                                    {showDateGroup && (
                                                        <div className="flex justify-center my-3">
                                                            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 border border-border/40 px-2.5 py-0.5 rounded-full">
                                                                {dateGroup}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <MessageBubble
                                                        msg={msg}
                                                        isMe={isMe}
                                                        isConsecutivePrev={isPrevSameSender}
                                                        isConsecutiveNext={isNextSameSender}
                                                        showAvatar={showAvatar}
                                                        otherParticipant={otherParticipant}
                                                        handleReact={handleReact}
                                                        isLastInBlock={isLastInBlock}
                                                    />
                                                </React.Fragment>
                                            );
                                        })
                                    )}

                                    {/* Typing Indicator */}
                                    {otherIsTyping && (
                                        <div className="flex items-end gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-border/50 mb-0.5">
                                                {otherParticipant?.photoURL
                                                    ? <img src={otherParticipant.photoURL} className="w-full h-full object-cover" alt="" />
                                                    : <div className="w-full h-full bg-muted" />
                                                }
                                            </div>
                                            <div className="bg-muted/80 border border-border/50 rounded-2xl rounded-bl-md px-3 py-2 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} className="h-1" />
                                </div>

                                {/* Input Bar */}
                                <ChatInputBar
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onSend={sendMessage}
                                    onTyping={handleTyping}
                                    onStopTyping={handleStopTyping}
                                    placeholder="Aa..."
                                    compact
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Floating Trigger Button ── */}
            <button
                onClick={() => setIsFloatingOpen(!isFloatingOpen)}
                className="w-14 h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 relative"
                title={isFloatingOpen ? "Close messages" : "Open messages"}
            >
                <span className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    isFloatingOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                )}>
                    <X size={22} />
                </span>
                <span className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    !isFloatingOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )}>
                    <MessageCircle size={24} />
                </span>

                {/* Unread Badge */}
                {!isFloatingOpen && unreadTotal > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm animate-in zoom-in">
                        {unreadTotal > 99 ? '99+' : unreadTotal}
                    </div>
                )}
            </button>
        </div>
    );
};

export default FloatingChat;
