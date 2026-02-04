import { useState } from 'react';
import { Link } from 'react-router-dom';

const MyBookingsPage = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const bookings = [
        {
            id: 1,
            movieTitle: "Dune: Part Three",
            poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=200&h=300&fit=crop",
            date: "February 4, 2026",
            time: "7:15 PM",
            screen: "IMAX",
            seats: ["D5", "D6"],
            totalAmount: 1049,
            bookingId: "CX2026020401",
            status: "confirmed",
        },
        {
            id: 2,
            movieTitle: "Avatar: The Final Chapter",
            poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=300&fit=crop",
            date: "February 8, 2026",
            time: "4:30 PM",
            screen: "Dolby Atmos",
            seats: ["F10", "F11", "F12"],
            totalAmount: 1099,
            bookingId: "CX2026020802",
            status: "confirmed",
        },
        {
            id: 3,
            movieTitle: "Inception 2",
            poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop",
            date: "January 15, 2026",
            time: "10:00 PM",
            screen: "Premium",
            seats: ["B3", "B4"],
            totalAmount: 649,
            bookingId: "CX2026011503",
            status: "completed",
        },
    ];

    const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
    const pastBookings = bookings.filter(b => b.status === 'completed');
    const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
                    <p className="text-[var(--color-light-400)]">View and manage your movie tickets</p>
                </div>

                <div className="flex gap-4 mb-8">
                    {['upcoming', 'past'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${activeTab === tab
                                    ? 'bg-[var(--color-primary)] text-white glow-effect'
                                    : 'bg-[var(--color-dark-200)] text-[var(--color-light-400)]'
                                }`}
                        >
                            {tab} ({tab === 'upcoming' ? upcomingBookings.length : pastBookings.length})
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {displayBookings.map((booking) => (
                        <div key={booking.id} className="bg-glass rounded-2xl overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-36 flex-shrink-0">
                                    <img src={booking.poster} alt={booking.movieTitle} className="w-full h-48 md:h-full object-cover" />
                                </div>
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">{booking.movieTitle}</h3>
                                            <p className="text-[var(--color-light-400)]">{booking.date} • {booking.time}</p>
                                        </div>
                                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-primary'}`}>
                                            {booking.status === 'confirmed' ? '✓ Confirmed' : 'Completed'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div><p className="text-sm text-[var(--color-light-400)]">Screen</p><p className="font-medium">{booking.screen}</p></div>
                                        <div><p className="text-sm text-[var(--color-light-400)]">Seats</p><p className="font-medium">{booking.seats.join(', ')}</p></div>
                                        <div><p className="text-sm text-[var(--color-light-400)]">Booking ID</p><p className="font-mono text-sm">{booking.bookingId}</p></div>
                                        <div><p className="text-sm text-[var(--color-light-400)]">Amount</p><p className="text-[var(--color-primary)] font-medium">₹{booking.totalAmount}</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {displayBookings.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-2xl font-semibold mb-2">No {activeTab} bookings</h3>
                        <Link to="/movies" className="btn btn-primary mt-4">Browse Movies</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
