import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * MobileBottomNav Component - Provides a fixed bottom navigation for mobile users.
 * Adheres to thumb-zone design principles.
 */
const MobileBottomNav = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/tuitions' },
        { icon: LayoutDashboard, label: 'Dash', path: '/dashboard' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-slate-200 pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
                            isActive 
                                ? "text-blue-600 scale-105" 
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]")} />
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
