import { Link } from 'react-router-dom';
import { 
    Mail, 
    Phone, 
    MapPin,
    ArrowUpRight
} from "lucide-react";
import { 
    FaFacebook as Facebook, 
    FaTwitter as Twitter, 
    FaLinkedin as Linkedin, 
    FaYoutube as Youtube 
} from "react-icons/fa";
import logo from '../../assets/logo.png';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className="bg-background border-t border-border pt-32 pb-16 relative overflow-hidden">
            {/* Subtle Gradient Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
                    
                    {/* Brand Identity Section */}
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-3 mb-10 group">
                            <img src={logo} alt="e-tuitionBD" className={`h-7 w-auto transition-transform group-hover:scale-105 ${theme === 'dark' ? 'invert' : ''}`} />
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                e-Tuition<span className="text-primary">BD</span>
                            </span>
                        </Link>
                        <p className="text-sm font-medium text-muted-foreground max-w-sm leading-relaxed mb-12">
                            A high-fidelity educational marketplace engineered to connect specialized talent with ambitious students across Bangladesh.
                        </p>

                        <div className="flex gap-4">
                            {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="p-3 bg-muted/50 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-10">Platform</h4>
                        <ul className="space-y-5">
                            {['Find Tuition', 'Find Tutors', 'Dashboard', 'Verification'].map((label) => (
                                <li key={label}>
                                    <Link to="#" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        {label} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-10">Company</h4>
                        <ul className="space-y-5">
                            {['About Us', 'Contact', 'Terms', 'Privacy'].map((label) => (
                                <li key={label}>
                                    <Link to="#" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        {label} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Geographical Context */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-10">Headquarters</h4>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <MapPin size={18} className="text-primary shrink-0" />
                                <span className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-wider">
                                    Gulshan-2, Dhaka-1212 <br /> Bangladesh
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    ops@e-tuitionbd.com
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Legal Disclaimer */}
                <div className="mt-32 pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
                        © 2026 e-TuitionBD Systems. All Rights Reserved.
                    </p>
                    <div className="flex gap-10">
                        <Link to="#" className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40 hover:text-foreground transition-colors">
                            Encryption Standards
                        </Link>
                        <Link to="#" className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40 hover:text-foreground transition-colors">
                            User Agreement
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
