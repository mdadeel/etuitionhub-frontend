import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, User, BookOpen } from 'lucide-react';
import PoruaLogo from '../AiAssistant/PoruaLogo';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * MobileBottomNav Component - Provides a fixed bottom navigation for mobile users.
 * Structure: Home, Tutors, Tutions, Porua, Profile.
 * Directs guest users to login/signup for Profile.
 */
const MobileBottomNav = () => {
    const { user, dbUser } = useAuth();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Compass, label: 'Tutors', path: '/tutors' },
        { icon: BookOpen, label: 'Tutions', path: '/tuitions' },
        { icon: (props) => <PoruaLogo iconOnly {...props} />, label: 'Porua', path: '/ai-assistant' },
        { 
            icon: User, 
            label: 'Profile', 
            path: user ? '/dashboard' : '/login',
            isProfile: true 
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-card/80 backdrop-blur-2xl border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-around h-14">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center size-full gap-0.5 transition-all duration-300",
                            isActive
                                ? "text-primary scale-105"
                                : "text-slate-400 hover:text-muted-foreground"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {item.isProfile && user ? (
                                    <Avatar
                                        size="xs"
                                        className={cn(
                                            "size-5 rounded-full border transition-all duration-300",
                                            isActive 
                                                ? "border-primary ring-2 ring-primary/20 scale-105" 
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
                                                ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20 scale-105" 
                                                : "bg-slate-100 border-slate-300 text-slate-600"
                                        )}>
                                            {(dbUser?.displayName || user?.displayName || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "drop-shadow-[0_0_8px_hsl(var(--primary)/0.3)]")} />
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
