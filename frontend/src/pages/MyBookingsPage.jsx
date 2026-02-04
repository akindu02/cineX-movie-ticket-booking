import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatPrice, formatShowTime, getShowById } from '../data/shows';
import { getMovieById } from '../data/movies';
import { CheckCircle, Download, Ticket, MapPin, Calendar, Clock, ArrowUpRight, Check, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Dummy booking data
    const [bookings, setBookings] = useState([
        {
            id: 'BK78291',
            movieId: 1, // Dune part 2
            cinemaName: 'Scope Cinemas - Colombo City Centre',
            screenName: 'IMAX',
            date: '2026-02-14',
            time: '18:30',
            seats: ['H5', 'H6'],
            totalPrice: 5300,
            status: 'confirmed',
            posterUrl: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop',
            title: 'Dune: Part Three'
        },
        {
            id: 'BK10293',
            movieId: 5,
            cinemaName: 'PVR Cinemas - One Galle Face',
            screenName: 'Gold Class',
            date: '2025-12-20',
            time: '20:00',
            seats: ['C1', 'C2'],
            totalPrice: 7000,
            status: 'completed',
            posterUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=600&fit=crop',
            title: 'The Haunting Hour'
        }
    ]);

    useEffect(() => {
        // If coming from checkout with new booking
        if (location.state?.newBooking) {
            const newBooking = location.state.newBooking;
            // Enrich with movie/show details for consistent display
            const show = getShowById(newBooking.showId);
            const movie = show ? getMovieById(show.movieId) : {};

            const enrichedBooking = {
                ...newBooking,
                cinemaName: show?.cinemaName,
                screenName: show?.screenName,
                time: show?.time,
                date: show?.date, // override date from newBooking if needed
                title: movie?.title,
                posterUrl: movie?.posterUrl
            };

            setBookings(prev => [enrichedBooking, ...prev]);
            setShowSuccessModal(true);

            // Clean state to prevent duplicate addition on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'upcoming') return b.status === 'confirmed';
        return b.status === 'completed' || b.status === 'cancelled';
    });

    const handleDownloadTicket = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Generating Ticket...',
            success: 'Ticket Downloaded PDF!',
            error: 'Download failed'
        });
    };

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'upcoming' ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-400)] hover:text-white'
                        }`}
                >
                    Upcoming
                    {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-[var(--color-primary)]' : 'text-[var(--color-light-400)] hover:text-white'
                        }`}
                >
                    History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full"></div>}
                </button>
            </div>

            {/* List */}
            <div className="space-y-6">
                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-[var(--color-dark-200)] rounded-xl overflow-hidden border border-white/5 flex flex-col md:flex-row hover:border-white/10 transition-colors group">
                        {/* Poster */}
                        <div className="w-full md:w-32 aspect-[3/4] md:aspect-auto shrink-0 relative">
                            <img src={booking.posterUrl} alt={booking.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 md:hidden">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {booking.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{booking.title}</h3>
                                    <span className={`hidden md:block px-2 py-1 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-[var(--color-light-400)] text-sm mb-4">Booking ID: <span className="font-mono text-white">{booking.id}</span></p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm mb-6">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-[var(--color-light-400)] mt-0.5" />
                                        <div>
                                            <p className="text-white font-medium">{booking.cinemaName}</p>
                                            <p className="text-[var(--color-light-400)] text-xs">{booking.screenName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-[var(--color-light-400)]" />
                                            <span>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[var(--color-light-400)]" />
                                            <span>{formatShowTime(booking.time || '18:00')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-[var(--color-light-400)]">Seats:</span>
                                    <span className="font-bold text-white bg-white/10 px-2 py-1 rounded">{booking.seats.join(', ')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/5">
                                {booking.status === 'confirmed' && (
                                    <>
                                        <button onClick={handleDownloadTicket} className="btn-secondary px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10">
                                            <Download className="w-4 h-4" /> E-Ticket
                                        </button>
                                        <button className="text-white hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 text-sm font-medium">
                                            View Details <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-[var(--color-dark-200)]/30 rounded-xl border border-dashed border-white/10">
                        <Ticket className="w-16 h-16 mx-auto text-[var(--color-light-400)] mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No Bookings Found</h3>
                        <p className="text-[var(--color-light-400)] mb-6">You haven't made any bookings yet.</p>
                        <Link to="/movies" className="btn btn-primary px-6 py-2">Book a Movie</Link>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[var(--color-dark)] rounded-2xl w-full max-w-md p-8 text-center relative shadow-2xl border border-[var(--color-primary)]/20">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>

                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                        <p className="text-[var(--color-light-300)] mb-8">
                            Your tickets have been booked successfully. A confirmation email has been sent to you.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button onClick={handleDownloadTicket} className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl">
                                <Download className="w-5 h-5" /> Download E-Ticket
                            </button>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="btn btn-secondary w-full py-3 rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
