import React from 'react';
import { ArrowLeft, Phone, Video, Info } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { useChat } from '../../contexts/ChatContext';

const ChatHeader = ({ conversation, user, onBack }) => {
    const { onlineUsers } = useChat();

    if (!conversation) return null;

    const other = conversation.participants.find(p => p.email !== user?.email);
    if (!other) return null;

    const isOnline = onlineUsers.has(other._id) || onlineUsers.has(other.uid);

    return (
        <div className="sticky top-0 z-20 px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="md:hidden hover:bg-muted p-2 -ml-2 rounded-full transition-colors text-muted-foreground"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                
                <div className="relative">
                    <Avatar src={other.photoURL} alt={other.displayName} size="sm" className="w-9 h-9" />
                    {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                </div>

                <div className="flex flex-col">
                    <h3 className="font-semibold text-sm text-foreground leading-tight">
                        {other.displayName}
                    </h3>
                    <span className="text-[11px] text-muted-foreground font-medium">
                        {isOnline ? (
                            <span className="text-green-600">Active now</span>
                        ) : (
                            <span>Offline</span>
                        )}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 text-[#2563EB]">
                <button className="p-2 hover:bg-[#2563EB]/10 rounded-full transition-colors">
                    <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-[#2563EB]/10 rounded-full transition-colors">
                    <Video size={20} />
                </button>
                <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground ml-1">
                    <Info size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
