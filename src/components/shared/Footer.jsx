import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck, GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { FiGithub as Github, FiInstagram as Instagram, FiLinkedin as Linkedin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-[#0F172E] text-[#9CA3AF] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section - Warm, institutional */}
                    <div className="lg:col-span-4 space-y-6">
                        <Logo variant="dark-box" />
                        <p className="text-sm leading-relaxed text-[#9CA3AF] max-w-sm">
                            Connecting students with verified tutors across Bangladesh. Real educators, genuine results, and a platform built on trust.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            {/* Trust Badge */}
                            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-lg w-fit">
                                <ShieldCheck className="size-4 text-[#2563EB]" />
                                <span className="text-xs font-medium text-[#9CA3AF]">Verified educational platform</span>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                <a 
                                    href="https://github.com/mdadeel" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="size-9 rounded-lg bg-[#1E293B] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#9CA3AF] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300"
                                    aria-label="GitHub"
                                >
                                    <Github className="size-4" />
                                </a>
                                <a 
                                    href="https://linkedin.com/in/shahnawasadee1" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="size-9 rounded-lg bg-[#1E293B] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#9CA3AF] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="size-4" />
                                </a>
                                <a 
                                    href="https://instagram.com/shahnawas.adeel" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="size-9 rounded-lg bg-[#1E293B] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#9CA3AF] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="size-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links - Clean, organized */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-heading text-white mb-5">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link to="/tutors" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">Find Tutors</Link></li>
                            <li><Link to="/tuitions" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">Subjects</Link></li>
                            <li><Link to="/post-tuition" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">Post Tuition</Link></li>
                            <li><Link to="/become-tutor" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">Become a Tutor</Link></li>
                        </ul>
                    </div>

                    {/* Support - Helpful, accessible */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-heading text-white mb-5">Support</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">About Us</Link></li>
                            <li><Link to="/contact" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">Contact</Link></li>
                            <li><Link to="/privacy" className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information - Warm, accessible */}
                    <div className="lg:col-span-4">
                        <h4 className="text-sm font-heading text-white mb-5">Get in Touch</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="size-5 text-[#2563EB] mt-0.5" />
                                <div>
                                    <p className="text-sm text-white mb-0.5">Email</p>
                                    <p className="text-sm text-[#9CA3AF]">mdadeel125@etuitionbd.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="size-5 text-[#2563EB] mt-0.5" />
                                <div>
                                    <p className="text-sm text-white mb-0.5">Phone</p>
                                    <p className="text-sm text-[#9CA3AF]">+880 15339-70377</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="size-5 text-[#2563EB] mt-0.5" />
                                <div>
                                    <p className="text-sm text-white mb-0.5">Location</p>
                                    <p className="text-sm text-[#9CA3AF]">Chittagong, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[rgba(255,255,255,0.08)] mb-8"></div>

                {/* Footer Bottom - Cinematic, trustworthy */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-[#6B7280]">
                        © 2026 e-tuitionBD. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-[#6B7280]">Built with</span>
                        <Heart className="size-4 text-[#2563EB]" />
                        <span className="text-sm text-[#6B7280]">for education</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
