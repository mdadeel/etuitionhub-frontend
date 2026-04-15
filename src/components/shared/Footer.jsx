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

/**
 * Footer Component
 * Technical Emerald Minimalism Refactor
 */
const Footer = () => {
    return (
        <footer className="bg-background border-t border-border pt-32 pb-16 mt-32">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
                    
                    {/* Brand Identity Section */}
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-3 mb-10 group">
                            <img src={logo} alt="e-tuitionBD" className="h-8 w-auto dark:invert transition-transform group-hover:scale-110" />
                            <span className="text-2xl font-black tracking-tighter uppercase text-foreground">
                                E-TUITION<span className="text-primary italic">BD</span>
                            </span>
                        </Link>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground max-w-sm leading-relaxed mb-12">
                            A high-signal educational marketplace engineered to connect specialized talent with elite students across Bangladesh. Structured growth through curated matching.
                        </p>

                        <div className="flex gap-6">
                            {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="p-3 border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300">
                                    <Icon size={18} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="md:col-span-2">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground mb-10">Platform</h4>
                        <ul className="space-y-6">
                            {['Find Tuition', 'Find Tutors', 'Dashboard', 'Verification'].map((label) => (
                                <li key={label}>
                                    <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        {label} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground mb-10">Company</h4>
                        <ul className="space-y-6">
                            {['About System', 'Contact', 'Terms', 'Privacy'].map((label) => (
                                <li key={label}>
                                    <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        {label} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Geographical Context */}
                    <div className="md:col-span-3">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground mb-10">HQ</h4>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <MapPin size={16} className="text-primary shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed">
                                    GULSHAN-2, DHAKA-1212 <br /> BANGLADESH_REGION_01
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail size={16} className="text-primary shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    OPS@E-TUITIONBD.COM
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Legal Disclaimer */}
                <div className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
                        © 2026 E-TUITIONBD SYSTEMS. ALL_RIGHTS_RESERVED.
                    </p>
                    <div className="flex gap-10">
                        <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-colors">
                            ENCRYPTION_STANDARDS
                        </Link>
                        <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-colors">
                            USER_AGREEMENT
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
