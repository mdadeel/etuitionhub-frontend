import { Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0F172E] text-[#9CA3AF] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section - Warm, institutional */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-heading text-white tracking-tight">e-tuitionBD</span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#9CA3AF] max-w-sm">
                            Connecting students with verified tutors across Bangladesh. Real educators, genuine results, and a platform built on trust.
                        </p>
                        
                        {/* Trust Badge */}
                        <div className="flex items-center gap-2.5 px-3 py-2 bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                            <span className="text-xs font-medium text-[#9CA3AF]">Verified educational platform</span>
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
                                <Mail className="w-5 h-5 text-[#2563EB] mt-0.5" />
                                <div>
                                    <p className="text-sm text-white mb-0.5">Email</p>
                                    <p className="text-sm text-[#9CA3AF]">support@etuitionbd.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[#2563EB] mt-0.5" />
                                <div>
                                    <p className="text-sm text-white mb-0.5">Phone</p>
                                    <p className="text-sm text-[#9CA3AF]">+880 1234-567890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#2563EB] mt-0.5" />
                                <div>
                                    <p className="text-sm text-white mb-0.5">Location</p>
                                    <p className="text-sm text-[#9CA3AF]">Dhaka, Bangladesh</p>
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
                        <Heart className="w-4 h-4 text-[#2563EB]" />
                        <span className="text-sm text-[#6B7280]">for education</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
