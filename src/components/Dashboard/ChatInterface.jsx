import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import api from '../../services/api';
import { Search, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ChatSidebarItem from '../chat/ChatSidebarItem';
import ChatHeader from '../chat/ChatHeader';
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

const ChatInterface = () => {
    const { user } = useAuth();
    const { socket, conversations, fetchConversations, markAsRead, typingUsers } = useChat();
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
    }, []);

    const handleSelectConversation = useCallback(async (conversation) => {
        setActiveConversation(conversation);
        setLoading(true);
        setMessages([]);

        if (socket) {
            socket.emit('join-room', conversation._id, user.uid);
        }

        try {
            const res = await api.get(`/api/messages/${conversation._id}`);
            // Guard: filter out malformed messages with no text
            setMessages(res.data.filter(m => m && m.text));
            scrollToBottom();
            if (conversation.unreadCount > 0) {
                markAsRead(conversation._id);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [socket, user, markAsRead, scrollToBottom]);

    // Auto-select first conversation on desktop
    useEffect(() => {
        if (!activeConversation && conversations.length > 0 && window.innerWidth >= 768) {
            handleSelectConversation(conversations[0]);
        }
    }, [conversations]);

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

        const handleMessagesRead = (data) => {
            if (data.conversationId === activeConversation._id) {
                setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
            }
        };

        const handleMessageReaction = (data) => {
            if (data.room === activeConversation._id) {
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
    }, [socket, activeConversation]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConversation) return;

        const otherParticipant = activeConversation.participants.find(p => p.email !== user.email);
        if (!otherParticipant) return;

        const text = newMessage.trim();
        setNewMessage('');

        try {
            const res = await api.post('/api/messages', { receiverId: otherParticipant._id, text });
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

    // Resolve current user's participant ID once per active conversation
    const myParticipantId = activeConversation
        ? (() => {
            const me = activeConversation.participants.find(p => p.email?.toLowerCase() === user?.email?.toLowerCase());
            return me ? String(me._id) : String(user.dbUser?._id);
        })()
        : null;

    const otherParticipant = activeConversation
        ? activeConversation.participants.find(p => p.email?.toLowerCase() !== user?.email?.toLowerCase())
        : null;

    // Check if other user is typing in this conversation
    const otherIsTyping = activeConversation && otherParticipant
        ? typingUsers.has(`${activeConversation._id}_${otherParticipant._id}`) ||
          typingUsers.has(`${activeConversation._id}_${otherParticipant.uid}`)
        : false;

    return (
        <div className="flex h-[calc(100vh-140px)] min-h-[600px] bg-card border border-border rounded-xl overflow-hidden shadow-sm">

            {/* ── Left Sidebar ── */}
            <div className={cn(
                "w-full md:w-[320px] shrink-0 border-r border-border flex flex-col bg-background",
                activeConversation ? "hidden md:flex" : "flex"
            )}>
                {/* Sidebar header */}
                <div className="p-4 pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-transparent rounded-full focus:outline-none focus:border-[#2563EB]/30 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto py-1">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageSquare size={28} className="mx-auto mb-2 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">No conversations yet.</p>
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
                "flex-1 flex flex-col bg-background/50 min-w-0",
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
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="w-7 h-7 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        {otherParticipant?.photoURL
                                            ? <img src={otherParticipant.photoURL} className="w-full h-full rounded-full object-cover" alt="" />
                                            : <MessageSquare size={24} className="text-muted-foreground/40" />
                                        }
                                    </div>
                                    <p className="font-semibold text-foreground">{otherParticipant?.displayName}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Say hello to start the conversation!</p>
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
                                                <div className="flex justify-center my-5">
                                                    <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 border border-border/50 px-3 py-1 rounded-full">
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
                                <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-border/50 mb-1">
                                        {otherParticipant?.photoURL
                                            ? <img src={otherParticipant.photoURL} className="w-full h-full object-cover" alt="" />
                                            : <div className="w-full h-full bg-muted" />
                                        }
                                    </div>
                                    <div className="bg-muted/80 border border-border/50 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        {/* Input Bar */}
                        <ChatInputBar
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onSend={sendMessage}
                            onTyping={handleTyping}
                            onStopTyping={handleStopTyping}
                            placeholder={`Message ${otherParticipant?.displayName || ''}...`}
                        />
                    </>
                ) : (
                    /* Empty state */
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <div className="w-20 h-20 bg-muted/60 border border-border rounded-full flex items-center justify-center mb-5">
                            <MessageSquare size={32} className="text-muted-foreground/40" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground mb-1.5">Your Messages</h3>
                        <p className="text-sm max-w-xs">Select a conversation from the list to start chatting or contact a tutor from their profile.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
