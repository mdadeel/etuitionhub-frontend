// navbar - sticky top with daisy ui
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { MdDashboard, MdLogin, MdLogout } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const router = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const { user, logout, userRole, setLoading } = useAuth();
    const currentUserName = user?.displayName;
    const currentUserEmail = user?.email;
    const currentUserPhotoURL = user?.photoURL;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/tuitions', label: 'Find Tuition' },
        { path: '/tutors', label: 'Find Tutors' },
    ];

    const secondaryLinks = [
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await logout();
            Cookies.set('token', '');
            toast.dismiss(toastId);
            toast.success("Logout successful!");
            setLoading(false);
            setTimeout(() => router('/login'), 500);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="e-tuitionBD Logo" className="h-10 w-auto" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-900'}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Auth & Secondary Section */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-gray-100 pr-6">
                        {secondaryLinks.map(link => (
                            <Link key={link.path} to={link.path} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                    <img
                                        src={currentUserPhotoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                        alt={currentUserName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentUserName?.split(' ')[0]}</span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-sm shadow-sm py-2 fade-up">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{currentUserName}</p>
                                        <p className="text-xs text-gray-500 truncate">{currentUserEmail}</p>
                                        {userRole && (
                                            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 rounded-sm">
                                                {userRole}
                                            </span>
                                        )}
                                    </div>
                                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <MdDashboard className="text-lg opacity-60" /> Dashboard
                                    </Link>
                                    <Link to="/dashboard/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <ImProfile className="text-lg opacity-60" /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <MdLogout className="text-lg opacity-60" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
                            <Link to="/register" className="btn-quiet-primary">Register</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2 text-gray-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && !user && (
                <div className="lg:hidden border-t border-gray-100 mt-3 pt-3 flex flex-col gap-4">
                    {[...navLinks, ...secondaryLinks].map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sm font-medium text-gray-600 px-2"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
