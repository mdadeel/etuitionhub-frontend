import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    User,
    LogOut,
    Menu,
    X,
    Search
} from "lucide-react";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, userRole, setLoading } = useAuth();
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
                ? "bg-background/95 backdrop-blur-sm border-border/40 shadow-sm"
                : "bg-background border-border/40"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">

                {/* Left Section: Logo */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img src={logo} alt="e-tuitionBD" className="h-6 w-auto transition-all" />
                        <span className="text-lg font-bold text-foreground hidden sm:inline-block tracking-tight">
                            e-tuition<span className="text-blue-600">BD</span>
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-0">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "px-4 py-2 text-sm font-bold transition-colors",
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

                {/* Center Section: Search (subtle) */}
                <div className="hidden md:flex flex-1 justify-center max-w-xs mx-4">
                    <form onSubmit={handleSearch} className="w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tutors..."
                            className="w-full pl-9 pr-4 h-9 rounded-none text-sm bg-muted/30 border border-border/60 focus:outline-none focus:border-blue-500 transition-all placeholder:text-muted-foreground/60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center justify-end gap-2">

                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-sm font-bold text-foreground leading-none">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                                    {userRole || 'Member'}
                                </span>
                            </div>

                            <div className="relative group">
                                <div className="h-8 w-8 rounded-none border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-all">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-bold">
                                            {user.displayName?.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                                    <div className="w-52 bg-card border border-border shadow-2xl rounded-none overflow-hidden">
                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                            <User size={16} /> My Profile
                                        </Link>
                                        <div className="h-px bg-border" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left">
                                            <LogOut size={16} /> Logout Session
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-0">
                            <Link to="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground px-4 py-2 hover:bg-muted transition-colors border-l">
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-black px-5 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-all border-l"
                            >
                                SIGN UP
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
                <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 p-4 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-1">
                        <form onSubmit={handleSearch} className="mb-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <input
                                type="text"
                                placeholder="Search tutors..."
                                className="w-full pl-9 h-11 rounded-xl bg-muted/40 border-border/60 text-sm"
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
                                        "px-4 py-3 text-sm font-bold rounded-xl transition-all",
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
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
