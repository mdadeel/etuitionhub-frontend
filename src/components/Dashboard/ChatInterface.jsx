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
import { Avatar } from '@/components/ui/avatar';

import MilestoneTimeline from '../chat/MilestoneTimeline';
import { cn } from '@/lib/utils';

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

    // 2026 Redesign UI States
    const [activeSidebarTab, setActiveSidebarTab] = useState('all');


    const [showInfoModal, setShowInfoModal] = useState(false);

    // Derived values
    const { onlineUsers } = useChat(); // Retrieve online users set

    const filteredConversations = conversations.filter(c => {
        const other = c.participants.find(p => p.email !== user?.email);
        const matchesSearch = other?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              other?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        if (activeSidebarTab === 'unread') return c.unreadCount > 0;
        if (activeSidebarTab === 'archived') return c.isArchived;
        return !c.isArchived;
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
        <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
            {/* Sidebar */}
            <div className={cn(
                "w-80 border-r border-border/40 shrink-0 md:flex flex-col bg-card/25 backdrop-blur-md transition-all duration-300",
                activeConversation ? "hidden md:flex" : "flex w-full"
            )}>
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 pb-2 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-foreground font-heading">Messages</h3>
                        <button 
                            onClick={() => toast('New message compose coming soon')}
                            className="p-2 hover:bg-[color:hsl(var(--chat-hover))] rounded-full text-foreground/80 hover:text-foreground transition-all active:scale-95"
                            title="New Message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                        </button>
                    </div>

                    {/* Search Conversations */}
                    <div className="px-4 pb-3 flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-muted/50 dark:bg-muted/30 px-3.5 py-2 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-all">
                            <Search size={16} className="text-muted-foreground/60" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/50 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            className="p-2.5 bg-muted/50 dark:bg-muted/30 hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-colors"
                            title="Filter Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="12" x2="12" y1="18" y2="22"/></svg>
                        </button>
                    </div>

                    {/* Sidebar Tabs */}
                    <div className="px-4 pb-2.5 flex gap-1.5 border-b border-border/30">
                        <button
                            onClick={() => setActiveSidebarTab('all')}
                            className={cn(
                                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all",
                                activeSidebarTab === 'all'
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/60"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveSidebarTab('unread')}
                            className={cn(
                                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1",
                                activeSidebarTab === 'unread'
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/60"
                            )}
                        >
                            Unread
                            {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                                <span className="size-1.5 bg-[#0A7CFF] rounded-full animate-pulse" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveSidebarTab('archived')}
                            className={cn(
                                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all",
                                activeSidebarTab === 'archived'
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/60"
                            )}
                        >
                            Archived
                        </button>
                    </div>
                    
                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
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
                            <div className="text-center py-12 px-4 text-xs text-muted-foreground">
                                {searchQuery ? 'No chats found matching search.' : 'No conversations yet.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col relative bg-background",
                activeConversation ? "flex" : "hidden md:flex"
            )}>
                {/* Header */}
                {activeConversation && (
                    <div className="shrink-0 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/40 z-40">
                        <div className="flex items-center justify-between w-full gap-4">
                            {/* Left: User Avatar & Info */}
                            <div className="flex items-center gap-3 min-w-0">
                                <button 
                                    onClick={() => setActiveConversation(null)} 
                                    className="md:hidden p-2 hover:bg-muted rounded-full transition-colors text-foreground active:scale-95"
                                    aria-label="Back to conversations"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                                </button>
                                
                                <div className="relative cursor-pointer group shrink-0">
                                    <Avatar src={otherParticipant?.photoURL} alt={otherParticipant?.displayName} size="md" className="size-11 rounded-full shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-200" />
                                    {onlineUsers.has(otherParticipant?._id) && (
                                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background ring-1 ring-black/5" />
                                    )}
                                </div>
                  
                                <div className="flex flex-col justify-center min-w-0">
                                    <h3 className="font-bold text-[15px] text-foreground leading-tight truncate">
                                        {otherParticipant?.displayName || otherParticipant?.email || 'Unknown User'}
                                    </h3>
                                    <span className="text-[11px] text-muted-foreground mt-0.5 font-medium leading-none">
                                        {onlineUsers.has(otherParticipant?._id) ? (
                                            <span className="text-green-600 dark:text-green-500 font-bold flex items-center gap-1">
                                                <span className="size-1.5 bg-green-500 rounded-full animate-pulse" />
                                                Active now
                                            </span>
                                        ) : (
                                            <span>Offline</span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Center: Session / Academic Information Capsule */}
                            <div className="hidden lg:flex items-center gap-2.5 max-w-[320px] xl:max-w-md bg-muted/40 dark:bg-muted/20 px-3.5 py-1.5 rounded-full border border-border/20 text-xs truncate">
                                <Calendar size={13} className="text-primary shrink-0" />
                                <span className="font-bold text-foreground/90 max-w-[120px] truncate leading-none">
                                    {activeConversation.sessionTitle || 'Learning Session'}
                                </span>
                                {activeConversation.sessionSubject && (
                                    <>
                                        <span className="text-border/60 font-light">|</span>
                                        <span className="text-muted-foreground font-semibold truncate leading-none">
                                            {activeConversation.sessionSubject}
                                        </span>
                                    </>
                                )}
                                {activeConversation.sessionType && (
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-extrabold rounded-full uppercase tracking-wider scale-95 shrink-0">
                                        {activeConversation.sessionType.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                            
                            {/* Right: Actions (Call, Video, Info + Educational Actions) */}
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => toast('Voice calls coming soon')}
                                    className="p-2 rounded-full hover:bg-[color:hsl(var(--chat-hover))] transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                                    title="Voice Call"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </button>
                                <button
                                    onClick={() => toast('Video calls coming soon')}
                                    className="p-2 rounded-full hover:bg-[color:hsl(var(--chat-hover))] transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                                    title="Video Call"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                                </button>
                                <button
                                    onClick={() => setShowInfoModal(true)}
                                    className="p-2 rounded-full hover:bg-[color:hsl(var(--chat-hover))] transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                                    title="View Info"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                </button>

                                <div className="w-px h-5 bg-border/40 mx-1.5" />

                                <button
                                    onClick={() => setShowPoll(true)}
                                    className="p-2 rounded-full hover:bg-[color:hsl(var(--chat-hover))] transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                                    title="Create Poll"
                                >
                                    <CircleHelp size={18} strokeWidth={2.2} />
                                </button>
                                <button
                                    onClick={() => setShowAssignment(true)}
                                    className="p-2 rounded-full hover:bg-[color:hsl(var(--chat-hover))] transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                                    title="Create Assignment"
                                >
                                    <List size={18} strokeWidth={2.2} />
                                </button>
                                <button
                                    onClick={() => setShowMilestoneTimeline(true)}
                                    className="p-2 rounded-full hover:bg-[color:hsl(var(--chat-hover))] transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                                    title="View Milestones"
                                >
                                    <Trophy size={18} strokeWidth={2.2} />
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
                <div className="flex-1 min-h-0 overflow-y-auto p-4">
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
                            {(() => {
                                // Find the ID of the last message sent by me
                                const lastOutgoing = [...filteredMessages].reverse().find(msg => {
                                    if (!msg) return false;
                                    const senderIdStr = String(msg.senderId);
                                    return senderIdStr === myParticipantId || senderIdStr === String(user.uid);
                                });
                                const latestOutgoingMsgId = lastOutgoing?._id;

                                return filteredMessages.map((msg, idx) => {
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
                                });
                            })()}
                            
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

                {/* Input Bar */}
                <div className="shrink-0 bg-background border-t border-border/30 p-3">
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

                {/* 2026 Redesign Call and Info Modals */}
                {showInfoModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in animate-duration-150">
                        <div className="bg-card border border-border/50 shadow-2xl rounded-3xl w-[380px] max-w-[90%] p-6 flex flex-col gap-5 animate-scale-in text-foreground">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold font-heading">Conversation Details</h3>
                                <button 
                                    onClick={() => setShowInfoModal(false)}
                                    className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div className="flex flex-col items-center gap-3 py-4 border-b border-border/30">
                                <Avatar src={otherParticipant?.photoURL} alt={otherParticipant?.displayName} className="size-20 rounded-full" />
                                <div className="text-center">
                                    <h4 className="font-bold text-base">{otherParticipant?.displayName}</h4>
                                    <p className="text-xs text-muted-foreground">{otherParticipant?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Academic Session</h5>
                                    <div className="bg-muted/30 dark:bg-muted/15 p-3.5 rounded-2xl border border-border/20 text-xs leading-normal">
                                        <p className="font-bold text-foreground">{activeConversation.sessionTitle || 'Learning Session'}</p>
                                        {activeConversation.sessionSubject && (
                                            <p className="text-muted-foreground mt-1 font-medium">Subject: <span className="font-semibold text-foreground">{activeConversation.sessionSubject}</span></p>
                                        )}
                                        {activeConversation.sessionType && (
                                            <p className="text-muted-foreground mt-0.5 font-medium">Focus: <span className="font-semibold text-foreground uppercase text-[10px] tracking-wide">{activeConversation.sessionType.replace('_', ' ')}</span></p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2.5 border-b border-border/10 text-xs">
                                    <span className="text-muted-foreground font-semibold">User Status</span>
                                    <span className="font-bold text-green-500 flex items-center gap-1">
                                        {onlineUsers.has(otherParticipant?._id) ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setShowInfoModal(false)}
                                className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/95 transition-all text-xs mt-2 active:scale-98"
                            >
                                Close Info
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
