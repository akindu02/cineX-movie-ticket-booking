import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, User, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Removed scroll logic as per "White background" requirement which implies consistent white header
    // But if we want sticky behavior we can keep sticky class

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Now Showing', path: '/movies' },
        { name: 'Upcoming', path: '/movies?filter=upcoming' },
        { name: 'About Us', path: '/about' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-[var(--color-dark-300)] py-4 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight z-50 flex items-center gap-0.5">
                    <span className="text-[var(--color-primary)]">Cine</span>
                    <span className="text-[var(--color-light)]">X</span>
                </Link>

                {/* Centered Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path.split('?')[0] &&
                            (link.path.includes('?') ? location.search.includes('upcoming') : !location.search.includes('upcoming'));

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                                        ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                        : 'text-[var(--color-light)] hover:text-[var(--color-primary)] hover:bg-gray-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 z-50">
                    <button className="text-[var(--color-light)] hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-gray-100">
                        <Search className="w-5 h-5" />
                    </button>

                    <Link
                        to="/login"
                        className="hidden md:flex btn btn-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-none hover:shadow-lg transition-all"
                    >
                        Login
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-[var(--color-light)] hover:text-[var(--color-primary)] p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-[var(--color-dark-300)] shadow-lg py-6 px-4 flex flex-col gap-4 animate-fade-in">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path.split('?')[0] &&
                            (link.path.includes('?') ? location.search.includes('upcoming') : !location.search.includes('upcoming'));

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-lg font-bold py-2 px-4 rounded-lg transition-all ${isActive
                                        ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                        : 'text-[var(--color-light)]'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                    <hr className="border-[var(--color-dark-300)]" />
                    <Link
                        to="/my-bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[var(--color-light)] font-medium py-2 px-4"
                    >
                        My Bookings
                    </Link>
                    <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-primary w-full justify-center"
                    >
                        Login / Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
