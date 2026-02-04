import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatPrice, formatShowTime, getShowById } from '../data/shows';
import { getMovieById } from '../data/movies';
import { CheckCircle, Download, Ticket, MapPin, Calendar, Clock, ArrowUpRight, Check, X, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [newBookingData, setNewBookingData] = useState(null);

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
            setNewBookingData(enrichedBooking); // Save for modal
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
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Generating E-Ticket PDF...',
            success: 'Ticket Downloaded Successfully!',
            error: 'Download failed'
        });
    };

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto min-h-screen bg-gray-50/50">
            <h1 className="text-3xl font-extrabold mb-8 text-[var(--color-light)]">My Bookings</h1>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'upcoming' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    Upcoming
                    {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'history' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full"></div>}
                </button>
            </div>

            {/* List */}
            <div className="space-y-6">
                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-lg hover:border-red-100 transition-all group shadow-sm">
                        {/* Poster */}
                        <div className="w-full md:w-32 aspect-[3/4] md:aspect-auto shrink-0 relative">
                            <img src={booking.posterUrl} alt={booking.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 md:hidden">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {booking.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-[var(--color-light)]">{booking.title}</h3>
                                    <span className={`hidden md:block px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 font-medium">Booking ID: <span className="font-mono text-[var(--color-light)]">{booking.id}</span></p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400"><MapPin className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[var(--color-light)] font-bold">{booking.cinemaName}</p>
                                            <p className="text-gray-500 text-xs font-medium">{booking.screenName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-400"><Calendar className="w-4 h-4" /></div>
                                            <span className="text-gray-600 font-medium">{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-400"><Clock className="w-4 h-4" /></div>
                                            <span className="text-gray-600 font-medium">{formatShowTime(booking.time || '18:00')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                                    <span className="text-gray-500 font-bold">Seats:</span>
                                    <span className="font-bold text-[var(--color-primary)]">{booking.seats.join(', ')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dashed border-gray-100">
                                {booking.status === 'confirmed' && (
                                    <>
                                        <button onClick={handleDownloadTicket} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-2">
                                            <Download className="w-4 h-4" /> E-Ticket
                                        </button>
                                        <button className="text-[var(--color-primary)] hover:text-red-700 transition-colors flex items-center gap-1 text-sm font-bold">
                                            View Details <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Ticket className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">No Bookings Found</h3>
                        <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
                        <Link to="/movies" className="btn btn-primary px-8 py-3 rounded-xl font-bold">Book a Movie</Link>
                    </div>
                )}
            </div>

            {/* Success Modal - styled as E-Ticket */}
            {showSuccessModal && newBookingData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 z-10 p-1 bg-white/20 hover:bg-black/5 rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Ticket Header */}
                        <div className="bg-[var(--color-primary)] p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-black/10">
                                    <CheckCircle className="w-8 h-8 text-[var(--color-primary)]" />
                                </div>
                                <h2 className="text-2xl font-black mb-1">Booking Confirmed!</h2>
                                <p className="text-white/80 font-medium text-sm">Your E-Ticket is ready</p>
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-8">
                            {/* Movie Title */}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-[var(--color-light)] mb-1">{newBookingData.title}</h3>
                                <p className="text-sm font-medium text-gray-500">{newBookingData.cinemaName}</p>
                            </div>

                            {/* Info Grid */}
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
                                    <span className="text-sm font-bold text-[var(--color-light)]">{new Date(newBookingData.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time</span>
                                    <span className="text-sm font-bold text-[var(--color-light)]">{formatShowTime(newBookingData.time)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Screen</span>
                                    <span className="text-sm font-bold text-[var(--color-light)]">{newBookingData.screenName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seats</span>
                                    <span className="text-lg font-black text-[var(--color-primary)]">{newBookingData.seats.join(', ')}</span>
                                </div>
                            </div>

                            {/* Barcode (Fake) */}
                            <div className="flex flex-col items-center gap-2 mb-6 opacity-60">
                                <div className="h-12 w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png')] bg-contain bg-center bg-no-repeat opacity-80" style={{ backgroundImage: 'linear-gradient(90deg, #333 2px, transparent 2px, #333 4px, transparent 4px, #333 8px, transparent 8px)' }}></div>
                                <div className="flex justify-between w-3/4 h-8 bg-gray-800 rounded-sm"></div>
                                <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400">ID: {newBookingData.id}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <button onClick={handleDownloadTicket} className="btn btn-primary w-full py-3.5 flex items-center justify-center gap-2 rounded-xl text-base shadow-xl shadow-red-500/20">
                                    <Download className="w-5 h-5" /> Download E-Ticket
                                </button>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
