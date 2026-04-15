import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import { 
    LayoutDashboard, 
    User, 
    LogOut, 
    Sun, 
    Moon, 
    Menu, 
    X, 
    ChevronDown,
    MapPin,
    Search
} from "lucide-react";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import logo from '../../assets/logo.png';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
    const router = useNavigate();
    const location = useLocation();
    const { user, logout, userRole, setLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await logout();
            Cookies.set('token', '');
            toast.dismiss(toastId);
            toast.success("Session ended.");
            setLoading(false);
            setTimeout(() => router('/login'), 500);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    const navLinks = [
        { path: '/tuitions', label: 'FIND TUITION' },
        { path: '/tutors', label: 'FIND TUTORS' },
        { path: '/about', label: 'ABOUT' },
        { path: '/contact', label: 'CONTACT' },
    ];

    return (
        <header className="sticky top-0 z-50 glass transition-all duration-300">
            <div className="max-w-[1400px] mx-auto flex items-center h-16 px-6 lg:px-12">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 mr-10">
                    <img src={logo} alt="e-tuitionBD" className={`h-7 w-auto ${theme === 'dark' ? 'invert' : ''}`} />
                    <span className="text-base font-bold tracking-tighter uppercase text-foreground">
                        E-TUITION<span className="text-primary">BD</span>
                    </span>
                </Link>

                {/* Primary Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-[10px] font-bold tracking-[0.15em] transition-all hover:text-primary ${
                                    isActive ? 'text-primary' : 'text-muted-foreground'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex-grow"></div>

                {/* Actions Section */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group"
                        title="Toggle appearance"
                    >
                        {theme === 'light' ? <Moon size={18} className="group-active:scale-90" /> : <Sun size={18} className="group-active:scale-90" />}
                    </button>

                    <Separator orientation="vertical" className="h-6 hidden md:block" />

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[11px] font-black tracking-tight text-foreground uppercase">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">
                                    {userRole || 'USER'}
                                </span>
                            </div>
                            
                            <div className="relative group">
                                <Avatar className="h-9 w-9 border border-border cursor-pointer group-hover:border-primary transition-colors">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback className="text-[10px] font-black">{user.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>

                                {/* Simple Hover Menu */}
                                <div className="absolute right-0 top-full pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-[60]">
                                    <div className="w-56 bg-background border border-border shadow-2xl p-2">
                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black tracking-[0.1em] text-muted-foreground hover:text-primary hover:bg-muted transition-colors uppercase">
                                            <LayoutDashboard size={14} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black tracking-[0.1em] text-muted-foreground hover:text-primary hover:bg-muted transition-colors uppercase">
                                            <User size={14} /> Profile
                                        </Link>
                                        <Separator className="my-1" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black tracking-[0.1em] text-destructive hover:bg-destructive/5 transition-colors uppercase">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="hidden sm:inline-flex text-[11px] font-black tracking-[0.2em] uppercase">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="text-[11px] font-black tracking-[0.2em] px-6 uppercase h-10">
                                <Link to="/register">Join Platform</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button 
                        className="lg:hidden p-2 text-foreground" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overly */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-black tracking-tighter text-foreground uppercase"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <div className="flex flex-col gap-3 pt-6 border-t border-border">
                                <Button asChild variant="outline" className="font-black tracking-widest h-12 uppercase">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                </Button>
                                <Button asChild className="font-black tracking-widest h-12 uppercase">
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Join Platform</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
