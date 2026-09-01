import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck, Mail, Phone, MapPin, Heart, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

function Github({ className }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
}

function Instagram({ className }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
}

function Linkedin({ className }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

const Footer = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (sectionName) => {
        setOpenSection(openSection === sectionName ? null : sectionName);
    };

    return (
        <footer className="bg-footer text-white/60 pt-16 md:pt-20 pb-8 relative overflow-hidden">
            
            <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 mb-12">
                    {/* Brand Section - Warm, institutional */}
                    <div className="lg:col-span-3 space-y-6">
                        <Logo variant="dark-box" />
                        <p className="text-sm leading-relaxed text-white/60 max-w-sm">
                            Connecting students with verified tutors across Bangladesh. Real educators, genuine results, and a platform built on trust.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            {/* Trust Badge */}
                            <div className="flex items-center gap-2.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg w-fit">
                                <ShieldCheck className="size-4 text-primary" />
                                <span className="text-xs font-medium text-white/60">Verified educational platform</span>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                <a 
                                    href="https://github.com/mdadeel" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="size-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                    aria-label="GitHub"
                                >
                                    <Github className="size-4" />
                                </a>
                                <a 
                                    href="https://linkedin.com/in/shahnawasadee1" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="size-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="size-4" />
                                </a>
                                <a 
                                    href="https://instagram.com/shahnawas.adeel" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="size-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="size-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Popular Subjects */}
                    <div className="border-b border-white/5 pb-4 md:border-b-0 md:pb-0 lg:col-span-2">
                        <button 
                            onClick={() => toggleSection('subjects')}
                            className="flex items-center justify-between w-full md:hidden text-left py-2 focus:outline-none"
                        >
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Popular Subjects</h4>
                            {openSection === 'subjects' ? <Minus className="size-4 text-white/60" /> : <Plus className="size-4 text-white/60" />}
                        </button>
                        <h4 className="hidden md:block text-xs font-bold text-white mb-5 uppercase tracking-widest">Popular Subjects</h4>
                        
                        <ul className={cn(
                            "space-y-3 transition-all duration-300 ease-in-out overflow-hidden md:max-h-none md:opacity-100",
                            openSection === 'subjects' ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0 md:mt-0"
                        )}>
                            <li><Link to="/tutors?subject=Mathematics" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Mathematics</Link></li>
                            <li><Link to="/tutors?subject=Physics" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Physics</Link></li>
                            <li><Link to="/tutors?subject=English" className="text-sm text-white/60 hover:text-white transition-colors duration-300">English Medium</Link></li>
                            <li><Link to="/tutors?subject=Chemistry" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Chemistry</Link></li>
                            <li><Link to="/tutors?subject=ICT" className="text-sm text-white/60 hover:text-white transition-colors duration-300">ICT & Computing</Link></li>
                            <li><Link to="/tutors?subject=admission" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Admission Prep</Link></li>
                        </ul>
                    </div>

                    {/* Popular Areas */}
                    <div className="border-b border-white/5 pb-4 md:border-b-0 md:pb-0 lg:col-span-2">
                        <button 
                            onClick={() => toggleSection('areas')}
                            className="flex items-center justify-between w-full md:hidden text-left py-2 focus:outline-none"
                        >
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Popular Areas</h4>
                            {openSection === 'areas' ? <Minus className="size-4 text-white/60" /> : <Plus className="size-4 text-white/60" />}
                        </button>
                        <h4 className="hidden md:block text-xs font-bold text-white mb-5 uppercase tracking-widest">Popular Areas</h4>
                        
                        <ul className={cn(
                            "space-y-3 transition-all duration-300 ease-in-out overflow-hidden md:max-h-none md:opacity-100",
                            openSection === 'areas' ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0 md:mt-0"
                        )}>
                            <li><Link to="/tutors?area=Dhaka" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Tutors in Dhaka</Link></li>
                            <li><Link to="/tutors?area=Chattogram" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Tutors in Chittagong</Link></li>
                            <li><Link to="/tutors?area=Sylhet" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Tutors in Sylhet</Link></li>
                            <li><Link to="/tutors?area=Uttara" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Uttara, Dhaka</Link></li>
                            <li><Link to="/tutors?area=Dhanmondi" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Dhanmondi, Dhaka</Link></li>
                            <li><Link to="/tutors?area=Mirpur" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Mirpur, Dhaka</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links / Resources */}
                    <div className="border-b border-white/5 pb-4 md:border-b-0 md:pb-0 lg:col-span-2">
                        <button 
                            onClick={() => toggleSection('resources')}
                            className="flex items-center justify-between w-full md:hidden text-left py-2 focus:outline-none"
                        >
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Resources</h4>
                            {openSection === 'resources' ? <Minus className="size-4 text-white/60" /> : <Plus className="size-4 text-white/60" />}
                        </button>
                        <h4 className="hidden md:block text-xs font-bold text-white mb-5 uppercase tracking-widest">Resources</h4>
                        
                        <ul className={cn(
                            "space-y-3 transition-all duration-300 ease-in-out overflow-hidden md:max-h-none md:opacity-100",
                            openSection === 'resources' ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0 md:mt-0"
                        )}>
                            <li><Link to="/tutors" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Browse Tutors</Link></li>
                            <li><Link to="/post-tuition" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Post a Tuition</Link></li>
                            <li><Link to="/become-tutor" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Join as a Tutor</Link></li>
                            <li><Link to="/about" className="text-sm text-white/60 hover:text-white transition-colors duration-300">About Our Mission</Link></li>
                            <li><Link to="/docs/engineering" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Engineering Showcase</Link></li>
                            <li><Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors duration-300">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="border-b border-white/5 pb-4 md:border-b-0 md:pb-0 lg:col-span-3">
                        <button 
                            onClick={() => toggleSection('contact')}
                            className="flex items-center justify-between w-full md:hidden text-left py-2 focus:outline-none"
                        >
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Get in Touch</h4>
                            {openSection === 'contact' ? <Minus className="size-4 text-white/60" /> : <Plus className="size-4 text-white/60" />}
                        </button>
                        <h4 className="hidden md:block text-xs font-bold text-white mb-5 uppercase tracking-widest">Get in Touch</h4>
                        
                        <div className={cn(
                            "space-y-4 transition-all duration-300 ease-in-out overflow-hidden md:max-h-none md:opacity-100",
                            openSection === 'contact' ? "max-h-80 opacity-100 mt-3" : "max-h-0 opacity-0 md:mt-0"
                        )}>
                            <div className="flex items-start gap-3">
                                <Mail className="size-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-white mb-0.5 font-medium">Email</p>
                                    <p className="text-sm text-white/60 break-all">support@etuitionbd.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="size-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-white mb-0.5 font-medium">Phone</p>
                                    <p className="text-sm text-white/60">+880 15339-70377</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="size-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-white mb-0.5 font-medium">Headquarters</p>
                                    <p className="text-sm text-white/60">Chittagong, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-8"></div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-white/40 text-center md:text-left">
                        © 2026 e-tuitionBD. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <Link to="/terms" className="text-white/40 hover:text-white transition-colors duration-300">Terms of Service</Link>
                        <Link to="/privacy" className="text-white/40 hover:text-white transition-colors duration-300">Privacy Policy</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/40">Built with</span>
                        <Heart className="size-4 text-primary fill-primary animate-pulse" />
                        <span className="text-sm text-white/40">for education</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
