import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[var(--color-secondary-dark)] border-t border-[var(--color-dark-300)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🎬</span>
                            <span className="text-2xl font-bold">
                                Cine<span className="text-[var(--color-primary)]">X</span>
                            </span>
                        </Link>
                        <p className="text-[var(--color-light-400)] text-sm">
                            Your ultimate destination for booking movie tickets with the best cinema experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-[var(--color-light-400)]">
                            <li><Link to="/movies" className="hover:text-[var(--color-primary)] transition-colors">Movies</Link></li>
                            <li><Link to="/my-bookings" className="hover:text-[var(--color-primary)] transition-colors">My Bookings</Link></li>
                            <li><Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Offers</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-[var(--color-light-400)]">
                            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
                        <div className="flex gap-4">
                            {['📘', '🐦', '📷', '📺'].map((icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-[var(--color-dark-200)] rounded-lg flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <hr className="border-[var(--color-dark-300)] my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-light-400)]">
                    <p>© 2026 CineX. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
