import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    FileText, 
    Users, 
    ChevronRight,
    Settings,
    LogOut,
    ShieldCheck,
    Banknote,
    Briefcase,
    Edit3
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const { user, dbUser, logout } = useAuth();

    const getRoleInfo = () => {
        const r = role?.toLowerCase();
        if (r === 'admin') return { label: 'Administrator', variant: 'error' };
        if (r === 'tutor') return { label: 'Verified Tutor', variant: 'primary' };
        return { label: 'Student Member', variant: 'secondary' };
    };

    const roleInfo = getRoleInfo();

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/profile', label: 'My Profile', icon: User },
    ];

    if (role?.toLowerCase() === 'admin') {
        menuItems.push({ path: '/dashboard/users', label: 'User Directory', icon: Users });
    } else if (role?.toLowerCase() === 'tutor') {
        menuItems.push({ path: '/dashboard/my-profile', label: 'Tutor Profile', icon: Edit3 });
        menuItems.push({ path: '/dashboard/applications', label: 'Applications', icon: FileText });
    } else {
        menuItems.push({ path: '/dashboard/payments', label: 'Payments', icon: Banknote });
    }

    const handleLogout = async () => {
        try {
            await logout();
            Cookies.set('token', '');
            toast.success("Signed out successfully");
        } catch {
            toast.error("Sign out failed");
        }
    };

    return (
        <aside className="w-72 h-full hidden lg:flex flex-col flex-shrink-0 relative border-r border-border/40 bg-background/50 backdrop-blur-xl">
            <div className="flex flex-col h-full py-8 px-6">
                
                {/* User Identity Section */}
                <div className="mb-10 px-2 relative">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 transition-all hover:bg-muted/40 shadow-sm">
                        <div className="relative">
                            <Avatar className="h-12 w-12 rounded-xl border-2 border-background shadow-sm">
                                <AvatarImage src={user?.photoURL} className="object-cover" />
                                <AvatarFallback className="rounded-xl text-sm font-bold bg-muted text-blue-600">
                                    {user?.displayName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {role?.toLowerCase() !== 'student' && dbUser?._id !== 'tutor_001' && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                                    <ShieldCheck size={10} className="text-primary-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-foreground truncate tracking-tight">
                                {user?.displayName || 'User'}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                                {roleInfo.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-grow space-y-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30 mb-5 px-4">
                            Main Menu
                        </p>
                        <ul className="space-y-1.5">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} className={cn("transition-transform duration-300", isActive ? "scale-110" : "opacity-50 group-hover:opacity-100")} />
                                                <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
                                            </div>
                                            {isActive && <ChevronRight size={14} className="opacity-60" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-3 mt-auto pt-6 border-t border-border/40 px-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group">
                        <Settings size={18} className="opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500" />
                        <span className="text-[13px] font-semibold tracking-tight">System Settings</span>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
                    >
                        <LogOut size={18} className="opacity-50 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-[13px] font-semibold tracking-tight">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
