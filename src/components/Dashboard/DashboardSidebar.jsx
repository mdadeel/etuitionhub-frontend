import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    FileText, 
    Users, 
    ShieldCheck, 
    ChevronRight,
    Settings
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppleBadge } from '../shared/AppleUI';
import { cn } from '@/lib/utils';

const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    const getRoleInfo = () => {
        if (role?.toLowerCase() === 'admin') return { label: 'Admin', variant: 'error' };
        if (role?.toLowerCase() === 'tutor') return { label: 'Tutor', variant: 'primary' };
        return { label: 'Student', variant: 'default' };
    };

    const roleInfo = getRoleInfo();

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    if (role?.toLowerCase() === 'admin') {
        menuItems.push({ path: '/dashboard/users', label: 'Users', icon: Users });
    } else if (role?.toLowerCase() === 'tutor') {
        menuItems.push({ path: '/dashboard/my-applications', label: 'Applications', icon: FileText });
    }

    return (
        <aside className="w-64 h-full flex flex-col flex-shrink-0 relative border-r border-black/[0.05] dark:border-white/[0.05] bg-white/50 dark:bg-black/20 backdrop-blur-2xl">
            <div className="flex flex-col h-full">
                {/* Profile Section */}
                <div className="p-6 pb-8">
                    <div className="flex flex-col items-center text-center space-y-4 pt-4">
                        <div className="relative group">
                            <Avatar className="h-20 w-20 rounded-3xl border-4 border-white/50 dark:border-zinc-800/50 shadow-lg transition-all duration-500 group-hover:scale-105">
                                <AvatarImage src={user?.photoURL} className="object-cover" />
                                <AvatarFallback className="rounded-3xl text-xl font-bold bg-black/[0.03] dark:bg-white/[0.05] text-black/70 dark:text-white/70">{user?.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-sm"></div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-black/80 dark:text-white/80 truncate max-w-[180px]">
                                {user?.displayName || 'Guest User'}
                            </h3>
                            <AppleBadge variant={roleInfo.variant} className="mt-1.5 opacity-80">
                                {roleInfo.label}
                            </AppleBadge>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-grow px-4 space-y-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 mb-4 px-3">
                            Menu
                        </p>
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                                isActive
                                                    ? "bg-black/[0.03] dark:bg-white/[0.05] text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                                    : "text-black/50 dark:text-white/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} className={cn("transition-colors", isActive ? "text-primary" : "opacity-50 group-hover:opacity-100")} />
                                                <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
                                            </div>
                                            {isActive && <ChevronRight size={14} className="text-black/20 dark:text-white/20" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                {/* Logout / Footer */}
                <div className="p-6">
                    <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.05] dark:border-white/[0.05] group cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-black/[0.05] dark:bg-white/[0.1] flex items-center justify-center">
                                <Settings size={16} className="text-black/50 dark:text-white/50 group-hover:rotate-45 transition-transform duration-500" />
                            </div>
                            <span className="text-xs font-bold text-black/60 dark:text-white/60">Settings</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
