import { useParams, Link } from 'react-router-dom';

const MovieDetailsPage = () => {
    const { id } = useParams();

    // Dummy movie data
    const movie = {
        id: parseInt(id),
        title: "Dune: Part Three",
        poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=800&h=1200&fit=crop",
        backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
        rating: 8.9,
        genre: ["Sci-Fi", "Adventure", "Drama"],
        duration: "2h 45m",
        releaseDate: "February 15, 2026",
        director: "Denis Villeneuve",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
        synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future that only he can foresee.",
        shows: [
            { id: 1, time: "10:30 AM", screen: "IMAX", price: 450, availableSeats: 45 },
            { id: 2, time: "1:45 PM", screen: "Dolby Atmos", price: 350, availableSeats: 32 },
            { id: 3, time: "4:30 PM", screen: "Premium", price: 300, availableSeats: 58 },
            { id: 4, time: "7:15 PM", screen: "IMAX", price: 500, availableSeats: 12 },
            { id: 5, time: "10:00 PM", screen: "Standard", price: 250, availableSeats: 76 },
        ],
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Backdrop */}
            <section className="relative h-[70vh] flex items-end">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${movie.backdrop})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/70 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-end md:items-end">
                        {/* Poster */}
                        <div className="hidden md:block w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl transform -translate-y-16">
                            <img src={movie.poster} alt={movie.title} className="w-full h-auto" />
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1 animate-slide-up">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genre.map((g, i) => (
                                    <span key={i} className="badge badge-primary">{g}</span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-[var(--color-light-300)] mb-6">
                                <span className="flex items-center gap-1">
                                    <span className="text-[var(--color-accent)]">⭐</span> {movie.rating}/10
                                </span>
                                <span>⏱️ {movie.duration}</span>
                                <span>📅 {movie.releaseDate}</span>
                            </div>
                            <p className="text-lg text-[var(--color-light-300)] max-w-2xl line-clamp-3 md:line-clamp-none">
                                {movie.synopsis}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Movie Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Cast & Crew */}
                            <div className="bg-glass rounded-2xl p-6">
                                <h2 className="text-2xl font-semibold mb-6">Cast & Crew</h2>

                                <div className="mb-6">
                                    <h3 className="text-[var(--color-light-400)] mb-2">Director</h3>
                                    <p className="text-lg font-medium">{movie.director}</p>
                                </div>

                                <div>
                                    <h3 className="text-[var(--color-light-400)] mb-3">Cast</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {movie.cast.map((actor, i) => (
                                            <span key={i} className="bg-[var(--color-dark-200)] px-4 py-2 rounded-lg">
                                                {actor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Trailer Placeholder */}
                            <div className="bg-glass rounded-2xl p-6">
                                <h2 className="text-2xl font-semibold mb-6">Watch Trailer</h2>
                                <div className="aspect-video bg-[var(--color-dark-200)] rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform glow-effect">
                                            <span className="text-3xl ml-1">▶</span>
                                        </div>
                                        <p className="text-[var(--color-light-400)]">Click to play trailer</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Show Times */}
                        <div className="lg:col-span-1">
                            <div className="bg-glass rounded-2xl p-6 sticky top-24">
                                <h2 className="text-2xl font-semibold mb-6">Select Showtime</h2>

                                <div className="mb-6">
                                    <p className="text-[var(--color-light-400)] mb-2">Today</p>
                                    <p className="font-medium">February 4, 2026</p>
                                </div>

                                <div className="space-y-3">
                                    {movie.shows.map((show) => (
                                        <Link
                                            key={show.id}
                                            to={`/shows/${show.id}/seats`}
                                            className="block bg-[var(--color-dark-200)] hover:bg-[var(--color-dark-300)] rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xl font-semibold">{show.time}</span>
                                                <span className="badge badge-accent">{show.screen}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[var(--color-light-400)]">
                                                    {show.availableSeats} seats left
                                                </span>
                                                <span className="text-[var(--color-primary)] font-semibold">
                                                    ₹{show.price}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MovieDetailsPage;
