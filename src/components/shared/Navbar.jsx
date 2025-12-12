// Navbar - sticky navbar with DaisyUI
// req.md onujayi requirements follow kortesi
// class ordering is a mess but it works - dont touch
"use client";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { MdDashboard, MdLogin, MdLogout } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

// Not sure if this is the best way to do active links but it works
const Navbar = () => {
    const router = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    // const [allowedPath, setAllowedPath] = useState(true);
    const allowedPath = true;

    // useEffect(() => {
    //   pathname.includes('/dashboard') ? setAllowedPath(false) : setAllowedPath(true);
    // }, [pathname]);

    const { user, logout, userRole, setLoading } = useAuth();
    // console.log("logged user", user);
    const currentUserName = user?.displayName;
    const currentUserEmail = user?.email;
    const currentUserPhotoURL = user?.photoURL;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hardcoded for now - maybe move to config later
    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/tuitions', label: 'Tuitions' },
        { path: '/tutors', label: 'Tutors' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    // logout function - user logout handle kortesi
    // NOTE: this function ta long hoye geche
    // TODO: maybe split into smaller functions
    const handleLogout = async () => {
        // loading toast show kortesi
        const toastId = toast.loading("Logging out...");

        // debug log
        // console.log("logout process start");

        // check kortesi user logged in ase kina
        if (user) {
            // user ase, proceed kortesi
            try {
                // logout function call kortesi
                await logout();

                // cookie clear kortesi
                // token empty string set kortesi
                Cookies.set('token', '')

                // toast dismiss kortesi
                toast.dismiss(toastId);

                // success message show kortesi
                toast.success("Logout successful!");

                // loading false kortesi
                setLoading(false);

                // login page e redirect kortesi
                // 1 second delay disi
                setTimeout(() => {
                    router('/login');
                }, 1000) // magic number - 1 second
            } catch (error) {
                // error hole ekhane handle kortesi
                // console.log(error.message);

                // error message show kortesi
                toast.error(`Error: ${error.message}`);

                // toast dismiss kortesi
                toast.dismiss(toastId);

                // loading false kortesi
                setLoading(false);

                // NOTE: sometimes error ashe but logout hoye jay
                // FIXME: improve error handling
            }
        } else {
            // user nai, just redirect kortesi
            toast.dismiss(toastId)
            toast.error('Already logged out')
            router('/login')
        }
    };

    return (
        <>
            {allowedPath && (
                <nav className="navbar sticky top-0 z-50 bg-base-100 shadow-lg px-4">
                    {/* Logo section - moved from header.js */}
                    <div className="navbar-start">
                        <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </label>
                            {isMenuOpen && (
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                    {navLinks.map(link => (
                                        <li key={link.path}>
                                            <NavLink
                                                className={`${pathname === link.path ? "bg-teal-200" : ""}`}
                                                to={link.path}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Link to="/" className="btn btn-ghost normal-case text-xl text-teal-600 font-bold">
                            e-tuitionBD
                        </Link>
                    </div>

                    {/* Desktop nav links */}
                    <div className="navbar-center hidden lg:flex" style={{ marginTop: '2px' }}> {/* Tailwind wasn't centering this correctly */}
                        <ul className="menu menu-horizontal px-1">
                            {navLinks.map(link => (
                                <li key={link.path} className="nav-item hover:cursor-pointer">
                                    <NavLink
                                        to={link.path}
                                        className={`${pathname === link.path ? "active text-teal-600 font-semibold" : ""}`}
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Auth buttons - this part was tricky */}
                    <div className="navbar-end">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="btn btn-ghost btn-circle avatar tooltip tooltip-left"
                                    data-tip={currentUserName}
                                >
                                    <div className="w-10 rounded-full ring-2 ring-offset-2 ring-teal-400">
                                        {currentUserPhotoURL &&
                                            <img
                                                className="object-top"
                                                src={currentUserPhotoURL || 'https://i.ibb.co/4pDNDk1/default-avatar.png'}
                                                alt={currentUserName}
                                            />
                                        }
                                    </div>
                                </label>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-52">
                                    <div className="w-full flex justify-center">
                                        <div className="mt-2 mb-3 h-16 w-16 rounded-full ring-2 ring-offset-2 ring-slate-400">
                                            {currentUserPhotoURL &&
                                                <img
                                                    className="h-16 w-full rounded-full object-cover object-center"
                                                    src={currentUserPhotoURL}
                                                    alt={currentUserName}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <li className="mt-1 text-center font-bold">{currentUserName}</li>
                                    <p className="text-slate-600 text-sm mt-1 mb-2 font-normal text-center whitespace-nowrap">
                                        {currentUserEmail}
                                    </p>
                                    {userRole && (
                                        <p className="uppercase px-5 py-0.5 text-sm bg-teal-300 w-fit mx-auto rounded-xl">
                                            {userRole}
                                        </p>
                                    )}
                                    <div className="divider mt-1 mb-2"></div>
                                    <li>
                                        <Link to="/dashboard/profile" className="flex gap-2 items-center">
                                            <ImProfile className="text-xl" />
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard" className="flex gap-2 items-center">
                                            <MdDashboard className="text-xl" />
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="flex gap-2 items-center text-red-500">
                                            <MdLogout className="text-xl" />
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn btn-ghost flex gap-2">
                                    <MdLogin className="text-xl" />
                                    Login
                                </Link>
                                <Link to="/register" className="btn bg-teal-600 text-white hover:bg-teal-700 border-none">Register</Link>
                            </div>
                        )}
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;
