import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../data/movies';
import { getShowsByMovieId, getAvailableDates, formatShowTime, formatPrice } from '../data/shows';
import { Star, Clock, Calendar, MapPin, Play, ArrowLeft, Video, Ticket } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-[var(--color-light)]">Movie not found</h2>
                <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-20 pt-24 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Breadcrumb / Back */}
                <Link to="/movies" className="inline-flex items-center gap-2 text-[var(--color-light-400)] hover:text-[var(--color-primary)] mb-8 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Movies
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: Movie Details (Sticky) */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            {/* Poster */}
                            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 bg-white p-1">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-auto aspect-[2/3] object-cover rounded-xl"
                                />
                            </div>

                            {/* Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-[var(--color-light)] mb-3 leading-tight">{movie.title}</h1>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--color-primary)]/20">
                                        {movie.genres[0]}
                                    </span>
                                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {movie.rating}
                                    </span>
                                    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                                        <Clock className="w-3 h-3" /> {Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m
                                    </span>
                                </div>

                                <p className="text-[var(--color-light-400)] leading-relaxed text-sm mb-6">
                                    {movie.description}
                                </p>

                                <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Director</span>
                                        <span className="font-medium text-[var(--color-light)]">{movie.director}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Language</span>
                                        <span className="font-medium text-[var(--color-light)]">{movie.language}</span>
                                    </div>
                                </div>

                                <button className="btn btn-secondary w-full mt-6 flex items-center justify-center gap-2">
                                    <Play className="w-4 h-4 fill-current" /> Watch Trailer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Booking Flow */}
                    <div className="lg:col-span-8 xl:col-span-9 bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-light)] mb-6">
                                <Ticket className="text-[var(--color-primary)]" /> Book Tickets
                            </h2>

                            {/* Date Selector */}
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Select Date</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                                {uniqueDates.map(date => {
                                    const d = new Date(date);
                                    const isSelected = selectedDate === date;
                                    return (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] rounded-2xl border transition-all duration-300 ${isSelected
                                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-red-200 transform -translate-y-1'
                                                : 'bg-white border-gray-200 text-[var(--color-light-400)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                                                }`}
                                        >
                                            <span className="text-xs uppercase font-bold tracking-wider opacity-90">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-2xl font-bold my-0.5">{d.getDate()}</span>
                                            <span className="text-xs font-medium opacity-90">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Available Showtimes</h3>

                        {/* Shows List */}
                        <div className="space-y-6">
                            {sortedCinemas.length > 0 ? sortedCinemas.map(cinemaName => (
                                <div key={cinemaName} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-light)] border-b border-gray-50 pb-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        {cinemaName}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {showsByCinema[cinemaName].map(show => (
                                            <Link
                                                key={show.id}
                                                to={`/shows/${show.id}/seats`}
                                                className="group relative flex flex-col items-center justify-center px-6 py-3 rounded-xl border border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all min-w-[120px]"
                                            >
                                                <span className="text-xl font-bold text-[var(--color-light)] group-hover:text-[var(--color-primary)]">
                                                    {formatShowTime(show.time)}
                                                </span>
                                                <span className="text-[10px] text-[var(--color-light-400)] uppercase tracking-wider mb-1 font-semibold">
                                                    {show.screenName}
                                                </span>
                                                <span className="absolute -top-2 -right-2 text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full shadow-sm">
                                                    {formatPrice(show.priceLkr)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-medium">No shows available for this date.</p>
                                    <button
                                        onClick={() => setSelectedDate(uniqueDates[0])}
                                        className="mt-4 text-[var(--color-primary)] font-bold text-sm hover:underline"
                                    >
                                        View available dates
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
