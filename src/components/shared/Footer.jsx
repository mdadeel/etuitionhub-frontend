import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className="py-8 bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 text-sm">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <img src={logo} alt="e-tuitionBD" className={`h-6 w-auto ${theme === 'dark' ? 'invert' : ''}`} />
                            <span className="text-lg font-semibold text-white">e-tuitionBD</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Trusted tutoring platform connecting students with verified tutors across Bangladesh.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-medium text-white mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/tutors" className="hover:text-white transition-colors">Find Tutors</Link></li>
                            <li><Link to="/post-tuition" className="hover:text-white transition-colors">Post Tuition</Link></li>
                            <li><Link to="/subjects" className="hover:text-white transition-colors">Subjects</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* For Tutors */}
                    <div>
                        <h4 className="font-medium text-white mb-3">For Tutors</h4>
                        <ul className="space-y-2">
                            <li><Link to="/become-tutor" className="hover:text-white transition-colors">Become a Tutor</Link></li>
                            <li><Link to="/tutor-login" className="hover:text-white transition-colors">Tutor Login</Link></li>
                            <li><Link to="/tips" className="hover:text-white transition-colors">Success Tips</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-medium text-white mb-3">Support</h4>
                        <ul className="space-y-2">
                            <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">© 2026 e-tuitionBD. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">
                            <FaFacebookF size={18} />
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <FaTwitter size={18} />
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <FaLinkedinIn size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;