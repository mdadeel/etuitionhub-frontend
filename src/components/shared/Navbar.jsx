import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    User, 
    LogOut, 
    Sun, 
    Moon, 
    Menu, 
    X, 
    Search
} from "lucide-react";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import logo from '../../assets/logo.png';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AppleButton } from './AppleUI';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, userRole, setLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) setSearchQuery(q);
        else if (location.pathname !== '/tutors') setSearchQuery('');
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/tutors?q=${encodeURIComponent(searchQuery.trim())}`);
        } else if (location.pathname === '/tutors') {
            navigate('/tutors');
        }
    };

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await logout();
            Cookies.set('token', '');
            toast.dismiss(toastId);
            toast.success("Session ended.");
            setLoading(false);
            setTimeout(() => navigate('/login'), 500);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    const navLinks = [
        { path: '/tuitions', label: 'TUITIONS' },
        { path: '/tutors', label: 'TUTORS' },
        { path: '/blog', label: 'BLOG' },
    ];

    return (
        <header className="sticky top-0 z-50 glass border-b border-border/50 h-16 w-full">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between h-full px-6">
                
                {/* Left Section: Logo & Nav Links */}
                <div className="flex items-center gap-10 lg:w-1/3">
                    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                        <img src={logo} alt="e-tuitionBD" className={`h-6 w-auto transition-transform group-hover:scale-105 ${theme === 'dark' ? 'invert' : ''}`} />
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            e-Tuition<span className="text-primary">BD</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-[10px] font-bold tracking-widest transition-colors hover:text-primary uppercase ${
                                        isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Center Section: Global Search */}
                <div className="hidden lg:flex flex-1 justify-center max-w-sm">
                    <form onSubmit={handleSearch} className="w-full relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search specialists..."
                            className="w-full pl-10 h-10 bg-muted/50 border-none rounded-xl text-xs font-medium focus-visible:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center justify-end gap-4 lg:w-1/3">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors active:scale-95"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <Separator orientation="vertical" className="h-5 hidden sm:block bg-border" />

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden xl:flex flex-col items-end">
                                <span className="text-xs font-bold text-foreground leading-none">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                                    {userRole || 'Member'}
                                </span>
                            </div>
                            
                            <div className="relative group">
                                <Avatar className="h-9 w-9 border border-border cursor-pointer hover:border-primary transition-all active:scale-95">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback className="text-xs font-bold uppercase">{user.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-[60]">
                                    <div className="w-56 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden p-2 backdrop-blur-2xl">
                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                                            <User size={16} /> Profile
                                        </Link>
                                        <Separator className="my-2 bg-border/50" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/5 rounded-xl transition-colors text-left">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-xs font-bold text-muted-foreground hover:text-primary px-3 py-2 transition-colors hidden sm:block">
                                Login
                            </Link>
                            <AppleButton asChild size="sm" className="h-9 px-6">
                                <Link to="/register">Join</Link>
                            </AppleButton>
                        </div>
                    )}

                    <button 
                        className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-border p-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 backdrop-blur-3xl">
                    <div className="flex flex-col gap-2">
                        <form onSubmit={handleSearch} className="mb-6 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                                type="text"
                                placeholder="Search specialists..."
                                className="w-full pl-10 h-11 rounded-xl bg-muted/50 border-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-4 py-3 text-sm font-bold text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
