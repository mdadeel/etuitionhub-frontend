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

/**
 * Global Navbar
 * Refactored to "Apple High-Precision Centered Layout"
 * Logic: [Logo + Links] on Left, [Search] in Center, [Actions] on Right.
 */
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, userRole, setLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Sync search input with URL q param
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
        <header className="sticky top-0 z-50 glass border-b border-apple-gray-200/50 dark:border-apple-gray-800/50 h-12 w-full">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                
                {/* Left Section: Logo & Nav Links */}
                <div className="flex items-center gap-8 lg:w-1/4">
                    <Link to="/" className="flex items-center gap-2 shrink-0 group">
                        <img src={logo} alt="e-tuitionBD" className={`h-5 w-auto transition-transform group-hover:scale-105 ${theme === 'dark' ? 'invert' : ''}`} />
                        <span className="text-[14px] font-bold tracking-tight text-apple-gray-900 dark:text-white">
                            e-Tuition<span className="text-apple-blue">BD</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-[10px] font-bold tracking-widest transition-colors hover:text-apple-blue uppercase ${
                                        isActive ? 'text-apple-blue' : 'text-apple-gray-500'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Center Section: Global Search (macOS Style) */}
                <div className="hidden lg:flex flex-1 justify-center max-w-md px-8">
                    <form onSubmit={handleSearch} className="w-full relative group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-apple-gray-400 group-focus-within:text-apple-blue transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search specialists..."
                            className="mac-input w-full pl-8 h-7 bg-apple-gray-100/30 dark:bg-apple-gray-900/30 border-none rounded-lg text-[11px] font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center justify-end gap-3 lg:w-1/4">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-1.5 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-900 rounded-md text-apple-gray-500 transition-colors"
                    >
                        {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                    </button>

                    <Separator orientation="vertical" className="h-4 hidden sm:block bg-apple-gray-200 dark:bg-apple-gray-800" />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden xl:flex flex-col items-end">
                                <span className="text-[11px] font-bold text-apple-gray-900 dark:text-white leading-none">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-[9px] font-bold text-apple-blue uppercase tracking-tighter mt-0.5">
                                    {userRole || 'Member'}
                                </span>
                            </div>
                            
                            <div className="relative group">
                                <Avatar className="h-7 w-7 border border-apple-gray-200 dark:border-apple-gray-800 cursor-pointer hover:border-apple-blue transition-all active:scale-95">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback className="text-[9px] font-bold uppercase">{user.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>

                                {/* Apple Style Dropdown */}
                                <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all translate-y-1 group-hover:translate-y-0 z-[60]">
                                    <div className="w-48 glass border border-apple-gray-200 dark:border-apple-gray-800 shadow-apple-lg rounded-xl overflow-hidden p-1.5 backdrop-blur-2xl">
                                        <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-bold text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-apple-blue/5 rounded-lg transition-colors">
                                            <LayoutDashboard size={14} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" className="flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-bold text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-apple-blue/5 rounded-lg transition-colors">
                                            <User size={14} /> Profile
                                        </Link>
                                        <Separator className="my-1 bg-apple-gray-100/50 dark:bg-apple-gray-800/50" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-bold text-destructive hover:bg-destructive/5 rounded-lg transition-colors text-left">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-[11px] font-bold text-apple-gray-600 hover:text-apple-blue px-3 py-1.5 transition-colors hidden sm:block">
                                Login
                            </Link>
                            <Button asChild className="mac-pill bg-apple-blue hover:bg-apple-blue/90 text-white border-none h-7 text-[10px] px-4 shadow-apple-sm uppercase tracking-wider font-bold">
                                <Link to="/register">Join</Link>
                            </Button>
                        </div>
                    )}

                    <button 
                        className="lg:hidden p-1.5 text-apple-gray-600 hover:bg-apple-gray-100 rounded-md" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (macOS Slide Down) */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full glass border-b border-apple-gray-200 dark:border-apple-gray-800 p-4 shadow-apple-lg animate-in slide-in-from-top-2 duration-200 backdrop-blur-3xl">
                    <div className="flex flex-col gap-1">
                        <form onSubmit={handleSearch} className="mb-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-apple-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search specialists..."
                                className="mac-input w-full pl-9 h-8 rounded-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-3 py-2 text-xs font-bold text-apple-gray-900 dark:text-white hover:bg-apple-blue/5 hover:text-apple-blue rounded-lg transition-colors"
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
