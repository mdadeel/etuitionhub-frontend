// components/AiAssistant/AiAssistantLayout.jsx
// Chrome for all AI Assistant pages. A slim icon sidebar on the left
// (desktop) with navigation, and a full-width main content area.
// The top header has been removed to give the chat more space.
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import ModernSidebar from '../shared/ModernSidebar';
import { useAiStore } from '../../store/aiStore';

const UI_THEME_KEY = 'ui-theme';

function applyThemeClass(theme) {
    const root = window.document.documentElement;
    if (theme === 'light') {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }
}

// eslint-disable-next-line no-unused-vars
export default function AiAssistantLayout({ children, showBack = false, rightSlot = null, className = '' }) {
    const theme = useAiStore((s) => s.theme);
    const setTheme = useAiStore((s) => s.setTheme);

    // Sync theme to DOM and localStorage. We use a custom local storage
    // key so other parts of the app (e.g. global theme toggle) can read it.
    useEffect(() => {
        applyThemeClass(theme);
        try {
            localStorage.setItem(UI_THEME_KEY, theme);
        } catch { /* ignore */ }
    }, [theme]);

    // Initial mount sync: if the AI store doesn't match the browser's
    // pull in the separate `ui-theme` key for backwards compat.
    useEffect(() => {
        try {
            const stored = localStorage.getItem(UI_THEME_KEY);
            if (stored && stored !== theme) setTheme(stored);
        } catch { /* ignore */ }
    }, [setTheme, theme]);

    // eslint-disable-next-line no-unused-vars
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <div className={cn('flex h-screen w-full bg-background overflow-hidden fixed inset-0 gap-1', className)}>
            {/* Desktop Sidebar */}
            <ModernSidebar className="hidden lg:flex shrink-0" />

            {/* Main content */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full relative pt-[58px]">
                {children}
            </div>
        </div>
    );
}
