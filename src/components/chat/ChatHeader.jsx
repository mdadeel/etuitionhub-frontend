import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { useChat } from '../../contexts/ChatContext';

const ChatHeader = ({ conversation, user, onBack }) => {
    const { onlineUsers } = useChat();

    if (!conversation) return null;

    const other = conversation.participants.find(p => p.email !== user?.email);
    if (!other) return null;

    const isOnline = onlineUsers.has(other._id) || onlineUsers.has(other.uid);

    return (
        <div className="sticky top-0 z-20 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="md:hidden hover:bg-muted p-2 -ml-2 rounded-full transition-colors text-foreground active:scale-95"
                        aria-label="Back to conversations"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <Avatar src={other.photoURL} alt={other.displayName} size="md" className="w-10 h-10 rounded-full shadow-sm transition-transform group-hover:scale-105" />
                        {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                    </div>
      
                    <div className="flex flex-col justify-center">
                        <h3 className="font-semibold text-[15px] text-foreground leading-tight">
                            {other.displayName || other.email || 'Unknown User'}
                        </h3>
                        <span className="text-[12px] text-muted-foreground mt-0.5">
                            {isOnline ? (
                                <span className="text-green-600 dark:text-green-500 font-medium">Active now</span>
                            ) : (
                                <span>Offline</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
