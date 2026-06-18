// components/AiAssistant/AiAssistantLayout.jsx
// Chrome for all AI Assistant pages. A slim icon sidebar on the left
// (desktop) with navigation, and a full-width main content area.
// The top header has been removed to give the chat more space.
import { cn } from '@/lib/utils';
import ModernSidebar from '../shared/ModernSidebar';
import { useTheme } from '../../contexts/ThemeContext';

export default function AiAssistantLayout({ children, showBack = false, rightSlot = null, className = '' }) {
    const { theme } = useTheme();

    return (
        <div className={cn('flex h-screen w-full bg-background overflow-hidden fixed inset-0 gap-1', className)}>
            {/* Desktop Sidebar */}
            <ModernSidebar className="hidden lg:flex shrink-0" />

            {/* Main content */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full relative pt-[60px] md:pt-[68px]">
                {children}
            </div>
        </div>
    );
}
