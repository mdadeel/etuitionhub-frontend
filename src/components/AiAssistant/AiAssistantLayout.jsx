// components/AiAssistant/AiAssistantLayout.jsx
// Chrome for all AI Assistant pages. A slim icon sidebar on the left
// (desktop) with navigation, and a full-width main content area.
// The top header has been removed to give the chat more space.
import { useState } from 'react';
import { cn } from '@/lib/utils';
import ModernSidebar from '../shared/ModernSidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, ChevronLeft } from 'lucide-react';

export default function AiAssistantLayout({ children, showBack = false, rightSlot = null, className = '' }) {
    const { theme } = useTheme();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className={cn('flex h-screen w-full bg-background overflow-hidden fixed inset-0 gap-1 pb-[env(safe-area-inset-bottom,0)]', className)}>
            {/* Desktop Sidebar */}
            <ModernSidebar className="hidden lg:flex shrink-0 z-40" />

            {/* Mobile Sidebar Overlay & Drawer */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] lg:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
            <div 
                className={cn(
                    "fixed inset-y-0 left-0 z-[120] w-[260px] bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex",
                    isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Mobile close button inside drawer top-right */}
                <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
                <ModernSidebar 
                    className="w-full flex shrink-0" 
                    isMobile={true}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />
            </div>

            {/* Mobile Header (Dedicated Top Bar) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-[56px] z-[60] flex items-center justify-between px-3 bg-background/95 backdrop-blur-md border-b border-border/40">
                <div className="flex items-center gap-1">
                    {showBack ? (
                        <button onClick={() => window.history.back()} className="p-2 -ml-1 text-foreground hover:bg-muted active:scale-95 transition-all duration-300 rounded-lg">
                            <ChevronLeft size={24} />
                        </button>
                    ) : (
                        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 -ml-1 text-foreground hover:bg-muted active:scale-95 transition-all duration-300 rounded-lg">
                            <Menu size={22} />
                        </button>
                    )}
                    <span className="text-sm font-semibold tracking-tight ml-1">Porua AI</span>
                </div>
                
                {rightSlot && (
                    <div className="flex items-center">
                        {rightSlot}
                    </div>
                )}
            </div>

            {/* Main content - add padding bottom for MobileBottomNav (h-14 = 56px) */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full relative pt-[56px] lg:pt-0 pb-14 lg:pb-0">
                {children}
            </div>
        </div>
    );
}
