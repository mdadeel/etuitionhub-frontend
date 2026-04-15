import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    FileText, 
    Users, 
    ShieldCheck, 
    ChevronRight,
    Circle,
    Activity
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/**
 * DashboardSidebar Component
 * Refactored to "Modern Educational Marketplace"
 * Features: Professional navigation, refined profile section, clean UI
 */
const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    const getRoleInfo = () => {
        if (role?.toLowerCase() === 'admin') return { label: 'Administrator', accent: 'text-destructive bg-destructive/5' };
        if (role?.toLowerCase() === 'tutor') return { label: 'Specialist Tutor', accent: 'text-primary bg-primary/5' };
        return { label: 'Student / Client', accent: 'text-muted-foreground bg-muted/30' };
    };

    const roleInfo = getRoleInfo();

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/profile', label: 'My Profile', icon: User },
    ];

    if (role?.toLowerCase() === 'admin') {
        menuItems.push({ path: '/dashboard/users', label: 'Users & Roles', icon: Users });
    } else if (role?.toLowerCase() === 'tutor') {
        menuItems.push({ path: '/dashboard/my-applications', label: 'My Applications', icon: FileText });
    }

    return (
        <aside className="w-72 bg-card border-r border-border h-full flex flex-col flex-shrink-0 relative selection:bg-primary/20 selection:text-primary">
            <div className="flex flex-col h-full">
                {/* Profile Section */}
                <div className="p-8 pb-10 border-b border-border">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 shadow-xl transition-all duration-300 hover:border-primary">
                                <AvatarImage src={user?.photoURL} />
                                <AvatarFallback className="rounded-2xl text-xl font-bold bg-muted text-primary">{user?.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-foreground truncate max-w-[120px]">
                                {user?.displayName || 'Authorized User'}
                            </h3>
                            <Badge variant="outline" className={`rounded-full border-none px-2.5 py-0.5 text-[10px] font-bold tracking-tight mt-1.5 ${roleInfo.accent}`}>
                                {roleInfo.label}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Operations Terminal */}
                <nav className="flex-grow p-6">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-4 flex items-center gap-2">
                        Main Navigation
                    </div>
                    
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-none transition-all duration-300 group ${
                                            isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} className={`transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-primary/60'}`} />
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </div>
                                        {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer Quote */}
                <div className="p-8 border-t border-border">
                    <div className="p-5 bg-muted/30 border border-border/50 rounded-2xl relative overflow-hidden group">
                        <ShieldCheck className="absolute -bottom-4 -right-4 w-16 h-16 text-primary/5 group-hover:text-primary/10 transition-colors duration-500" strokeWidth={1} />
                        <p className="relative z-10 text-[11px] font-medium leading-relaxed text-muted-foreground tracking-tight italic">
                            "Excellence in education starts with trust and quality."
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};


export default DashboardSidebar;
