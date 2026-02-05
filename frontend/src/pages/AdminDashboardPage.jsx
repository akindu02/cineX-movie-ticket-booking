import { useState, useMemo } from 'react';
import { movies } from '../data/movies';
import { shows, formatPrice, formatShowTime, getAllCinemas } from '../data/shows';
import { LayoutGrid, Film, Monitor, Ticket, Search, Plus, Edit, Trash, Users, DollarSign, Calendar, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');

    // Stats
    const stats = useMemo(() => {
        const totalMovies = movies.length;
        const totalShows = shows.length;
        const totalRevenue = shows.reduce((acc, show) => {
            // Simple simulation of revenue: avg 30% occupancy
            return acc + (show.priceLkr * (show.availableSeats * 0.3));
        }, 0);
        const activeCinemas = getAllCinemas().length;

        return [
            { label: 'Total Revenue', value: formatPrice(totalRevenue), change: '+12%', icon: DollarSign, color: 'text-green-500' },
            { label: 'Active Movies', value: totalMovies, change: '+3', icon: Film, color: 'text-blue-500' },
            { label: 'Total Shows', value: totalShows, change: '+24', icon: Calendar, color: 'text-purple-500' },
            { label: 'Bookings Today', value: '1,240', change: '+18%', icon: Ticket, color: 'text-orange-500' },
        ];
    }, []);

    const handleDelete = (id) => {
        toast.success(`Item ${id} deleted successfully`);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'movies':
                return <MoviesTable onDelete={handleDelete} />;
            case 'shows':
                return <ShowsTable onDelete={handleDelete} />;
            case 'cinemas':
                return <div className="p-8 text-center text-gray-400">Cinemas Management (Coming Soon)</div>;
            default:
                return <Overview stats={stats} />;
        }
    };

    return (
        <div className="flex min-h-screen pt-20">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-dark-200)] border-r border-white/5 fixed h-[calc(100vh-80px)] hidden lg:block">
                <div className="p-6">
                    <h2 className="text-sm uppercase tracking-wider text-[var(--color-light-400)] font-bold mb-4">Management</h2>
                    <nav className="space-y-2">
                        <SidebarItem icon={LayoutGrid} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
                        <SidebarItem icon={Film} label="Movies" active={activeSection === 'movies'} onClick={() => setActiveSection('movies')} />
                        <SidebarItem icon={Monitor} label="Shows" active={activeSection === 'shows'} onClick={() => setActiveSection('shows')} />
                        <SidebarItem icon={Ticket} label="Bookings" active={activeSection === 'bookings'} onClick={() => setActiveSection('bookings')} />
                        <SidebarItem icon={Users} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
            : 'text-[var(--color-light-300)] hover:bg-white/5 hover:text-white'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

const Overview = ({ stats }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-[var(--color-dark-200)] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {stat.change}
                        </span>
                    </div>
                    <p className="text-[var(--color-light-400)] text-sm mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
            ))}
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-[var(--color-dark-200)] p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
            <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold">
                                JD
                            </div>
                            <div>
                                <p className="font-semibold text-white">John Doe</p>
                                <p className="text-xs text-[var(--color-light-400)]">Booked 2 tickets for Dune: Part Two</p>
                            </div>
                        </div>
                        <span className="text-sm font-mono text-[var(--color-light-400)]">2 mins ago</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const MoviesTable = ({ onDelete }) => {
    const [search, setSearch] = useState('');
    const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Movies Management</h2>
                <button className="btn btn-primary px-4 py-2 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Movie
                </button>
            </div>

            <div className="bg-[var(--color-dark-200)] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[var(--color-dark)] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-[var(--color-dark-300)]">
                        <thead className="text-xs uppercase bg-[var(--color-dark)] text-[var(--color-light-400)]">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Genre</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMovies.map(movie => (
                                <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <img src={movie.posterUrl} alt="" className="w-8 h-12 object-cover rounded" />
                                        {movie.title}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-light-300)] text-sm">{movie.genres.join(', ')}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20">
                                            {movie.rating}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(movie.id)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-500">
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

const ShowsTable = ({ onDelete }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shows Management</h2>
                <button className="btn btn-primary px-4 py-2 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Show
                </button>
            </div>
            <div className="bg-[var(--color-dark-200)] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="text-xs uppercase bg-[var(--color-dark)] text-[var(--color-light-400)]">
                        <tr>
                            <th className="px-6 py-4">Movie</th>
                            <th className="px-6 py-4">Cinema</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {shows.slice(0, 10).map(show => ( // Limit to 10 for demo
                            <tr key={show.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-white">ID: {show.movieId}</td>
                                <td className="px-6 py-4 text-sm text-[var(--color-light-300)]">
                                    <div className="font-medium text-white">{show.cinemaName.split(' - ')[0]}</div>
                                    <div className="text-xs">{show.screenName}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--color-light-300)]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-3 h-3" /> {new Date(show.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> {formatShowTime(show.time)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-[var(--color-accent)]">
                                    {formatPrice(show.priceLkr)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onDelete(show.id)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-500">
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
    );
};

export default AdminDashboardPage;
