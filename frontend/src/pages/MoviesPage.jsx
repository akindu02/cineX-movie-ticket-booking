import { useState } from 'react';
import { Link } from 'react-router-dom';

const MoviesPage = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const genres = ['all', 'action', 'comedy', 'drama', 'horror', 'sci-fi', 'thriller'];

    const movies = [
        {
            id: 1,
            title: "Dune: Part Three",
            poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
            rating: 8.9,
            genre: "sci-fi",
            duration: "2h 45m",
            releaseDate: "2026",
        },
        {
            id: 2,
            title: "The Dark Knight Returns",
            poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
            rating: 9.1,
            genre: "action",
            duration: "2h 35m",
            releaseDate: "2026",
        },
        {
            id: 3,
            title: "Inception 2",
            poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
            rating: 8.7,
            genre: "thriller",
            duration: "2h 28m",
            releaseDate: "2026",
        },
        {
            id: 4,
            title: "Avatar: The Final Chapter",
            poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
            rating: 8.5,
            genre: "sci-fi",
            duration: "3h 10m",
            releaseDate: "2026",
        },
        {
            id: 5,
            title: "The Haunting Hour",
            poster: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=600&fit=crop",
            rating: 7.8,
            genre: "horror",
            duration: "1h 55m",
            releaseDate: "2026",
        },
        {
            id: 6,
            title: "Love in Paris",
            poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
            rating: 7.2,
            genre: "drama",
            duration: "2h 05m",
            releaseDate: "2026",
        },
        {
            id: 7,
            title: "Laugh Out Loud 3",
            poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
            rating: 6.9,
            genre: "comedy",
            duration: "1h 45m",
            releaseDate: "2026",
        },
        {
            id: 8,
            title: "Mission: Final Stand",
            poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
            rating: 8.3,
            genre: "action",
            duration: "2h 20m",
            releaseDate: "2026",
        },
    ];

    const filteredMovies = movies.filter(movie => {
        const matchesFilter = activeFilter === 'all' || movie.genre === activeFilter;
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Movies</span> Now Showing
                    </h1>
                    <p className="text-[var(--color-light-400)] text-lg">
                        Discover and book tickets for the latest blockbusters
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-10 space-y-6 animate-slide-up">
                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-12"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-light-400)]">
                            🔍
                        </span>
                    </div>

                    {/* Genre Filters */}
                    <div className="flex flex-wrap gap-3">
                        {genres.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => setActiveFilter(genre)}
                                className={`px-5 py-2.5 rounded-full font-medium capitalize transition-all duration-300 ${activeFilter === genre
                                        ? 'bg-[var(--color-primary)] text-white glow-effect'
                                        : 'bg-[var(--color-dark-200)] text-[var(--color-light-300)] hover:bg-[var(--color-dark-300)]'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredMovies.map((movie, index) => (
                        <Link
                            key={movie.id}
                            to={`/movies/${movie.id}`}
                            className="card group animate-scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="relative overflow-hidden aspect-[2/3]">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent"></div>

                                {/* Rating Badge */}
                                <div className="absolute top-3 right-3 badge badge-accent">
                                    ⭐ {movie.rating}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="btn btn-primary">Book Now</span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                                <div className="flex items-center justify-between text-sm text-[var(--color-light-400)]">
                                    <span className="badge badge-primary capitalize">{movie.genre}</span>
                                    <span>⏱️ {movie.duration}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredMovies.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-2xl font-semibold mb-2">No movies found</h3>
                        <p className="text-[var(--color-light-400)]">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoviesPage;
