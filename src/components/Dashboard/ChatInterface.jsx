import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import api from '../../services/api';
import { Search, MessageSquare, Filter, List, Calendar, Trophy, SendHorizontal, Bookmark, CircleHelp, Tag, X, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ChatSidebarItem from '../chat/ChatSidebarItem';
import ChatHeader from '../chat/ChatHeader';
import MessageBubble from '../chat/MessageBubble';
import ChatInputBar from '../chat/ChatInputBar';
import EditHistoryModal from '../chat/EditHistoryModal';
import PollDisplay from '../chat/PollDisplay';
import AssignmentCard from '../chat/AssignmentCard';

import MilestoneTimeline from '../chat/MilestoneTimeline';

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
    
    // Educational feature states
    const [showPoll, setShowPoll] = useState(null);
    const [showAssignment, setShowAssignment] = useState(null);
    const [showMilestoneTimeline, setShowMilestoneTimeline] = useState(false);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all'); // all, unread, milestone, tagged
    const [selectedTags, setSelectedTags] = useState([]);

    // Derived values
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

    const handleEmojiSelect = useCallback((emoji) => {
        setNewMessage(prev => prev + emoji);
    }, []);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior });
        }, 100);
    }, []);

    // Filter messages based on search query and filters
    useEffect(() => {
        if (!activeConversation) {
            setFilteredMessages([]);
            return;
        }

        let filtered = [...messages];
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(msg => 
                msg.text && msg.text.toLowerCase().includes(query)
            );
        }
        
        // Apply active filter
        switch (activeFilter) {
            case 'unread':
                filtered = filtered.filter(msg => !msg.isRead);
                break;
            case 'milestone':
                filtered = filtered.filter(msg => msg.isMilestone);
                break;
            case 'tagged':
                if (selectedTags.length > 0) {
                    filtered = filtered.filter(msg => 
                        msg.tags && msg.tags.some(tag => selectedTags.includes(tag))
                    );
                } else {
                    filtered = filtered.filter(msg => 
                        msg.tags && msg.tags.length > 0
                    );
                }
                break;
            default: // 'all'
                // No additional filtering
                break;
        }
        
        setFilteredMessages(filtered);
    }, [messages, searchQuery, activeFilter, selectedTags, activeConversation]);



    const handleSelectConversation = useCallback(async (conversation) => {
        setActiveConversation(conversation);
        setLoading(true);
        setMessages([]);
        setReplyingToMessage(null);
        setEditingMessage(null);
        setSearchQuery('');
        setActiveFilter('all');
        setSelectedTags([]);

        // Reset educational feature modals
        setShowPoll(null);
        setShowAssignment(null);
        setShowMilestoneTimeline(false);

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

        // Handle educational feature events
        const handlePollCreated = (data) => {
            if (data.room === activeConversation._id) {
                // Add or update poll in messages
                setMessages(prev => {
                    const existingIndex = prev.findIndex(msg => msg.pollId === data._id.toString());
                    if (existingIndex >= 0) {
                        const updatedMsg = { ...prev[existingIndex], ...data };
                        const newMessages = [...prev];
                        newMessages[existingIndex] = updatedMsg;
                        return newMessages;
                    }
                    return prev;
                });
            }
        };

        const handlePollUpdated = (data) => {
            if (data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg.pollId === data._id.toString() 
                        ? { ...msg, ...data } 
                        : msg
                ));
            }
        };

        const handleAssignmentCreated = (data) => {
            if (data.room === activeConversation._id) {
                setMessages(prev => {
                    const existingIndex = prev.findIndex(msg => msg.assignmentId === data._id.toString());
                    if (existingIndex >= 0) {
                        const updatedMsg = { ...prev[existingIndex], ...data };
                        const newMessages = [...prev];
                        newMessages[existingIndex] = updatedMsg;
                        return newMessages;
                    }
                    return prev;
                });
            }
        };

        const handleAssignmentUpdated = (data) => {
            if (data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg.assignmentId === data._id.toString() 
                        ? { ...msg, ...data } 
                        : msg
                ));
            }
        };

        const handleMilestoneCreated = (data) => {
            if (data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg._id === data._id.toString() 
                        ? { ...msg, isMilestone: true } 
                        : msg
                ));
            }
        };

        const handleTemplateUsed = (data) => {
            if (data.room === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg._id === data._id.toString() 
                        ? { ...msg, templateId: data.templateId } 
                        : msg
                ));
            }
        };

        socket.on('chat-message', handleNewMessage);
        socket.on('message-reaction', handleMessageReaction);
        socket.on('message-edited', handleMessageEdited);
        socket.on('message-deleted', handleMessageDeleted);
        socket.on('poll-created', handlePollCreated);
        socket.on('poll-updated', handlePollUpdated);
        socket.on('assignment-created', handleAssignmentCreated);
        socket.on('assignment-updated', handleAssignmentUpdated);
        socket.on('milestone-created', handleMilestoneCreated);
        socket.on('template-used', handleTemplateUsed);

        return () => {
            socket.off('chat-message', handleNewMessage);
            socket.off('message-reaction', handleMessageReaction);
            socket.off('message-edited', handleMessageEdited);
            socket.off('message-deleted', handleMessageDeleted);
            socket.off('poll-created', handlePollCreated);
            socket.off('poll-updated', handlePollUpdated);
            socket.off('assignment-created', handleAssignmentCreated);
            socket.off('assignment-updated', handleAssignmentUpdated);
            socket.off('milestone-created', handleMilestoneCreated);
            socket.off('template-used', handleTemplateUsed);
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
            setReplyingToMessage(null);

            if (socket) {
                socket.emit('message-edited', { ...updatedMsg, room: activeConversation._id });
            }
            toast.success('Message updated');
        } catch (error) {
            console.error('Error editing message:', error);
            toast.error('Failed to edit message');
        }
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
        setNewMessage('');
        setReplyingToMessage(null);
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
            socket.emit('typing', {
                room: activeConversation._id,
                senderId: user.uid
            });
        }
    };

    const handleStopTyping = () => {
        if (socket && activeConversation) {
            socket.emit('stop-typing', {
                room: activeConversation._id,
                senderId: user.uid
            });
        }
    };

    // Handle sending new message with format
    const handleSendWithFormat = async () => {
        if (!newMessage.trim() || !activeConversation || sending) return;
        if (!otherParticipant) return;

        const text = newMessage.trim();
        const replyToId = replyingToMessage ? replyingToMessage._id : null;
        
        setNewMessage('');
        setReplyingToMessage(null);
        setSending(true);

        try {
            const res = await api.post(`/api/messages`, {
                receiverId: otherParticipant._id,
                text,
                ...(replyToId && { replyToId })
            });
            const sentMsg = {
                ...res.data,
                tags: selectedTags
            };

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

    // Auto-select first conversation on desktop
    useEffect(() => {
        if (!activeConversation && conversations.length > 0 && window.innerWidth >= 768) {
            handleSelectConversation(conversations[0]);
        }
    }, [conversations, activeConversation, handleSelectConversation]);

    return (
        <div className="flex h-[calc(100vh_-_4rem)] w-full">
            {/* Sidebar */}
            <div className="w-64 border-r border-border/50">
                <div className="flex h-full flex-col">
                    {/* Search Conversations */}
                    <div className="p-4 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <Search size={20} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {filteredConversations.map((conversation) => (
                            <ChatSidebarItem
                                key={conversation._id}
                                conv={conversation}
                                user={user}
                                isActive={activeConversation?._id === conversation._id}
                                onClick={handleSelectConversation}
                            />
                        ))}
                        {filteredConversations.length === 0 && (
                            <div className="text-center py-8 text-xs text-muted-foreground">
                                {searchQuery ? 'No chats found matching search.' : 'No conversations yet. Start a new chat to begin learning together.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Session Context Header (shown when there's an active conversation) */}
                {activeConversation && (
                    <div className="px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                {/* Session Info */}
                                <div className="flex items-center gap-2">
                                    <Calendar size={20} className="text-primary" />
                                    <div className="text-sm font-medium text-foreground">
                                        {activeConversation.sessionTitle || 'Learning Session'}
                                    </div>
                                </div>
                                
                                {/* Subject/Topic */}
                                {activeConversation.sessionSubject && (
                                    <div className="flex items-center gap-2">
                                        <Bookmark size={20} className="text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {activeConversation.sessionSubject}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Educational Focus Badge */}
                                {activeConversation.sessionType && (
                                    <div className="flex items-center gap-1">
                                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            activeConversation.sessionType === 'tutoring' 
                                                ? 'bg-primary/10 text-primary' 
                                                : activeConversation.sessionType === 'homework_help'
                                                ? 'bg-success/10 text-success'
                                                : activeConversation.sessionType === 'exam_prep'
                                                ? 'bg-warning/10 text-warning'
                                                : 'bg-muted/10 text-muted-foreground'
                                        }`}
                                        >
                                            {activeConversation.sessionType.replace('_', ' ').toUpperCase()}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() => setShowPoll(true)}
                                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                                    title="Create Poll"
                                >
                                    <CircleHelp size={20} className="text-muted-foreground" />
                                </button>
                                <button
                                    onClick={() => setShowAssignment(true)}
                                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                                    title="Create Assignment"
                                >
                                    <List size={20} className="text-muted-foreground" />
                                </button>
                                <button
                                    onClick={() => setShowMilestoneTimeline(true)}
                                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                                    title="View Milestones"
                                >
                                    <Trophy size={20} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Filter Controls */}
                        <div className="flex items-center gap-3 px-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Filter size={20} className="text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Filter:</span>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        // In a real app, this would open a filter dropdown
                                        // For simplicity, we'll cycle through filters
                                        const filters = ['all', 'unread', 'milestone', 'tagged'];
                                        const currentIndex = filters.indexOf(activeFilter);
                                        const nextIndex = (currentIndex + 1) % filters.length;
                                        setActiveFilter(filters[nextIndex]);
                                    }}
                                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                                >
                                    {activeFilter === 'all' ? (
                                        <List size={18} className="text-primary" />
                                    ) : activeFilter === 'unread' ? (
                                        <CircleHelp size={18} className="text-success" />
                                    ) : activeFilter === 'milestone' ? (
                                        <Trophy size={18} className="text-warning" />
                                    ) : activeFilter === 'tagged' ? (
                                        <Tag size={18} className="text-info" />
                                    ) : (
                                        <List size={18} className="text-primary" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Tag Filter Chips */}
                            {activeFilter === 'tagged' && selectedTags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 ml-4">
                                    {selectedTags?.map((tag, index) => (
                                        <div key={`${tag}-${index}`} className="flex items-center gap-1">
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                #{tag}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    const newTags = [...selectedTags];
                                                    newTags.splice(index, 1);
                                                    setSelectedTags(newTags);
                                                }}
                                                className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                                            >
                                                <X size={12} className="text-primary/50" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className="ml-2 p-1 rounded-full hover:bg-muted/50 transition-colors text-xs"
                                        title="Clear all tags"
                                    >
                                        <X size={14} className="text-muted-foreground" />
                                    </button>
                                </div>
                            )}
                            

                        </div>
                    </div>
                )}
                
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    {!activeConversation ? (
                        /* Empty state - Very premium */
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="relative mb-6">
                                <div className="size-24 bg-muted/40 rounded-[24px] flex items-center justify-center border border-border/50">
                                    <MessageSquare size={36} className="text-primary/80" />
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
                    ) : loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="size-10 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin" />
                                <span className="text-xs font-medium text-muted-foreground animate-pulse">Loading history...</span>
                            </div>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="size-24 bg-muted/40 rounded-[24px] flex items-center justify-center border border-border/50 mx-auto mb-4">
                                <MessageSquare size={36} className="text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">{otherParticipant?.displayName || 'Chat'}</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs font-medium mx-auto">
                                Start your premium learning journey with a friendly hello!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Date Group Separators and Messages */}
                            {filteredMessages.map((msg, idx) => {
                                if (!msg || !msg.text) return null;

                                const senderIdStr = String(msg.senderId);
                                const isMe = senderIdStr === myParticipantId || senderIdStr === String(user.uid);

                                const prevMsg = filteredMessages[idx - 1];
                                const nextMsg = filteredMessages[idx + 1];

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
                                            key={msg._id}
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
                                            onViewPoll={(pollId) => setShowPoll(pollId)}
                                            onViewAssignment={(assignmentId) => setShowAssignment(assignmentId)}
                                             onCopyCode={() => {/* TODO: implement code copy functionality */}}
                                            onViewMilestoneTimeline={() => setShowMilestoneTimeline(true)}
                                        />
                                    </React.Fragment>
                                );
                            })}
                            
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
                    )}
                </div>

                {/* Input Bar with soft transition */}
                <div className="sticky bottom-0 bg-background pt-2 z-40">
                    <ChatInputBar
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onSend={editingMessage ? handleSaveEdit : handleSendWithFormat}
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

                {/* Educational Feature Modals */}
                {showPoll && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <PollDisplay 
                            pollId={showPoll} 
                            onClose={() => setShowPoll(null)}
                            onUpdate={() => {
                                // Handle poll updates (like voting)
                                // In a real implementation, this would update the message
                            }}
                        />
                    </div>
                )}
                
                {showAssignment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <AssignmentCard 
                            assignmentId={showAssignment} 
                            onClose={() => setShowAssignment(null)}
                            onUpdate={() => {
                                // Handle assignment updates (like submission/grading)
                            }}
                        />
                    </div>
                )}
                

                
                {showMilestoneTimeline && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <MilestoneTimeline 
                            conversationId={activeConversation._id}
                            onClose={() => setShowMilestoneTimeline(false)}
                        />
                    </div>
                )}

                <EditHistoryModal 
                    isOpen={!!historyMessage}
                    onClose={() => setHistoryMessage(null)}
                    message={historyMessage}
                />
            </div>
        </div>
    );
};

export default ChatInterface;
