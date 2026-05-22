import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { io } from 'socket.io-client';
import { Send, Search, User as UserIcon } from 'lucide-react';
import { Avatar } from '@/components/ui';
import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const ChatInterface = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const updateConversationListLastMessage = (convId, msg) => {
        setConversations(prev => 
            prev.map(c => c._id === convId ? { ...c, lastMessage: msg, updatedAt: new Date() } : c)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
    };

    const handleSelectConversation = async (conversation) => {
        setActiveConversation(conversation);
        
        // Join socket room
        if (socketRef.current) {
            socketRef.current.emit('join-room', conversation._id, user.uid);
        }

        try {
            const res = await api.get(`/api/messages/${conversation._id}`);
            setMessages(res.data);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/messages/conversations');
            setConversations(res.data);
            if (res.data.length > 0 && window.innerWidth >= 768) {
                handleSelectConversation(res.data[0]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    // Initialize Socket
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) return;

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        socketRef.current = io(backendUrl, {
            auth: { token },
            query: { token }
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected for chat');
        });

        socketRef.current.on('chat-message', (data) => {
            setMessages(prev => {
                // Prevent duplicate messages if sender
                if (data.senderId === user.uid) return prev;
                return [...prev, data];
            });
            // Update last message in conversation list
            updateConversationListLastMessage(data.conversationId, data);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [user]);

    // Fetch conversations
    useEffect(() => {
        fetchConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const otherParticipant = activeConversation.participants.find(p => p.email !== user.email);
        if (!otherParticipant) return;

        const messageData = {
            receiverId: otherParticipant._id,
            text: newMessage
        };

        try {
            const res = await api.post('/api/messages', messageData);
            const sentMsg = res.data;
            
            // Add to local state immediately
            setMessages(prev => [...prev, sentMsg]);
            
            // Emit via socket
            if (socketRef.current) {
                socketRef.current.emit('chat-message', {
                    ...sentMsg,
                    room: activeConversation._id
                });
            }

            setNewMessage('');
            scrollToBottom();
            updateConversationListLastMessage(activeConversation._id, sentMsg);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const filteredConversations = conversations.filter(c => {
        const other = c.participants.find(p => p.email !== user?.email);
        return other?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <div className="w-8 h-8 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-140px)] min-h-[600px] bg-white border border-[rgba(15,23,46,0.08)] rounded-none overflow-hidden shadow-none">
            {/* Left Sidebar: Conversations */}
            <div className={cn(
                "w-full md:w-1/3 min-w-[280px] md:max-w-[350px] border-r border-[rgba(15,23,46,0.08)] flex flex-col bg-[#F9FAFB]",
                activeConversation ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-[rgba(15,23,46,0.08)] bg-white">
                    <h2 className="text-lg font-heading text-[#111827] mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6475]/60" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-[#EEF2F6] border border-transparent rounded-none focus:outline-none focus:border-[#2563EB]/30 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-6 text-center text-sm text-[#5B6475]">
                            No conversations found.
                        </div>
                    ) : (
                        <div className="divide-y divide-[rgba(15,23,46,0.04)]">
                            {filteredConversations.map(conv => {
                                const other = conv.participants.find(p => p.email !== user?.email);
                                if (!other) return null;
                                
                                const isActive = activeConversation?._id === conv._id;
                                
                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={cn(
                                            "w-full p-4 flex items-center gap-3 text-left transition-colors",
                                            isActive ? "bg-blue-50/50" : "hover:bg-white"
                                        )}
                                    >
                                        <Avatar 
                                            src={other.photoURL} 
                                            alt={other.displayName}
                                            size="sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="font-medium text-sm text-[#111827] truncate">
                                                    {other.displayName}
                                                </h3>
                                                {conv.lastMessage && (
                                                    <span className="text-[10px] text-[#9CA3AF] shrink-0">
                                                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[#5B6475] truncate">
                                                {conv.lastMessage?.text || "Started a conversation"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Area: Active Chat */}
            <div className={cn(
                "flex-1 flex flex-col bg-white",
                activeConversation ? "flex" : "hidden md:flex"
            )}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-[rgba(15,23,46,0.08)] flex items-center gap-3 bg-white">
                            <button
                                onClick={() => setActiveConversation(null)}
                                className="md:hidden p-1.5 mr-1 hover:bg-slate-100 border border-slate-200 rounded-none text-slate-600 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            {(() => {
                                const other = activeConversation.participants.find(p => p.email !== user?.email);
                                return (
                                    <>
                                        <Avatar src={other?.photoURL} alt={other?.displayName} size="sm" />
                                        <div>
                                            <h3 className="font-heading text-sm text-[#111827]">{other?.displayName}</h3>
                                            <p className="text-[11px] text-[#2563EB] capitalize">{other?.role}</p>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F5F7FA]">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[#5B6475]">
                                    <UserIcon size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm">No messages yet.</p>
                                    <p className="text-xs opacity-60">Send a message to start the conversation.</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    // Match MongoDB ObjectId vs Firebase UID
                                    // since User model maps to Firebase via email/uid logic,
                                    // senderId check relies on backend returning ObjectId that matches session
                                    // We need to use DB ID for comparison if senderId is ObjectId
                                    // Assuming senderId string comparison works or backend sends user DB ID
                                    
                                    // Temporary fallback comparison
                                    const isMe = msg.senderId === user.dbUser?._id || msg.senderId === user.uid; 

                                     return (
                                        <div key={idx} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[70%] rounded-none px-4 py-2.5 text-sm",
                                                isMe 
                                                    ? "bg-[#2563EB] text-white border border-[#2563EB]" 
                                                    : "bg-white border border-[rgba(15,23,46,0.15)] text-[#111827]"
                                            )}>
                                                <p>{msg.text}</p>
                                                <span className={cn(
                                                    "text-[9px] block mt-1",
                                                    isMe ? "text-blue-100 text-right" : "text-[#9CA3AF]"
                                                )}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                         <div className="p-4 bg-white border-t border-[rgba(15,23,46,0.08)]">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-[#EEF2F6] border border-transparent focus:bg-white focus:border-[#2563EB]/30 rounded-none outline-none text-sm transition-all"
                                    style={{ borderRadius: '0px' }}
                                />
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="px-4 py-2.5 bg-[#2563EB] text-white rounded-none hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                >
                                    <Send size={18} className={newMessage.trim() ? "translate-x-0" : "-translate-x-1"} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#5B6475]">
                        <div className="w-16 h-16 bg-[#EEF2F6] rounded-none flex items-center justify-center mb-4">
                            <Send size={24} className="text-[#9CA3AF]" />
                        </div>
                        <h3 className="font-heading text-lg text-[#111827] mb-1">Your Messages</h3>
                        <p className="text-sm">Select a conversation to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
