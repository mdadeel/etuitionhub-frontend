import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import api from '../../services/api';
import { MessageCircle, X, ArrowLeft, Edit, MessageSquare } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
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
    const { user, dbUser } = useAuth();
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
    const [sending, setSending] = useState(false);
    const [replyingToMessage, setReplyingToMessage] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
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
                const msgs = Array.isArray(res.data) ? res.data : (res.data.messages || []);
                setMessages(msgs.filter(m => m && m.text));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floatingActiveConv]);

    // Listen for incoming socket events
    useEffect(() => {
        if (!socket || !floatingActiveConv) return;

        const handleNewMessage = (data) => {
            if (data.conversationId === floatingActiveConv._id && data.text) {
                setMessages(prev => {
                    if (data.senderId === user.uid || data.senderId === dbUser?._id) return prev;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, floatingActiveConv, isFloatingOpen]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !floatingActiveConv || sending) return;

        const otherParticipant = floatingActiveConv.participants.find(p => p.email !== user.email);
        if (!otherParticipant) return;

        const text = newMessage.trim();
        const replyToId = replyingToMessage ? replyingToMessage._id : null;
        setNewMessage('');
        setReplyingToMessage(null);
        setSending(true);

        try {
            const res = await api.post('/api/messages', {
                receiverId: otherParticipant._id,
                text,
                ...(replyToId && { replyToId })
            });
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
        } finally {
            setSending(false);
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

    const handleEdit = (msg) => {
        setEditingMessage(msg);
        setNewMessage(msg.text);
        setReplyingToMessage(null);
    };

    const handleSaveEdit = async () => {
        if (!newMessage.trim() || !editingMessage) return;
        const text = newMessage.trim();
        const messageId = editingMessage._id;

        try {
            const res = await api.patch(`/api/messages/${messageId}`, { text });
            const updatedMsg = res.data;

            setMessages(prev => prev.map(msg => msg._id === messageId ? updatedMsg : msg));
            setEditingMessage(null);
            setNewMessage('');

            if (socket) {
                socket.emit('message-edited', { ...updatedMsg, room: floatingActiveConv._id });
            }
        } catch (error) {
            console.error('Error editing message:', error);
            toast.error('Failed to edit message');
        }
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
        setNewMessage('');
    };

    const handleDelete = async (messageId) => {
        try {
            await api.delete(`/api/messages/${messageId}`);
            setMessages(prev => prev.map(msg =>
                msg._id === messageId ? { ...msg, isDeleted: true, text: "This message was deleted", reactions: {} } : msg
            ));
            if (socket) {
                socket.emit('message-deleted', { messageId, room: floatingActiveConv._id });
            }
            fetchConversations();
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
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
            return me ? String(me._id) : String(dbUser?._id);
        })()
        : null;

    const otherIsTyping = floatingActiveConv && otherParticipant
        ? typingUsers.has(`${floatingActiveConv._id}_${otherParticipant._id}`) ||
          typingUsers.has(`${floatingActiveConv._id}_${otherParticipant.uid}`)
        : false;

    return (
        <div className="fixed bottom-20 md:bottom-5 right-5 z-[100] flex flex-col items-end select-none">
            
            {/* ── Chat Window ── */}
            {isFloatingOpen && (
                <div className="mb-4 w-[380px] max-w-[calc(100vw-24px)] h-[540px] max-h-[calc(100vh-120px)] bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden transition-all duration-355 animate-in fade-in zoom-in-95 duration-200">

                    {/* Header */}
                    {floatingActiveConv ? (
                        /* Active Chat Header */
                        <div className="shrink-0 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200/60 dark:border-slate-700/80 flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <button
                                onClick={() => { setFloatingActiveConv(null); setMessages([]); }}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-205 text-slate-550 dark:text-slate-400 active:scale-95"
                                title="Back to conversations"
                            >
                                <ArrowLeft size={18} strokeWidth={2.5} />
                            </button>
                            <div className="relative shrink-0">
                                <Avatar src={otherParticipant?.photoURL} alt={otherParticipant?.displayName} size="sm" className="size-9 ring-2 ring-slate-100 dark:ring-slate-700 shadow-sm" />
                                <div className={cn(
                                    "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white dark:border-slate-800 transition-all duration-300",
                                    isOtherOnline ? "bg-green-500 animate-pulse" : "bg-slate-350 dark:bg-slate-650"
                                )} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-slate-900 dark:text-slate-50 truncate leading-none">
                                    {otherParticipant?.displayName}
                                </p>
                                <p className="text-[11px] font-medium leading-none mt-1">
                                    {isOtherOnline
                                        ? <span className="text-green-500 font-semibold">Online</span>
                                        : <span className="text-slate-400 dark:text-slate-500">Offline</span>
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFloatingOpen(false)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-200 text-slate-500 dark:text-slate-400 active:scale-95"
                                title="Close chat"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        /* Conversation List Header */
                        <div className="shrink-0 px-4 py-3.5 bg-white dark:bg-slate-800 border-b border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <h3 className="font-bold text-base text-slate-900 dark:text-slate-50 tracking-tight">Messages</h3>
                            <div className="flex items-center gap-1.5">
                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-200 text-slate-500 dark:text-slate-400 active:scale-95" title="New message">
                                    <Edit size={16} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={() => setIsFloatingOpen(false)}
                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-200 text-slate-500 dark:text-slate-400 active:scale-95"
                                    title="Close chat"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {!floatingActiveConv ? (
                            /* Conversation List */
                            <div className="flex-1 overflow-y-auto py-2 bg-slate-50 dark:bg-[#0F172A]">
                                {conversations.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-8 text-center animate-in fade-in duration-300">
                                        <div className="size-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm mb-3.5">
                                            <MessageSquare size={20} className="text-slate-400 dark:text-slate-500" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">No conversations yet</p>
                                        <p className="text-xs mt-1 text-slate-400 dark:text-slate-500 leading-normal max-w-[200px] mx-auto">
                                            Send a message to a tutor from their profile to start a conversation.
                                        </p>
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
                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 bg-gradient-to-b from-slate-50/50 to-slate-100/50 dark:from-slate-950/40 dark:to-slate-900/40 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                                    {loading ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="size-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="size-16 rounded-full overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 shadow-md ring-4 ring-slate-50 dark:ring-slate-900/50 shrink-0">
                                                {otherParticipant?.photoURL
                                                    ? <img src={otherParticipant.photoURL} className="size-full object-cover" alt="" />
                                                    : <div className="size-full bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-400 font-bold text-lg">{otherParticipant?.displayName?.[0]}</div>
                                                }
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50">{otherParticipant?.displayName}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-normal">
                                                Say hello to start a conversation and begin chatting.
                                            </p>
                                            <div className="mt-4 px-3 py-1.5 bg-white dark:bg-slate-800/80 rounded-full border border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-450 flex items-center gap-1.5 shadow-sm">
                                                <span className="size-1.5 bg-green-500 rounded-full animate-pulse" />
                                                Active session ready
                                            </div>
                                        </div>
                                    ) : (
                                        (() => {
                                            const lastOutgoing = [...messages].reverse().find(msg => {
                                                if (!msg) return false;
                                                const senderIdStr = String(msg.senderId);
                                                return senderIdStr === myParticipantId || senderIdStr === String(user.uid);
                                            });
                                            const latestOutgoingMsgId = lastOutgoing?._id;

                                            return messages.map((msg, idx) => {
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
                                                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2.5 py-0.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                                                                        {dateGroup}
                                                                    </span>
                                                                </div>
                                                        )}
                                                        <MessageBubble
                                                            msg={msg}
                                                            isMe={isMe}
                                                            myParticipantId={myParticipantId}
                                                            isConsecutivePrev={isPrevSameSender}
                                                            isConsecutiveNext={isNextSameSender}
                                                            showAvatar={showAvatar}
                                                            otherParticipant={otherParticipant}
                                                            handleReact={handleReact}
                                                            isLastInBlock={isLastInBlock}
                                                            isLatestOutgoing={msg._id === latestOutgoingMsgId}
                                                            onReply={setReplyingToMessage}
                                                            onEdit={handleEdit}
                                                            onDelete={handleDelete}
                                                        />
                                                    </React.Fragment>
                                                );
                                            });
                                        })()
                                    )}

                                    {/* Typing Indicator */}
                                    {otherIsTyping && (
                                        <div className="flex items-end gap-2 ml-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="size-5 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700/80 mb-0.5">
                                                {otherParticipant?.photoURL
                                                    ? <img src={otherParticipant.photoURL} className="size-full object-cover" alt="" />
                                                    : <div className="size-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold">{otherParticipant?.displayName?.[0]}</div>
                                                }
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700/80 rounded-2xl rounded-bl-sm px-3.5 py-2 flex items-center gap-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                <span className="size-1.5 bg-blue-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="size-1.5 bg-blue-500/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="size-1.5 bg-blue-500/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} className="h-1" />
                                </div>

                                {/* Input Bar */}
                                <ChatInputBar
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onSend={editingMessage ? handleSaveEdit : sendMessage}
                                    onTyping={handleTyping}
                                    onStopTyping={handleStopTyping}
                                    placeholder={editingMessage ? "Edit your message..." : "Aa..."}
                                    compact
                                    sending={sending}
                                    replyingTo={replyingToMessage}
                                    onCancelReply={() => setReplyingToMessage(null)}
                                    editingMessage={editingMessage}
                                    onCancelEdit={handleCancelEdit}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Floating Trigger Button ── */}
            <button
                onClick={() => setIsFloatingOpen(!isFloatingOpen)}
                className="size-14 bg-gradient-to-tr from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.45)] flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all duration-200"
                title={isFloatingOpen ? "Close messages" : "Open messages"}
            >
                {isFloatingOpen ? <X size={22} strokeWidth={2.5} /> : <MessageCircle size={24} strokeWidth={2} />}

                {/* Unread Badge */}
                {!isFloatingOpen && unreadTotal > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 size-5.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md animate-pulse">
                        {unreadTotal > 99 ? '99+' : unreadTotal}
                    </div>
                )}
            </button>
        </div>
    );
};

export default FloatingChat;
