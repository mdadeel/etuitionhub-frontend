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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AppleButton } from './AppleUI';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, userRole, setLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { path: '/tuitions', label: 'Tuitions' },
        { path: '/tutors', label: 'Tutors' },
        { path: '/blog', label: 'Blog' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full h-14",
            isScrolled 
                ? "bg-background/80 backdrop-blur-xl border-b border-border/40" 
                : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">
                
                {/* Left Section: Logo & Nav Links */}
                <div className="flex items-center gap-8 lg:w-1/3">
                    <Link to="/" className="flex items-center gap-2 shrink-0 group">
                        <img src={logo} alt="e-tuitionBD" className={`h-5 w-auto transition-transform group-hover:scale-105 ${theme === 'dark' ? 'invert' : ''}`} />
                        <span className="text-base font-bold tracking-tight text-foreground hidden sm:inline-block">
                            e-Tuition<span className="text-primary">BD</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "relative px-3 py-1.5 text-[13px] font-medium transition-colors rounded-lg",
                                        isActive 
                                            ? 'text-foreground bg-muted' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Center Section: Global Search */}
                <div className="hidden lg:flex flex-1 justify-center max-w-xs">
                    <form onSubmit={handleSearch} className="w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 peer-focus:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search tutors, subjects..."
                            className={cn(
                                "w-full pl-9 pr-4 h-9 rounded-xl text-xs font-medium bg-muted/50 border-0 ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/40",
                            )}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center justify-end gap-3 lg:w-1/3">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground transition-colors active:scale-95"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>

                    <Separator orientation="vertical" className="h-4 hidden sm:block bg-border/40" />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden xl:flex flex-col items-end">
                                <span className="text-xs font-semibold text-foreground leading-none">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-[10px] font-medium text-primary uppercase tracking-wider mt-0.5">
                                    {userRole || 'Member'}
                                </span>
                            </div>
                            
                            <div className="relative group">
                                <Avatar className="h-8 w-8 border border-border/40 cursor-pointer hover:border-primary/50 transition-all active:scale-95">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback className="text-xs font-bold uppercase">{user.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-[60]">
                                    <div className="w-52 bg-card/95 border border-border/50 shadow-2xl rounded-xl overflow-hidden p-1.5 backdrop-blur-2xl">
                                        <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                            <LayoutDashboard size={15} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                            <User size={15} /> Profile
                                        </Link>
                                        <Separator className="my-1.5 bg-border/40" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/5 rounded-lg transition-colors text-left">
                                            <LogOut size={15} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-xs font-semibold text-muted-foreground hover:text-primary px-3 py-1.5 transition-colors hidden sm:block">
                                Login
                            </Link>
                            <AppleButton asChild size="sm" className="h-8 px-4 text-xs font-semibold">
                                <Link to="/register">Join</Link>
                            </AppleButton>
                        </div>
                    )}

                    <button 
                        className="lg:hidden p-1.5 text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-background/95 border-b border-border/40 p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-3xl z-[100]">
                    <div className="flex flex-col gap-1">
                        <form onSubmit={handleSearch} className="mb-4 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                                type="text"
                                placeholder="Search tutors, subjects..."
                                className="w-full pl-10 h-10 rounded-xl bg-muted/50 border-0 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                        isActive 
                                            ? 'bg-muted text-foreground' 
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
