import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../data/movies';
import { getShowsByMovieId, getAvailableDates, formatShowTime, formatPrice } from '../data/shows';
import { Star, Clock, Calendar, MapPin, Play, User, ArrowLeft, Info, Video } from 'lucide-react';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const movie = getMovieById(id);
    const [selectedDate, setSelectedDate] = useState('');

    // Derived state for shows
    const { uniqueDates, showsByCinema, sortedCinemas } = useMemo(() => {
        if (!movie) return { uniqueDates: [], showsByCinema: {}, sortedCinemas: [] };

        const dates = getAvailableDates(movie.id);

        // Default to first date if not selected
        const currentSelectedDate = selectedDate || dates[0];
        if (!selectedDate && dates.length > 0) setSelectedDate(dates[0]);

        const allShows = getShowsByMovieId(movie.id);
        const filteredShows = allShows.filter(s => s.date === currentSelectedDate);

        // Group by cinema
        const grouped = {};
        filteredShows.forEach(show => {
            if (!grouped[show.cinemaName]) grouped[show.cinemaName] = [];
            grouped[show.cinemaName].push(show);
        });

        // Sort cinemas
        const cinemas = Object.keys(grouped).sort();

        return {
            uniqueDates: dates,
            showsByCinema: grouped,
            sortedCinemas: cinemas
        };
    }, [movie, selectedDate]);

    if (!movie) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
                <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${movie.backdropUrl})` }}
                >
                    <div className="absolute inset-0 bg-[var(--color-dark)]/80 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-16 items-center">
                        {/* Poster */}
                        <div className="hidden md:block rounded-xl overflow-hidden shadow-2xl shadow-black/50 aspect-[2/3] transform hover:scale-105 transition-transform duration-500">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left">
                            <Link to="/movies" className="inline-flex items-center gap-2 text-[var(--color-light-400)] hover:text-white mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Movies
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base mb-6 text-[var(--color-light-300)]">
                                <span className="border border-[var(--color-light-400)]/30 rounded px-2 py-0.5">{movie.genres.join(', ')}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m</span>
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(movie.releaseDate).getFullYear()}</span>
                                <span className="flex items-center gap-1 text-[var(--color-accent)] font-bold"><Star className="w-4 h-4 fill-current" /> {movie.rating}/10</span>
                            </div>

                            <p className="text-lg text-[var(--color-light-300)] mb-8 max-w-2xl leading-relaxed">
                                {movie.description}
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="btn btn-primary px-8 py-3 text-lg glow-effect flex items-center justify-center gap-2"
                                >
                                    <TicketWrapper /> Book Tickets
                                </button>
                                <button className="btn btn-secondary px-8 py-3 text-lg flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5 fill-current" /> Watch Trailer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                {/* Main Content */}
                <div>
                    {/* Cast Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <User className="text-[var(--color-primary)]" /> Top Cast
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {movie.cast && movie.cast.map((actor, idx) => (
                                <div key={idx} className="bg-[var(--color-dark-200)] p-4 rounded-xl text-center hover:bg-[var(--color-dark-100)] transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-dark)] mx-auto mb-3 flex items-center justify-center overflow-hidden">
                                        <User className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <p className="font-semibold text-white">{actor}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Booking Section */}
                    <div id="booking-section" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Video className="text-[var(--color-primary)]" /> Showtimes
                        </h2>

                        {/* Date Selector */}
                        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                            {uniqueDates.map(date => {
                                const d = new Date(date);
                                const isSelected = selectedDate === date;
                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] rounded-2xl border transition-all ${isSelected
                                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25 scale-105'
                                                : 'bg-[var(--color-dark-200)] border-white/10 text-[var(--color-light-400)] hover:border-[var(--color-primary)] hover:text-white'
                                            }`}
                                    >
                                        <span className="text-xs uppercase font-bold">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-2xl font-bold">{d.getDate()}</span>
                                        <span className="text-xs">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Shows List */}
                        <div className="space-y-6">
                            {sortedCinemas.length > 0 ? sortedCinemas.map(cinemaName => (
                                <div key={cinemaName} className="bg-[var(--color-dark-200)] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white/90">
                                        <MapPin className="text-[var(--color-accent)] w-5 h-5" />
                                        {cinemaName}
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {showsByCinema[cinemaName].map(show => (
                                            <Link
                                                key={show.id}
                                                to={`/shows/${show.id}/seats`}
                                                className="group relative flex flex-col items-center justify-center p-3 rounded-lg border border-[var(--color-light-400)]/30 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all min-w-[100px]"
                                            >
                                                <span className="text-lg font-bold text-white group-hover:text-[var(--color-primary)]">
                                                    {formatShowTime(show.time)}
                                                </span>
                                                <span className="text-xs text-[var(--color-light-400)] uppercase tracking-wider mb-1">
                                                    {show.screenName}
                                                </span>
                                                <span className="text-xs bg-black/20 px-2 py-0.5 rounded text-[var(--color-accent)]">
                                                    {formatPrice(show.priceLkr)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 bg-[var(--color-dark-200)]/50 rounded-xl">
                                    <Info className="w-12 h-12 mx-auto text-[var(--color-light-400)] mb-4" />
                                    <p className="text-[var(--color-light-300)]">No shows available for the selected date.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Details (Genre, Language etc) - Optional extra info */}
                <div className="space-y-6">
                    <div className="bg-[var(--color-dark-200)] p-6 rounded-xl border border-white/5">
                        <h3 className="font-bold mb-4 text-lg">Details</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block text-[var(--color-light-400)] mb-1">Original Language</span>
                                <span className="font-medium">{movie.language}</span>
                            </div>
                            <div>
                                <span className="block text-[var(--color-light-400)] mb-1">Status</span>
                                <span className="font-medium text-[var(--color-accent)]">Now Showing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper simple icon component for Ticket since it was used in map
const TicketWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
);

export default MovieDetailsPage;
