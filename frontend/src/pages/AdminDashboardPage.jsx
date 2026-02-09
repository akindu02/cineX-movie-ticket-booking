import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatShowTime } from '../data/shows';
import { getMovies, getAllShows, getAllBookings, deleteMovie, deleteShow, createCinema, createMovie, getAllCinemas } from '../services/api';
import { LayoutGrid, Film, Monitor, Ticket, Search, Plus, Edit, Trash, Users, Coins, Calendar, TrendingUp, Clock, LogOut, Bell, Settings, Shield, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [isAddCinemaModalOpen, setIsAddCinemaModalOpen] = useState(false);
    const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
    const navigate = useNavigate();

    // API Data State
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [moviesData, showsData, bookingsData, cinemasData] = await Promise.all([
                    getMovies(),
                    getAllShows(),
                    getAllBookings(),
                    getAllCinemas()
                ]);
                setMovies(moviesData);
                setShows(showsData);
                setBookings(bookingsData);
                setCinemas(cinemasData);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSignOut = () => {
        navigate('/');
    };

    // Stats Logic - now uses API data
    const stats = useMemo(() => {
        const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.total_amount || 0), 0);
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

        return [
            { label: 'Total Revenue', value: formatPrice(totalRevenue), change: '+12%', icon: Coins, color: 'bg-green-50 text-green-600' },
            { label: 'Active Movies', value: movies.length, change: '+3', icon: Film, color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Shows', value: shows.length, change: '+24', icon: Monitor, color: 'bg-purple-50 text-purple-600' },
            { label: 'Active Bookings', value: confirmedBookings, change: '+18%', icon: Ticket, color: 'bg-orange-50 text-orange-600' },
        ];
    }, [movies, shows, bookings]);

    const handleDeleteMovie = async (id) => {
        try {
            await deleteMovie(id);
            toast.success("Movie deleted successfully");
            setMovies(prev => prev.filter(m => m.movie_id !== id));
        } catch (err) {
            console.error("Failed to delete movie:", err);
            toast.error("Failed to delete movie");
        }
    };

    const handleDeleteShow = async (id) => {
        try {
            await deleteShow(id);
            toast.success("Show deleted successfully");
            setShows(prev => prev.filter(s => s.show_id !== id));
        } catch (err) {
            console.error("Failed to delete show:", err);
            toast.error("Failed to delete show");
        }
    };

    const handleAddCinema = async (cinemaData) => {
        try {
            const newCinema = await createCinema(cinemaData);
            toast.success("Cinema created successfully");
            setCinemas(prev => [newCinema, ...prev]);
            setIsAddCinemaModalOpen(false);
        } catch (err) {
            console.error("Failed to create cinema:", err);
            toast.error(err.response?.data?.detail || "Failed to create cinema");
        }
    };

    const handleAddMovie = async (movieData) => {
        try {
            console.log('handleAddMovie called with:', movieData);
            const newMovie = await createMovie(movieData);
            console.log('Movie created successfully:', newMovie);
            toast.success("Movie created successfully");
            setMovies(prev => [newMovie, ...prev]);
            setIsAddMovieModalOpen(false);
        } catch (err) {
            console.error("Failed to create movie - Full error:", err);
            console.error("Error response:", err.response);
            console.error("Error data:", err.response?.data);
            const errorMessage = err.response?.data?.detail || err.message || "Failed to create movie";
            toast.error(errorMessage);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <Loader className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
                </div>
            );
        }

        switch (activeSection) {
            case 'movies':
                return <MoviesSection movies={movies} onDelete={handleDeleteMovie} onAddMovie={() => setIsAddMovieModalOpen(true)} />;
            case 'cinemas':
                return <CinemasSection cinemas={cinemas} onAddCinema={() => setIsAddCinemaModalOpen(true)} />;
            case 'bookings':
                return <BookingsSection bookings={bookings} />;
            default:
                return <OverviewSection stats={stats} bookings={bookings} setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className="flex min-h-screen pt-20 bg-[var(--color-dark-100)]">
            <AddCinemaModal
                isOpen={isAddCinemaModalOpen}
                onClose={() => setIsAddCinemaModalOpen(false)}
                onSubmit={handleAddCinema}
            />
            <AddMovieModal
                isOpen={isAddMovieModalOpen}
                onClose={() => setIsAddMovieModalOpen(false)}
                onSubmit={handleAddMovie}
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
                            label="Manage Cinemas"
                            active={activeSection === 'cinemas'}
                            onClick={() => setActiveSection('cinemas')}
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

const OverviewSection = ({ stats, bookings = [], setActiveSection }) => {
    // Get recent bookings (last 5)
    const recentBookings = bookings.slice(0, 5);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-light)]">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
                </div>
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
                        {recentBookings.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No recent bookings</p>
                            </div>
                        ) : (
                            recentBookings.map((booking) => (
                                <div key={booking.booking_id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${booking.status === 'confirmed' ? 'bg-green-500' :
                                            booking.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-400'
                                            }`}>
                                            #{booking.booking_id}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--color-light)] text-sm">{booking.contact_email}</p>
                                            <p className="text-xs text-gray-500">
                                                Booked {booking.seats?.length || 0} tickets for{' '}
                                                <span className="font-medium text-[var(--color-primary)]">
                                                    {booking.show?.movie?.title || `Show #${booking.show_id}`}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">
                                        {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MoviesSection = ({ movies = [], onDelete, onAddMovie }) => {
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = (movieId, movieTitle) => {
        if (deleteConfirm === movieId) {
            onDelete(movieId);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(movieId);
            // Auto-reset after 3 seconds
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-light)]">Movies</h2>
                    <p className="text-gray-500 text-sm">Manage your movie catalog ({movies.length} movies)</p>
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

                {filteredMovies.length === 0 ? (
                    <div className="p-12 text-center">
                        <Film className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <h3 className="text-lg font-bold text-gray-400 mb-2">
                            {search ? 'No movies found' : 'No movies yet'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {search ? 'Try a different search term' : 'Add your first movie to get started'}
                        </p>
                        {!search && (
                            <button
                                onClick={onAddMovie}
                                className="btn btn-primary px-6 py-2.5 rounded-xl"
                            >
                                <Plus className="w-5 h-5" /> Add Your First Movie
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold tracking-wider">
                                <tr>
                                    <th className="px-8 py-4">Movie</th>
                                    <th className="px-6 py-4">Genre</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMovies.map(movie => (
                                    <tr key={movie.movie_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                {movie.poster_url ? (
                                                    <img src={movie.poster_url} alt="" className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                                                ) : (
                                                    <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Film className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-[var(--color-light)]">{movie.title}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {Math.floor(movie.duration_mins / 60)}h {movie.duration_mins % 60}m
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {movie.genres?.slice(0, 3).map(g => (
                                                    <span key={g.genre || g} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                                                        {g.genre || g}
                                                    </span>
                                                ))}
                                                {movie.genres?.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-400">
                                                        +{movie.genres.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="text-gray-600 font-medium">{movie.language || 'N/A'}</div>
                                                <div className="text-xs text-gray-400">
                                                    {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'No release date'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {movie.rating ? (
                                                <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full w-fit">
                                                    <span className="text-xs font-bold">★ {movie.rating}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">No rating</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(movie.movie_id, movie.title)}
                                                    className={`p-2 rounded-lg transition-colors ${deleteConfirm === movie.movie_id
                                                        ? 'bg-red-500 text-white'
                                                        : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                                                        }`}
                                                    title={deleteConfirm === movie.movie_id ? 'Click again to confirm' : 'Delete movie'}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const CinemasSection = ({ cinemas = [], onAddCinema }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-light)]">Cinemas</h2>
                    <p className="text-gray-500 text-sm">Manage cinema locations</p>
                </div>
                <button
                    onClick={onAddCinema}
                    className="btn btn-primary px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" /> Add Cinema
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Cinema ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cinemas.map(cinema => (
                                <tr key={cinema.cinema_id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="text-sm font-bold text-gray-400">
                                            #{cinema.cinema_id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[var(--color-light)] text-sm">{cinema.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Monitor className="w-4 h-4 text-gray-400" />
                                            {cinema.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {cinemas.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-bold">No cinemas yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const BookingsSection = ({ bookings = [] }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-light)]">Bookings</h2>
                    <p className="text-gray-500 text-sm">View and manage customer bookings ({bookings.length} total)</p>
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
                        {bookings.slice(0, 20).map(booking => (
                            <tr key={booking.booking_id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-4 font-mono text-sm font-bold text-gray-400">#{booking.booking_id}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-700">{booking.contact_email || booking.user_id}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-[var(--color-light)]">
                                        {booking.show?.movie?.title || `Show #${booking.show_id}`}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {booking.seats?.length || 0} Seats • {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-sm">{formatPrice(booking.total_amount)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                        booking.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                                            'bg-red-50 text-red-600'
                                        }`}>
                                        {booking.status?.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-bold">No bookings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddCinemaModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.location) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                name: formData.name.trim(),
                location: formData.location.trim()
            });
            // Reset form
            setFormData({
                name: '',
                location: ''
            });
        } catch (err) {
            // Error handled in parent
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg mx-4 shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-[var(--color-light)]">Add New Cinema</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Cinema Name *</label>
                        <input
                            type="text"
                            placeholder="Enter cinema name (e.g., Scope Cinemas - Colombo City Centre)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                        <input
                            type="text"
                            placeholder="Enter location (e.g., Colombo 02)"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 btn btn-primary py-3 rounded-xl shadow-lg shadow-red-500/20 font-bold disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Cinema'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddMovieModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration_mins: 120,
        language: 'English',
        release_date: '',
        rating: 0,
        poster_url: '',
        trailer_url: '',
        genres: []
    });
    const [genreInput, setGenreInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const availableGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Fantasy'];

    const toggleGenre = (genre) => {
        setFormData(prev => ({
            ...prev,
            genres: prev.genres.includes(genre)
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.duration_mins || formData.genres.length === 0) {
            toast.error("Please fill in title, duration, and at least one genre");
            return;
        }

        setSubmitting(true);
        try {
            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                duration_mins: parseInt(formData.duration_mins),
                language: formData.language.trim() || null,
                release_date: formData.release_date || null,
                rating: formData.rating ? parseFloat(formData.rating) : null,
                poster_url: formData.poster_url.trim() || null,
                trailer_url: formData.trailer_url.trim() || null,
                genres: formData.genres
            };
            console.log('Submitting movie data:', submitData);
            await onSubmit(submitData);
            // Reset form
            setFormData({
                title: '',
                description: '',
                duration_mins: 120,
                language: 'English',
                release_date: '',
                rating: 0,
                poster_url: '',
                trailer_url: '',
                genres: []
            });
        } catch (err) {
            console.error('Error in AddMovieModal:', err);
            // Error is handled by the parent's handleAddMovie catch block
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
                    <h3 className="text-xl font-bold text-[var(--color-light)]">Add New Movie</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Movie Title *</label>
                        <input
                            type="text"
                            placeholder="Enter movie title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            placeholder="Enter movie description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Duration (mins) *</label>
                            <input
                                type="number"
                                value={formData.duration_mins}
                                onChange={(e) => setFormData({ ...formData, duration_mins: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                            <input
                                type="text"
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Release Date</label>
                            <input
                                type="date"
                                value={formData.release_date}
                                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating (0-10)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Poster URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/poster.jpg"
                            value={formData.poster_url}
                            onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Trailer URL</label>
                        <input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={formData.trailer_url}
                            onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-medium transition-all focus:bg-white text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Genres * (select at least one)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableGenres.map(genre => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => toggleGenre(genre)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.genres.includes(genre)
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 btn btn-primary py-3 rounded-xl shadow-lg shadow-red-500/20 font-bold disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Movie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboardPage;

