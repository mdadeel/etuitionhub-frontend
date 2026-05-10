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

    // Trust-first nav: practical links
    const navLinks = [
        { path: '/tutors', label: 'Find Tutors' },
        { path: '/tuitions', label: 'Subjects' },
        { path: '/post-tuition', label: 'Post Tuition' },
        { path: '/become-tutor', label: 'Become Tutor' },
        { path: '/about', label: 'About' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-200 w-full h-14 border-b",
            isScrolled
                ? "bg-white/95 backdrop-blur-sm border-slate-200 shadow-sm"
                : "bg-white border-slate-200"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">

                {/* Left Section: Logo */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img src={logo} alt="e-tuitionBD" className={`h-6 w-auto ${theme === 'dark' ? 'invert' : ''}`} />
                        <span className="text-lg font-semibold text-slate-900 hidden sm:inline-block">
                            e-tuition<span className="text-blue-600">BD</span>
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "px-3 py-1.5 text-sm font-medium transition-colors rounded-md",
                                        isActive
                                            ? 'text-slate-900 bg-slate-100'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Center Section: Search (subtle) */}
                <div className="hidden md:flex flex-1 justify-center max-w-xs mx-4">
                    <form onSubmit={handleSearch} className="w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search tutors..."
                            className="w-full pl-9 pr-4 h-9 rounded-md text-sm bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center justify-end gap-2">
                    {/* Theme Toggle - subtle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-sm font-medium text-slate-900 leading-none">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-xs text-blue-600 font-medium">
                                    {userRole || 'Member'}
                                </span>
                            </div>

                            <div className="relative group">
                                <Avatar className="h-8 w-8 border border-slate-200 cursor-pointer hover:border-blue-300 transition-all">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback className="text-xs font-semibold bg-slate-100 text-slate-600">
                                        {user.displayName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                                    <div className="w-48 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden">
                                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                                            <LayoutDashboard size={14} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                                            <User size={14} /> Profile
                                        </Link>
                                        <Separator className="my-1 bg-slate-100" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 transition-colors">
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-medium px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    <button
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-lg z-[100]">
                    <div className="flex flex-col gap-1">
                        <form onSubmit={handleSearch} className="mb-3 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search tutors..."
                                className="w-full pl-9 h-10 rounded-md bg-slate-50 border border-slate-200 text-sm"
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
                                        "px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? 'bg-slate-100 text-slate-900'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
