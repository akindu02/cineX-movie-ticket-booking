import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatShowTime } from '../data/shows';
import { getUserBookings, cancelBooking } from '../services/api';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle, Download, Ticket, MapPin, Calendar, Clock, ArrowUpRight, Check, X, Printer, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
    const location = useLocation();
    const { user, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [newBookingData, setNewBookingData] = useState(null);

    const fetchBookings = async () => {
        if (!isLoaded || !user) return;
        try {
            setLoading(true);
            const data = await getUserBookings(user.id);
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [isLoaded, user]);

    // Legacy support for redirect from checkout (if any)
    useEffect(() => {
        if (location.state?.newBooking) {
            setNewBookingData(location.state.newBooking);
            setShowSuccessModal(true);
            // We should reload to get the real data from DB
            fetchBookings();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleCancelBooking = async (bookingId) => {
        try {
            await cancelBooking(bookingId);
            toast.success("Booking cancelled successfully");
            fetchBookings(); // Refresh list
        } catch (err) {
            console.error("Failed to cancel booking:", err);
            toast.error("Failed to cancel booking");
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'upcoming') {
            return b.status === 'confirmed' && new Date(b.show?.start_time) >= new Date();
        }
        return b.status !== 'confirmed' || new Date(b.show?.start_time) < new Date();
    });

    const handleDownloadTicket = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Generating E-Ticket PDF...',
            success: 'Ticket Downloaded Successfully!',
            error: 'Download failed'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 pt-20">
                <Loader className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

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
                    <div key={booking.booking_id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-lg hover:border-red-100 transition-all group shadow-sm">
                        {/* Poster */}
                        <div className="w-full md:w-32 aspect-[3/4] md:aspect-auto shrink-0 relative">
                            <img
                                src={booking.show?.movie?.poster_url || "https://via.placeholder.com/150x200"}
                                alt={booking.show?.movie?.title}
                                className="w-full h-full object-cover"
                            />
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
                                    <h3 className="text-xl font-bold text-[var(--color-light)]">{booking.show?.movie?.title || 'Unknown Title'}</h3>
                                    <span className={`hidden md:block px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 font-medium">Booking ID: <span className="font-mono text-[var(--color-light)]">{booking.booking_id}</span></p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400"><MapPin className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[var(--color-light)] font-bold">{booking.show?.cinema?.name}</p>
                                            <p className="text-gray-500 text-xs font-medium">{booking.show?.screen_name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-400"><Calendar className="w-4 h-4" /></div>
                                            <span className="text-gray-600 font-medium">
                                                {booking.show?.start_time ? new Date(booking.show.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-400"><Clock className="w-4 h-4" /></div>
                                            <span className="text-gray-600 font-medium">
                                                {booking.show?.start_time ? formatShowTime(booking.show.start_time) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                                    <span className="text-gray-500 font-bold">Seats:</span>
                                    <span className="font-bold text-[var(--color-primary)]">
                                        {booking.seats?.map(s => s.seat_number).join(', ') || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dashed border-gray-100">
                                {booking.status === 'confirmed' && (
                                    <>
                                        <button
                                            onClick={() => handleCancelBooking(booking.booking_id)}
                                            className="px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                        >
                                            Cancel Booking
                                        </button>
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
                        <h3 className="text-xl font-bold mb-2 text-gray-800">No {activeTab} bookings found</h3>
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
