// footer comp - links and contact info
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BiCurrentLocation } from 'react-icons/bi';

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-teal-400 mb-4 inline-block">
                            e-tuitionBD
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Your trusted platform for connecting students with qualified tutors across Bangladesh.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                                <FaFacebook className="text-lg" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                                <FaXTwitter className="text-lg" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                                <FaLinkedin className="text-lg" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                                <FaYoutube className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                            <li><Link to="/tuitions" className="hover:text-teal-400 transition-colors">Browse Tuitions</Link></li>
                            <li><Link to="/tutors" className="hover:text-teal-400 transition-colors">Find Tutors</Link></li>
                            <li><Link to="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
                            <li><Link to="/login" className="hover:text-teal-400 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-teal-400 transition-colors">Register</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <BiCurrentLocation className="text-teal-400 text-xl mt-1 shrink-0" />
                                <span className="text-gray-400">Gulshan, Dhaka-1212, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <AiOutlineMail className="text-teal-400 text-xl shrink-0" />
                                <span className="text-gray-400">info@e-tuitionbd.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <AiOutlinePhone className="text-teal-400 text-xl shrink-0" />
                                <span className="text-gray-400">+880 1XXX-XXXXXX</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
