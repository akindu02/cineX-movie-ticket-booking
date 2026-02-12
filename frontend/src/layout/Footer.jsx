import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#111827] border-t border-white/10 pt-16 pb-8 text-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <Link to="/" className="text-3xl font-bold tracking-tight inline-block mb-6">
                            <span className="text-[var(--color-primary)]">Cine</span>
                            <span className="text-white">X</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Experience movies like never before. Premium screens, immersive sound, and seamless booking right at your fingertips.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={Facebook} />
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Youtube} />
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Quick Access</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/movies" className="hover:text-[var(--color-primary)] transition-colors">Now Showing</Link></li>
                            <li><Link to="/movies?filter=upcoming" className="hover:text-[var(--color-primary)] transition-colors">Coming Soon</Link></li>

                        </ul>
                    </div>

                    {/* Legal & Help - Merged for simplicity */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Contact - Clean & Minimal */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                                <span>No 134/1, Galle Road, Dehiwala, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                                <span>+94 70 220 2200</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                                <span>cinex@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} CineX Cinemas 2026. All rights reserved.</p>
                    <p>Designed for the best cinema experience.</p>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon: Icon }) => (
    <a
        href={href}
        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
    >
        <Icon className="w-5 h-5" />
    </a>
);

export default Footer;
