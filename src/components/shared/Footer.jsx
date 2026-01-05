// footer comp - links and contact info
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BiCurrentLocation } from 'react-icons/bi';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-16 mt-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand Section */}
                    <div className="md:col-span-4">
                        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center text-white text-xs">ET</span>
                            e-tuitionBD
                        </Link>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                            A high-signal educational marketplace connecting people with specialized talent across Bangladesh.
                        </p>

                        <div className="flex gap-4 mt-8">
                            {[FaFacebook, FaXTwitter, FaLinkedin, FaYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                                    <Icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-3">
                            <li><Link to="/tuitions" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Find Tuition</Link></li>
                            <li><Link to="/tutors" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Find Tutors</Link></li>
                            <li><Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-6">Office</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <BiCurrentLocation className="text-gray-400 text-lg shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-500">Gulshan-2, Dhaka-1212</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <AiOutlineMail className="text-gray-400 text-lg shrink-0" />
                                <span className="text-sm text-gray-500">hello@e-tuitionbd.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">© 2025 e-tuitionBD. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="text-xs text-gray-400 hover:text-gray-900">Privacy Policy</Link>
                        <Link to="#" className="text-xs text-gray-400 hover:text-gray-900">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
