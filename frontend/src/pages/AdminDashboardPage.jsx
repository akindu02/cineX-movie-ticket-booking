import { useState } from 'react';

const AdminDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const stats = [
        { label: 'Total Bookings', value: '2,547', change: '+12%', icon: '🎟️' },
        { label: 'Revenue Today', value: '₹1,25,000', change: '+8%', icon: '💰' },
        { label: 'Active Shows', value: '24', change: '+2', icon: '🎬' },
        { label: 'Total Users', value: '15,832', change: '+156', icon: '👥' },
    ];

    const recentBookings = [
        { id: 'CX001', movie: 'Dune: Part Three', user: 'john@email.com', seats: 2, amount: 1000, time: '2 min ago' },
        { id: 'CX002', movie: 'Avatar: Final', user: 'jane@email.com', seats: 4, amount: 1400, time: '5 min ago' },
        { id: 'CX003', movie: 'Inception 2', user: 'mike@email.com', seats: 1, amount: 350, time: '12 min ago' },
    ];

    const movies = [
        { id: 1, title: 'Dune: Part Three', shows: 5, bookings: 234, revenue: '₹1,17,000' },
        { id: 2, title: 'Avatar: Final Chapter', shows: 4, bookings: 189, revenue: '₹94,500' },
        { id: 3, title: 'Inception 2', shows: 6, bookings: 156, revenue: '₹54,600' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-[var(--color-light-400)]">Manage movies, shows, and bookings</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-glass rounded-2xl p-6 hover-lift">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <span className="badge badge-success">{stat.change}</span>
                            </div>
                            <p className="text-2xl font-bold mb-1">{stat.value}</p>
                            <p className="text-[var(--color-light-400)]">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['overview', 'movies', 'shows', 'bookings'].map(section => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`px-5 py-2.5 rounded-xl font-medium capitalize whitespace-nowrap transition-all ${activeSection === section
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-dark-200)] text-[var(--color-light-400)]'
                                }`}
                        >
                            {section}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <div className="bg-glass rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Recent Bookings</h2>
                            <button className="text-[var(--color-primary)] text-sm hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {recentBookings.map(booking => (
                                <div key={booking.id} className="flex justify-between items-center p-4 bg-[var(--color-dark-200)] rounded-xl">
                                    <div>
                                        <p className="font-medium">{booking.movie}</p>
                                        <p className="text-sm text-[var(--color-light-400)]">{booking.user} • {booking.seats} seats</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-[var(--color-primary)]">₹{booking.amount}</p>
                                        <p className="text-xs text-[var(--color-light-400)]">{booking.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Movies */}
                    <div className="bg-glass rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Top Performing Movies</h2>
                            <button className="btn btn-secondary text-sm">+ Add Movie</button>
                        </div>
                        <div className="space-y-4">
                            {movies.map(movie => (
                                <div key={movie.id} className="flex justify-between items-center p-4 bg-[var(--color-dark-200)] rounded-xl">
                                    <div>
                                        <p className="font-medium">{movie.title}</p>
                                        <p className="text-sm text-[var(--color-light-400)]">{movie.shows} shows • {movie.bookings} bookings</p>
                                    </div>
                                    <p className="font-semibold text-[var(--color-accent)]">{movie.revenue}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
