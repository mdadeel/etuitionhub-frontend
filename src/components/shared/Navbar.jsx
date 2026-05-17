import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import {
    User,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    Globe
} from "lucide-react";
import NotificationBell from './NotificationBell';
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
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    // Calm, editorial navigation - fewer links, more intention
    const navLinks = [
        { path: '/tutors', label: 'Find Tutors' },
        { path: '/tuitions', label: 'Subjects' },
        { path: '/become-tutor', label: 'Become Tutor' },
        { path: '/about', label: 'About' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full h-16",
            "bg-[#F5F7FA] border-b border-[rgba(15,23,46,0.08)]",
            isScrolled
                ? "shadow-sm shadow-[rgba(0,0,0,0.04)]"
                : ""
        )}>
            <div className="container-premium flex items-center justify-between h-full">

                {/* Left Section: Calm Academic Branding */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-[#111827] font-heading text-lg tracking-tight hidden sm:block">
                            e-tuition<span className="text-[#2563EB]">BD</span>
                        </span>
                    </Link>

                    {/* Editorial Navigation - calm, intentional spacing */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "text-[#5B6475] hover:text-[#111827] transition-colors duration-300 font-label text-xs tracking-wide",
                                        isActive && "text-[#111827]"
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Center Section: Calm Search */}
                <div className="hidden md:flex flex-1 justify-center max-w-sm mx-8">
                    <form onSubmit={handleSearch} className="w-full relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6475]/60" />
                        <input
                            type="text"
                            placeholder="Search tutors..."
                            className="w-full pl-10 pr-4 h-10 rounded-lg text-sm bg-[#EEF2F6] border border-[rgba(15,23,46,0.08)] focus:outline-none focus:border-[#2563EB]/30 focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-300 placeholder:text-[#5B6475]/60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right Section: Calm Authentication */}
                <div className="flex items-center justify-end gap-6">

                    {/* Language Selector */}
                    <div ref={langRef} className="relative hidden md:block">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-heading text-[#5B6475] hover:text-[#111827] hover:bg-[#F5F7FA] rounded-lg transition-colors"
                        >
                            <Globe size={16} />
                            <span className="uppercase">{lang}</span>
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-[rgba(15,23,46,0.08)] shadow-lg rounded-lg overflow-hidden z-50">
                                {['en', 'bn'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => { setLang(l); setLangOpen(false); }}
                                        className={`block w-full px-4 py-2 text-left text-sm font-medium hover:bg-[#F5F7FA] transition-colors ${lang === l ? 'text-[#2563EB] bg-[#EEF2F6]' : 'text-[#111827]'}`}
                                    >
                                        {l === 'en' ? 'English' : 'বাংলা'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-5">
                            {/* User Info - warm, personal */}
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[#111827] font-heading text-sm leading-none">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <span className="text-[#2563EB] font-label text-xs tracking-wider mt-0.5">
                                    {userRole || 'Member'}
                                </span>
                            </div>

                            {/* Notification Bell */}
                            <NotificationBell />

                            {/* Profile Avatar - soft, welcoming */}
                            <div className="relative group">
                                <div className="w-9 h-9 bg-[#EEF2F6] border border-[rgba(15,23,46,0.08)] rounded-lg overflow-hidden cursor-pointer hover:border-[#2563EB]/30 transition-all duration-300">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-[#F5F7FA] text-[#5B6475] text-xs font-heading">
                                            {user.displayName?.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Dropdown - soft, calm */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                                <div className="w-52 bg-white border border-[rgba(15,23,46,0.08)] shadow-xl rounded-lg overflow-hidden">
                                    <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#111827] hover:bg-[#F5F7FA] transition-all">
                                        <User size={16} /> My Profile
                                    </Link>
                                    <div className="h-px bg-[rgba(15,23,46,0.08)]" />
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all text-left">
                                        <LogOut size={16} /> Logout Session
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-5">
                            <button className="text-[#5B6475] hover:text-[#111827] transition-colors duration-300 font-label text-xs tracking-wide">
                                Sign In
                            </button>
                            <Link
                                to="/register"
                                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-label text-xs tracking-wide transition-all duration-300 hover:shadow-md"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-[#5B6475] hover:text-[#111827] hover:bg-[#EEF2F6] rounded-lg transition-all duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - calm, welcoming */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-[#F5F7FA] border-b border-[rgba(15,23,46,0.08)] shadow-xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="container-premium py-5">
                        <form onSubmit={handleSearch} className="mb-5 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6475]/60" />
                            <input
                                type="text"
                                placeholder="Search tutors..."
                                className="w-full pl-10 pr-4 h-11 rounded-lg bg-[#EEF2F6] border border-[rgba(15,23,46,0.08)] text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <div className="flex flex-col gap-1">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            "px-4 py-3 text-sm font-heading transition-all duration-300",
                                            isActive
                                                ? 'bg-[#2563EB] text-white shadow-sm'
                                                : 'text-[#5B6475] hover:bg-[#EEF2F6] hover:text-[#111827]'
                                        )
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
