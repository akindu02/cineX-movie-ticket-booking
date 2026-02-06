import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import { shows, formatPrice, formatShowTime, getAllCinemas } from '../data/shows';
import { LayoutGrid, Film, Monitor, Ticket, Search, Plus, Edit, Trash, Users, Coins, Calendar, TrendingUp, Clock, LogOut, Bell, Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [isAddShowModalOpen, setIsAddShowModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        navigate('/');
    };

    // Stats Logic
    const stats = useMemo(() => {
        const totalMovies = movies.length;
        const totalShows = shows.length;
        const totalRevenue = shows.reduce((acc, show) => {
            return acc + (show.priceLkr * (show.availableSeats * 0.3)); // Simulating 30% occupancy
        }, 0);

        return [
            { label: 'Total Revenue', value: formatPrice(totalRevenue), change: '+12%', icon: Coins, color: 'bg-green-50 text-green-600' },
            { label: 'Active Movies', value: totalMovies, change: '+3', icon: Film, color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Shows', value: totalShows, change: '+24', icon: Monitor, color: 'bg-purple-50 text-purple-600' },
            { label: 'Bookings Today', value: '1,240', change: '+18%', icon: Ticket, color: 'bg-orange-50 text-orange-600' },
        ];
    }, []);

    const handleDelete = (id, type) => {
        toast.success(`${type} ${id} deleted successfully`);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'movies':
                return <MoviesSection onDelete={(id) => handleDelete(id, 'Movie')} onAddMovie={() => setIsAddShowModalOpen(true)} />;
            case 'shows':
                return <ShowsSection onDelete={(id) => handleDelete(id, 'Show')} onAddShow={() => setIsAddShowModalOpen(true)} />;
            case 'bookings':
                return <BookingsSection />;
            default:
                return <OverviewSection stats={stats} setActiveSection={setActiveSection} onAddMovie={() => setIsAddShowModalOpen(true)} />;
        }
    };

    return (
        <div className="flex min-h-screen pt-20 bg-[var(--color-dark-100)]">
            <AddShowModal
                isOpen={isAddShowModalOpen}
                onClose={() => setIsAddShowModalOpen(false)}
                movies={movies}
            />

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
                            icon={Film}
                            label="Manage Movies"
                            active={activeSection === 'movies'}
                            onClick={() => setActiveSection('movies')}
                        />
                        <SidebarItem
                            icon={Monitor}
                            label="Manage Shows"
                            active={activeSection === 'shows'}
                            onClick={() => setActiveSection('shows')}
                        />
                        <SidebarItem
                            icon={Ticket}
                            label="Bookings"
                            active={activeSection === 'bookings'}
                            onClick={() => setActiveSection('bookings')}
                        />
                    </nav>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <nav className="space-y-1">

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
                <div className="max-w-6xl mx-auto">
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

const OverviewSection = ({ stats, setActiveSection, onAddMovie }) => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-light)]">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <button
                    onClick={onAddMovie}
                    className="btn btn-primary shadow-lg shadow-red-500/20"
                >
                    <Plus className="w-5 h-5" /> Add New Movie
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> {stat.change}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-[var(--color-light)]">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[var(--color-light)] mb-6">Recent Bookings</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                        {'U' + (i + 1)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--color-light)] text-sm">User {i + 1}</p>
                                        <p className="text-xs text-gray-500">Booked 2 tickets for <span className="font-medium text-[var(--color-primary)]">Dune: Part Two</span></p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-400">{i * 5 + 2} mins ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MoviesSection = ({ onDelete, onAddMovie }) => {
    const [search, setSearch] = useState('');
    const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-light)]">Movies</h2>
                    <p className="text-gray-500 text-sm">Manage your movie catalog</p>
                </div>
                <button
                    onClick={onAddMovie}
                    className="btn btn-primary px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" /> Add Movie
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search movies by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Title</th>
                                <th className="px-6 py-4">Genre</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMovies.map(movie => (
                                <tr key={movie.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={movie.posterUrl} alt="" className="w-10 h-14 object-cover rounded-lg shadow-sm" />
                                            <div>
                                                <div className="font-bold text-[var(--color-light)]">{movie.title}</div>
                                                <div className="text-xs text-gray-400">{Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                                        <div className="flex flex-wrap gap-1">
                                            {movie.genres.map(g => (
                                                <span key={g} className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{g}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full w-fit">
                                            <span className="text-xs font-bold">★ {movie.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(movie.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ShowsSection = ({ onDelete, onAddShow }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-light)]">Shows</h2>
                    <p className="text-gray-500 text-sm">Schedule and manage screenings</p>
                </div>
                <button
                    onClick={onAddShow}
                    className="btn btn-primary px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" /> Add Show
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Movie ID</th>
                                <th className="px-6 py-4">Cinema & Screen</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {shows.slice(0, 8).map(show => ( // Limit for demo
                                <tr key={show.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4 text-sm font-bold text-[var(--color-light)]">#{show.movieId}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-700 text-sm">{show.cinemaName.split(' - ')[0]}</div>
                                        <div className="text-xs text-gray-400 font-medium">{show.screenName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Calendar className="w-3 h-3" /> {new Date(show.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-light)]">
                                                <Clock className="w-3 h-3 text-[var(--color-primary)]" /> {formatShowTime(show.time)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-600">
                                        {formatPrice(show.priceLkr)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(show.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const BookingsSection = () => {
    // Dummy bookings data
    const bookings = [
        { id: 'BK001', user: 'User 1', movie: 'Dune: Part Two', date: '2026-02-10', seats: 2, total: 5000, status: 'Confirmed' },
        { id: 'BK002', user: 'User 2', movie: 'Kung Fu Panda 4', date: '2026-02-12', seats: 4, total: 8000, status: 'Completed' },
        { id: 'BK003', user: 'User 3', movie: 'Civil War', date: '2026-02-14', seats: 1, total: 2500, status: 'Cancelled' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-light)]">Bookings</h2>
                    <p className="text-gray-500 text-sm">View and manage customer bookings</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-4">Booking ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Movie Details</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-4 font-mono text-sm font-bold text-gray-400">#{booking.id}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-700">{booking.user}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-[var(--color-light)]">{booking.movie}</div>
                                    <div className="text-xs text-gray-400">{booking.seats} Seats • {booking.date}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-sm">{formatPrice(booking.total)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                        booking.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                                            'bg-red-50 text-red-600'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-6 text-center border-t border-gray-100">
                    <button className="text-sm font-bold text-[var(--color-primary)] hover:underline">View All Transactions</button>
                </div>
            </div>
        </div>
    );
};

const AddShowModal = ({ isOpen, onClose, movies }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg mx-4 shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-[var(--color-light)]">Schedule New Show</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Select Movie</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600">
                            <option value="">Select a movie...</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Film Hall (Cinema)</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600">
                            <option value="">Select cinema hall...</option>
                            <option value="Scope Cinemas - Colombo City Centre">Scope Cinemas - CCC (Dolby Atmos)</option>
                            <option value="PVR Cinemas - One Galle Face">PVR Cinemas - OGF (LUXE)</option>
                            <option value="Liberty by Scope Cinemas">Liberty by Scope (4K Laser)</option>
                            <option value="Savoy Premiere">Savoy Premiere (3D)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ticket Price (LKR)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">LKR</span>
                            <input type="number" placeholder="2500" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600" />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn btn-primary py-3 rounded-xl shadow-lg shadow-red-500/20 font-bold">
                            Add Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

import { X } from 'lucide-react'; // Import X icon

export default AdminDashboardPage;
