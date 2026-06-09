import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, BookOpen, LogIn, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import API_URL from '../../config/api';
import PoruaLogo from '../AiAssistant/PoruaLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * MobileBottomNav Component - Provides a fixed bottom navigation for mobile users.
 * Adapts items based on the user's role (anonymous, student, tutor, admin).
 * Adheres to thumb-zone design principles.
 */
const MobileBottomNav = () => {
    const { user, dbUser, loading } = useAuth();

    // eslint-disable-next-line no-unused-vars
    const getFullUrl = (url) => {
        if (!url || typeof url !== 'string') return url;
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
        if (url.startsWith('/')) return `${API_URL}${url}`;
        return url;
    };

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Compass, label: 'Tutors', path: '/tutors' },
        { icon: BookOpen, label: 'Tuitions', path: '/tuitions' },
    ];

    if (!loading && user) {
        navItems.push({
            icon: (props) => <PoruaLogo iconOnly {...props} />,
            label: 'Porua',
            path: '/ai-assistant',
        });
        navItems.push({
            label: 'Profile',
            path: '/dashboard',
            isProfile: true
        });
    } else {
        navItems.push({
            icon: LogIn,
            label: 'Sign In',
            path: '/login'
        });
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-card/80 backdrop-blur-2xl border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center size-full gap-1 transition-all duration-300",
                            isActive
                                ? "text-blue-600 scale-105"
                                : "text-slate-400 hover:text-muted-foreground"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {item.isProfile ? (
                                    <Avatar
                                        size="xs"
                                        className={cn(
                                            "size-5 rounded-full border transition-all duration-300",
                                            isActive 
                                                ? "border-blue-600 ring-2 ring-blue-600/20 scale-105" 
                                                : "border-slate-300"
                                        )}
                                    >
                                        <AvatarImage
                                            src={dbUser?.photoURL || user?.photoURL}
                                            alt={dbUser?.displayName || user?.displayName}
                                            gender={dbUser?.gender}
                                        />
                                        <AvatarFallback className={cn(
                                            "size-full rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300",
                                            isActive 
                                                ? "bg-blue-50 border-blue-600 text-blue-600 ring-2 ring-blue-600/20 scale-105" 
                                                : "bg-slate-100 border-slate-300 text-slate-600"
                                        )}>
                                            {(dbUser?.displayName || user?.displayName || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]")} />
                                )}
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest",
                                    isActive ? "opacity-100" : "opacity-60"
                                )}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
