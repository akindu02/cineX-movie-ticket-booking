import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Ticket, User, LogOut, CreditCard, Bell, Settings, Shield, Loader, MapPin, Calendar, Clock, Download, ArrowUpRight, CheckCircle, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { formatShowTime } from '../data/shows';
import { getUserBookings, cancelBooking } from '../services/api';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const CustomerDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
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
    }, [isLoaded, user]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleSignOut = () => {
        // Here you would typically clear auth context/storage
        navigate('/');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'bookings':
                return <MyBookingsSection bookings={bookings} loading={loading} refreshBookings={fetchBookings} />;

            default:
                return <OverviewSection setActiveSection={setActiveSection} bookings={bookings} loading={loading} />;
        }
    };

    return (
        <div className="flex min-h-screen pt-20 bg-[var(--color-dark-100)]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 fixed h-[calc(100vh-80px)] hidden lg:block overflow-y-auto">
                <div className="p-6">
                    <nav className="space-y-1">
                        <SidebarItem
                            icon={LayoutGrid}
                            label="Dashboard"
                            active={activeSection === 'overview'}
                            onClick={() => setActiveSection('overview')}
                        />
                        <SidebarItem
                            icon={Ticket}
                            label="My Bookings"
                            active={activeSection === 'bookings'}
                            onClick={() => setActiveSection('bookings')}
                        />
                    </nav>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <nav className="space-y-1">
                            {/* <SidebarItem icon={Bell} label="Notifications" /> */}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
            ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-red-200'
            : 'text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)]'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

/* --- Sub-Sections --- */

const OverviewSection = ({ setActiveSection, bookings, loading }) => {
    if (loading) {
        return (
            <div className="animate-fade-in flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    const totalBookings = bookings.length;
    const upcomingShows = bookings.filter(b => b.show?.start_time && new Date(b.show.start_time) > new Date()).length;
    // Calculate points: 10 points for every booking (dummy logic)
    const points = totalBookings * 10;

    // Recent activity: Top 3 most recent bookings
    const recentActivity = bookings.slice(0, 3);

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-light)]">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard icon={Ticket} label="Total Bookings" value={totalBookings} color="bg-blue-50 text-blue-600" />
                <StatsCard icon={Calendar} label="Upcoming Shows" value={upcomingShows} color="bg-orange-50 text-orange-600" />
                <StatsCard icon={CreditCard} label="Points Earned" value={points} color="bg-purple-50 text-purple-600" />
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--color-light)]">Recent Activity</h2>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((booking) => (
                            <div key={booking.booking_id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                    <Ticket className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-sm text-[var(--color-light)]">Ticket Purchased</h4>
                                    <p className="text-xs text-gray-500">
                                        {booking.show?.movie?.title || 'Unknown Movie'} • {booking.show?.screen_name || 'N/A'}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">
                                    {new Date(booking.booking_date || booking.show?.start_time).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6" />
        </div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-[var(--color-light)]">{value}</h3>
    </div>
);

const MyBookingsSection = ({ bookings, loading, refreshBookings }) => {
    const handleCancelBooking = async (bookingId) => {
        try {
            await cancelBooking(bookingId);
            toast.success("Booking cancelled successfully");
            refreshBookings();
        } catch (err) {
            console.error("Failed to cancel booking:", err);
            toast.error("Failed to cancel booking");
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[var(--color-light)] mb-6">My Bookings</h2>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                    <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No bookings yet</h3>
                    <p className="text-gray-400 mb-6">Start by browsing movies and booking your first show!</p>
                    <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all">
                            <img
                                src={booking.show?.movie?.poster_url || "https://via.placeholder.com/96x128"}
                                alt=""
                                className="w-full md:w-24 h-32 object-cover rounded-xl shadow-sm"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-[var(--color-light)]">
                                            {booking.show?.movie?.title || `Show #${booking.show_id}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {booking.show?.cinema?.name || 'Cinema'} • {booking.show?.screen_name}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                        booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {booking.show?.start_time ? new Date(booking.show.start_time).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {booking.show?.start_time ? formatShowTime(booking.show.start_time) : 'N/A'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-bold text-gray-400">Seats:</span>
                                    <span className="font-bold text-[var(--color-primary)]">
                                        {booking.seats?.map(s => s.seat_number).join(', ') || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-dashed border-gray-100 pt-4 md:pt-0 md:pl-6">
                                <button className="flex-1 btn bg-gray-50 text-[var(--color-light)] hover:bg-gray-100 border border-gray-200 text-xs px-4 py-2 rounded-lg font-bold">
                                    View Ticket
                                </button>
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking.booking_id)}
                                        className="flex-1 btn text-xs px-4 py-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboardPage;
