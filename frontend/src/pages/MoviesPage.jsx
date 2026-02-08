import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMovies } from '../services/api';
// We still import static lists for filter dropdowns for now, or we could fetch them too. 
// For simplicity, let's keep static categories for filters but dynamic movies.
import { getAllGenres, getAllLanguages } from '../data/movies';
import { Search, Filter, Clock, Star, Ticket, Loader } from 'lucide-react';

const MoviesPage = () => {
    const location = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters State
    const [activeGenre, setActiveGenre] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [sortBy, setSortBy] = useState('popularity');

    const genres = ['All', ...getAllGenres()];
    const languages = ['All', ...getAllLanguages()];

    // Fetch Movies on Mount
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const data = await getMovies();
                setMovies(data);
            } catch (err) {
                console.error("Failed to fetch movies:", err);
                setError("Failed to load movies. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Reset filters on URL change
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('filter') === 'upcoming') {
            setSortBy('newest');
        } else {
            setSortBy('newest'); // default to newest for now
        }
        setActiveGenre('All');
        setSearchQuery('');
        setSelectedLanguage('All');
    }, [location.search]);

    // Client-side Filtering Logic (simulated for now, can be moved to server-side later)
    const filteredMovies = useMemo(() => {
        let result = movies;
        const params = new URLSearchParams(location.search);
        const isUpcomingFilter = params.get('filter') === 'upcoming';

        if (searchQuery) {
            result = result.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (isUpcomingFilter) {
            const today = new Date();
            const futureMovies = result.filter(m => new Date(m.release_date) > today);
            if (futureMovies.length === 0) {
                // If no future movies, show all
                result = [...result].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            } else {
                result = futureMovies;
            }
        }

        if (activeGenre !== 'All') {
            // Updated: genres is list of objects {genre: "Name"}
            result = result.filter(m => m.genres.some(g => g.genre === activeGenre));
        }

        if (selectedLanguage !== 'All') {
            result = result.filter(m => m.language === selectedLanguage);
        }

        return [...result].sort((a, b) => {
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'newest') return new Date(b.release_date) - new Date(a.release_date);
            return 0; // Default
        });
    }, [movies, searchQuery, activeGenre, selectedLanguage, sortBy, location.search]);

    const isUpcoming = new URLSearchParams(location.search).get('filter') === 'upcoming';

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center pt-20 text-[var(--color-light)]">
                <Loader className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center pt-20 text-[var(--color-light)]">
                <p className="text-red-500 font-bold text-xl mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[var(--color-light)]">
                        {isUpcoming ? 'Coming Soon' : 'Movies'}
                    </h1>
                    <p className="text-[var(--color-light-400)]">
                        {isUpcoming
                            ? 'Get ready for the latest blockbusters'
                            : 'Discover and book the latest blockbusters'}
                    </p>
                </div>

                {/* Search Bar - White Theme */}
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-[var(--color-dark-300)] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-light-400)] w-5 h-5" />
                </div>
            </div>

            {/* Filters & Controls - White Theme */}
            <div className="bg-white p-4 rounded-xl mb-8 border border-[var(--color-dark-300)] shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                    {/* Genre Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {genres.map(genre => (
                            <button
                                key={genre}
                                onClick={() => setActiveGenre(genre)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeGenre === genre
                                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-200'
                                    : 'bg-[var(--color-dark-100)] text-[var(--color-light-300)] hover:bg-[var(--color-dark-200)] hover:text-[var(--color-light)]'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {/* Dropdowns */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="text-[var(--color-light-400)] w-4 h-4" />
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="bg-white border border-[var(--color-dark-300)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-light)]"
                            >
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>{lang === 'All' ? 'All Languages' : lang}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-[var(--color-dark-300)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-light)]"
                        >
                            <option value="popularity">Featured</option>
                            <option value="rating">Top Rated</option>
                            <option value="newest">Newest Release</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Movie Grid */}
            {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredMovies.map((movie) => (
                        <Link
                            key={movie.movie_id}
                            to={`/movies/${movie.movie_id}`}
                            className="bg-white rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl border border-[var(--color-dark-300)] group h-full flex flex-col"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                                <img
                                    src={movie.poster_url || "https://via.placeholder.com/300x450"} // Use poster_url
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 badge bg-white/90 backdrop-blur text-xs font-bold flex items-center gap-1 shadow-sm text-[var(--color-light)]">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {movie.rating}
                                </div>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                    <span className="btn btn-primary rounded-full px-6 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                                        <Ticket className="w-4 h-4" /> Book Now
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg mb-1 line-clamp-1 text-[var(--color-light)] group-hover:text-[var(--color-primary)] transition-colors">{movie.title}</h3>
                                <div className="flex justify-between items-center text-sm text-[var(--color-light-400)] mt-auto">
                                    <span>{movie.genres && movie.genres.length > 0 ? movie.genres[0].genre : 'Movie'}</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{Math.floor(movie.duration_mins / 60)}h {movie.duration_mins % 60}m</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-[var(--color-light-400)]">
                    <Search className="w-16 h-16 mb-4 opacity-10" />
                    <p className="text-xl font-medium">No movies found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                    <button
                        onClick={() => { setSearchQuery(''); setActiveGenre('All'); setSelectedLanguage('All'); }}
                        className="mt-4 text-[var(--color-primary)] hover:underline font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoviesPage;
