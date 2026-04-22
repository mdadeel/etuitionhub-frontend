import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    FileText, 
    Users, 
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
        return { label: 'Student', variant: 'secondary' };
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
        <aside className="w-64 h-full flex flex-col flex-shrink-0 relative border-r border-border/50 bg-card/50 backdrop-blur-3xl">
            <div className="flex flex-col h-full">
                {/* Profile Section */}
                <div className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4 pt-4">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 rounded-[2rem] border-4 border-background shadow-apple-md transition-all duration-500 group-hover:scale-105">
                                <AvatarImage src={user?.photoURL} className="object-cover" />
                                <AvatarFallback className="rounded-[2rem] text-2xl font-bold bg-muted text-muted-foreground">{user?.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-sm"></div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-foreground truncate max-w-[180px]">
                                {user?.displayName || 'Guest User'}
                            </h3>
                            <AppleBadge variant={roleInfo.variant} className="opacity-80 scale-90">
                                {roleInfo.label}
                            </AppleBadge>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-grow px-4 space-y-8 mt-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4 px-4">
                            Main Protocol
                        </p>
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-apple-sm"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} className={cn("transition-colors", isActive ? "text-primary-foreground" : "opacity-40 group-hover:opacity-100")} />
                                                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                                            </div>
                                            {isActive && <ChevronRight size={14} className="opacity-40" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                {/* Settings / Footer */}
                <div className="p-6">
                    <button className="w-full p-4 bg-muted/30 rounded-2xl border border-border/50 group hover:bg-muted/50 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-sm">
                                <Settings size={16} className="text-muted-foreground group-hover:rotate-90 transition-transform duration-700" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">Settings</span>
                        </div>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
