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
    useTheme();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className={cn('flex w-full bg-background overflow-hidden fixed top-14 md:top-16 inset-x-0 bottom-0 gap-1 pb-[env(safe-area-inset-bottom,0)]', className)}>
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
                    className="absolute top-4 right-4 z-50 p-2 bg-muted/65 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 rounded-full transition-all duration-200"
                >
                    <X size={18} />
                </button>
                <ModernSidebar 
                    className="w-full flex shrink-0" 
                    isMobile={true}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />
            </div>

            {/* Main content - add padding bottom for MobileBottomNav (h-14 = 56px) */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full relative pb-14 lg:pb-0">
                {/* Mobile Header (inline, sits under global Navbar) */}
                <div className="lg:hidden flex h-12 shrink-0 items-center justify-between px-3 bg-background border-b border-border/40">
                    <div className="flex items-center gap-1">
                        {showBack ? (
                            <button onClick={() => window.history.back()} className="p-2 -ml-1 text-foreground hover:bg-muted active:scale-95 transition-all duration-250 rounded-xl">
                                <ChevronLeft size={20} />
                            </button>
                        ) : (
                            <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 -ml-1 text-foreground hover:bg-muted active:scale-95 transition-all duration-250 rounded-xl">
                                <Menu size={20} />
                            </button>
                        )}
                        <span className="text-sm font-semibold tracking-tight ml-1.5">Porua AI</span>
                    </div>
                    
                    {rightSlot && (
                        <div className="flex items-center">
                            {rightSlot}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
