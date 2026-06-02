import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import api from '../../services/api';
import { Search, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ChatSidebarItem from '../chat/ChatSidebarItem';
import ChatHeader from '../chat/ChatHeader';
import MessageBubble from '../chat/MessageBubble';
import ChatInputBar from '../chat/ChatInputBar';
import EditHistoryModal from '../chat/EditHistoryModal';

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

const ChatInterface = () => {
    const { user } = useAuth();
    const { socket, conversations, fetchConversations, markAsRead, typingUsers } = useChat();
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [replyingToMessage, setReplyingToMessage] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [historyMessage, setHistoryMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const handleEmojiSelect = useCallback((emoji) => {
        setNewMessage(prev => prev + emoji);
    }, []);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior });
        }, 100);
    }, []);

    const handleSelectConversation = useCallback(async (conversation) => {
        setActiveConversation(conversation);
        setLoading(true);
        setMessages([]);
        setReplyingToMessage(null);
        setEditingMessage(null);

        if (socket) {
            socket.emit('join-room', conversation._id, user.uid);
        }

        try {
            const res = await api.get(`/api/messages/${conversation._id}`);
            const msgs = Array.isArray(res.data) ? res.data : (res.data.messages || []);
            setMessages(msgs.filter(m => m && m.text));
            scrollToBottom('auto');
            if (conversation.unreadCount > 0) {
                markAsRead(conversation._id);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [socket, user, markAsRead, scrollToBottom]);

    // Handle incoming socket events
    useEffect(() => {
        if (!socket || !activeConversation) return;

        const handleNewMessage = (data) => {
            if (data.conversationId === activeConversation._id && data.text) {
                setMessages(prev => {
                    if (data.senderId === user.uid || data.senderId === user.dbUser?._id) return prev;
                    return [...prev, data];
                });
                scrollToBottom();
                markAsRead(activeConversation._id);
            }
        };

        const handleMessageReaction = (data) => {
            if (data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
                ));
            }
        };

        const handleMessageEdited = (data) => {
            if (data.conversationId === activeConversation._id || data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg._id === data._id ? { ...msg, ...data, updatedAt: new Date().toISOString() } : msg
                ));
            }
        };

        const handleMessageDeleted = (data) => {
            if (data.conversationId === activeConversation._id || data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg => 
                    msg._id === data.messageId ? { ...msg, isDeleted: true, text: "This message was deleted", reactions: {} } : msg
                ));
            }
        };

        socket.on('chat-message', handleNewMessage);
        socket.on('message-reaction', handleMessageReaction);
        socket.on('message-edited', handleMessageEdited);
        socket.on('message-deleted', handleMessageDeleted);

        return () => {
            socket.off('chat-message', handleNewMessage);
            socket.off('message-reaction', handleMessageReaction);
            socket.off('message-edited', handleMessageEdited);
            socket.off('message-deleted', handleMessageDeleted);
        };
    }, [socket, activeConversation, user, markAsRead, scrollToBottom]);

    // Listen for history open requests from bubbles
    useEffect(() => {
        const handleOpenHistory = (e) => {
            const msg = messages.find(m => m._id === e.detail.messageId);
            if (msg) setHistoryMessage(msg);
        };
        window.addEventListener('open-history', handleOpenHistory);
        return () => window.removeEventListener('open-history', handleOpenHistory);
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConversation || sending) return;

        const otherParticipant = activeConversation.participants.find(p => p.email !== user.email);
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
                replyToId
            });
            const sentMsg = res.data;

            setMessages(prev => [...prev, sentMsg]);
            scrollToBottom();

            if (socket) {
                socket.emit('chat-message', { ...sentMsg, room: activeConversation._id });
                socket.emit('stop-typing', { room: activeConversation._id, senderId: user.uid });
            }
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
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
                socket.emit('message-edited', { ...updatedMsg, room: activeConversation._id });
            }
            toast.success('Message updated');
        } catch (error) {
            console.error('Error editing message:', error);
            toast.error('Failed to edit message');
        }
    };

    const handleCancelEdit = useCallback(() => {
        setEditingMessage(null);
        setNewMessage('');
    }, []);

    const handleDeleteMessage = async (messageId) => {
        const result = await Swal.fire({
            title: 'Delete Message?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Delete for everyone',
            cancelButtonText: 'Cancel',
            background: '#fff',
            borderRadius: '15px',
            customClass: {
                title: 'text-xl font-bold',
                popup: 'shadow-2xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/messages/${messageId}`);
                
                // Optimistic update
                setMessages(prev => prev.map(msg => 
                    msg._id === messageId ? { ...msg, isDeleted: true, text: "This message was deleted", reactions: {} } : msg
                ));

                if (socket) {
                    socket.emit('message-deleted', { messageId, room: activeConversation._id });
                }
                toast.success('Message deleted');
                fetchConversations();
            } catch (error) {
                console.error('Error deleting message:', error);
                toast.error('Failed to delete message');
            }
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
                    room: activeConversation._id,
                    messageId,
                    reactions: updatedReactions
                });
            }
        } catch (err) {
            console.error('Failed to react:', err);
        }
    };

    const handleTyping = () => {
        if (socket && activeConversation) {
            socket.emit('typing', { room: activeConversation._id, senderId: user.uid });
        }
    };

    const handleStopTyping = () => {
        if (socket && activeConversation) {
            socket.emit('stop-typing', { room: activeConversation._id, senderId: user.uid });
        }
    };

    const filteredConversations = conversations.filter(c => {
        const other = c.participants.find(p => p.email !== user?.email);
        return other?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const myParticipantId = activeConversation
        ? (() => {
            const me = activeConversation.participants.find(p => p.email?.toLowerCase() === user?.email?.toLowerCase());
            return me ? String(me._id) : String(user.dbUser?._id);
        })()
        : null;

    const otherParticipant = activeConversation
        ? activeConversation.participants.find(p => p.email?.toLowerCase() !== user?.email?.toLowerCase())
        : null;

    const otherIsTyping = activeConversation && otherParticipant
        ? typingUsers.has(`${activeConversation._id}_${otherParticipant._id}`) ||
          typingUsers.has(`${activeConversation._id}_${otherParticipant.uid}`)
        : false;

    // Auto-select first conversation on desktop
    useEffect(() => {
        if (!activeConversation && conversations.length > 0 && window.innerWidth >= 768) {
            handleSelectConversation(conversations[0]);
        }
    }, [conversations, activeConversation, handleSelectConversation]);

    return (
        <div className="flex h-[calc(100vh-120px)] min-h-[600px] bg-background border border-border/40 rounded-[24px] overflow-hidden shadow-2xl transition-all duration-500">

            {/* ── Left Sidebar ── */}
            <div className={cn(
                "w-full md:w-[360px] shrink-0 border-r border-border/40 flex flex-col bg-muted/20 backdrop-blur-sm",
                activeConversation ? "hidden md:flex" : "flex"
            )}>
                {/* Sidebar header */}
                <div className="p-5 pb-3">
                    <div className="flex justify-between items-center mb-5 px-1">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Messages</h2>
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MessageSquare size={16} />
                        </div>
                    </div>
                    <div className="relative px-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 text-[15px] bg-background border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 shadow-sm"
                        />
                    </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar space-y-0.5">
                    {filteredConversations.length === 0 ? (
                        <div className="p-10 text-center mt-10">
                            <div className="size-16 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-in fade-in zoom-in duration-500">
                                <Search size={24} className="text-muted-foreground/30" />
                            </div>
                            {searchQuery ? (
                                <>
                                    <p className="text-[16px] font-semibold text-foreground">No chats found</p>
                                    <p className="text-[13px] text-muted-foreground mt-2 px-4 leading-relaxed">
                                        We couldn't find any conversations matching your search.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-[16px] font-semibold text-foreground">No conversations yet</p>
                                    <p className="text-[13px] text-muted-foreground mt-2 px-4 leading-relaxed">
                                        Find a tutor to get started with messaging.
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <ChatSidebarItem
                                key={conv._id}
                                conv={conv}
                                user={user}
                                isActive={activeConversation?._id === conv._id}
                                onClick={handleSelectConversation}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── Right Chat Area ── */}
            <div className={cn(
                "flex-1 flex flex-col bg-background min-w-0 relative transition-all duration-300",
                activeConversation ? "flex" : "hidden md:flex"
            )}>
                {activeConversation ? (
                    <>
                        {/* Sticky Header */}
                        <ChatHeader
                            conversation={activeConversation}
                            user={user}
                            onBack={() => setActiveConversation(null)}
                        />

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col custom-scrollbar bg-dot-pattern">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-10 border-3 border-primary/10 border-t-primary rounded-full animate-spin" />
                                        <span className="text-xs font-medium text-muted-foreground animate-pulse">Loading history...</span>
                                    </div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-700">
                                    <div className="size-28 rounded-[40px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/10 overflow-hidden">
                                        {otherParticipant?.photoURL
                                            ? <img src={otherParticipant.photoURL} className="size-full object-cover" alt="" />
                                            : <MessageSquare size={36} className="text-primary/40" />
                                        }
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">{otherParticipant?.displayName}</h3>
                                    <p className="text-[15px] text-muted-foreground mt-2 max-w-sm font-medium">
                                        Start your premium learning journey with a friendly hello!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col flex-1">
                                    {messages.map((msg, idx) => {
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
                                                    <div className="flex justify-center my-8 relative z-0">
                                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                            <div className="w-full border-t border-border/30"></div>
                                                        </div>
                                                        <span className="relative text-[11px] font-bold text-muted-foreground/60 bg-background px-4 py-1 rounded-full border border-border/40 shadow-sm uppercase tracking-widest">
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
                                                    onReply={setReplyingToMessage}
                                                    onEdit={(m) => {
                                                        setEditingMessage(m);
                                                        setNewMessage(m.text);
                                                        setReplyingToMessage(null);
                                                    }}
                                                    onDelete={handleDeleteMessage}
                                                />
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Typing Indicator */}
                            {otherIsTyping && (
                                <div className="flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-2 ml-1">
                                    <div className="size-8 rounded-full overflow-hidden shrink-0 shadow-sm mb-1 border-2 border-background ring-1 ring-black/5">
                                        {otherParticipant?.photoURL
                                            ? <img src={otherParticipant.photoURL} className="size-full object-cover" alt="" />
                                            : <div className="size-full bg-muted" />
                                        }
                                    </div>
                                    <div className="bg-muted/80 backdrop-blur-sm px-5 py-3.5 rounded-[22px] rounded-bl-sm flex items-center gap-2 w-fit shadow-sm border border-border/50">
                                        <span className="size-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="size-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                        <span className="size-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} className="h-6 shrink-0" />
                        </div>

                        {/* Input Bar with soft transition */}
                        <div className="sticky bottom-0 bg-background pt-2 z-40">
                            <ChatInputBar
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onSend={editingMessage ? handleSaveEdit : sendMessage}
                                onTyping={handleTyping}
                                onStopTyping={handleStopTyping}
                                onEmojiSelect={handleEmojiSelect}
                                replyingTo={replyingToMessage}
                                onCancelReply={() => setReplyingToMessage(null)}
                                editingMessage={editingMessage}
                                onCancelEdit={handleCancelEdit}
                                placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
                                sending={sending}
                            />
                        </div>

                        <EditHistoryModal 
                            isOpen={!!historyMessage}
                            onClose={() => setHistoryMessage(null)}
                            message={historyMessage}
                        />
                    </>
                ) : (
                    /* Empty state - Very premium */
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/[0.03]">
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-primary/20 rounded-[40px] blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
                            <div className="relative size-32 bg-background shadow-2xl rounded-[40px] flex items-center justify-center border border-border/50 transition-transform duration-500 group-hover:scale-110">
                                <MessageSquare size={48} className="text-primary/80" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">E-TuitionBD Messenger</h3>
                        <p className="text-[16px] text-muted-foreground max-w-sm mx-auto leading-relaxed font-medium">
                            Select a chat to start learning or collaborating with our expert tutors and students.
                        </p>
                        <div className="mt-10 flex gap-4">
                            <div className="px-4 py-2 bg-muted/50 rounded-full text-xs font-bold text-muted-foreground tracking-widest uppercase border border-border/30">Secure</div>
                            <div className="px-4 py-2 bg-muted/50 rounded-full text-xs font-bold text-muted-foreground tracking-widest uppercase border border-border/30">Fast</div>
                            <div className="px-4 py-2 bg-muted/50 rounded-full text-xs font-bold text-muted-foreground tracking-widest uppercase border border-border/30">Premium</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
