import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../data/movies';
import { getShowsByMovieId, getAvailableDates, formatShowTime, formatPrice } from '../data/shows';
import { Star, Clock, Calendar, MapPin, Play, ArrowLeft, Video, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';

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
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100/50">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-light)] flex items-center gap-2">
                                        <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
                                        Select Date
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">Choose the perfect time for your movie</p>
                                </div>
                                {/* Optional: Month Display or Navigation Arrows could go here */}
                            </div>

                            {/* Date Selector - Full Calendar */}
                            <div className="mb-8">
                                <CalendarView
                                    availableDates={uniqueDates}
                                    selectedDate={selectedDate}
                                    onSelectDate={setSelectedDate}
                                />
                            </div>

                            <div className="mt-8 mb-6 flex items-center gap-4">
                                <h3 className="text-lg font-bold text-[var(--color-light)]">Available Cinemas</h3>
                                <div className="h-px bg-gray-100 flex-grow"></div>
                            </div>

                            {/* Shows List - Clean Cards */}
                            <div className="space-y-6">
                                {sortedCinemas.length > 0 ? sortedCinemas.map(cinemaName => (
                                    <div key={cinemaName} className="group/cinema bg-gray-50/50 hover:bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                        <h3 className="text-base font-bold mb-4 flex items-center gap-3 text-[var(--color-light)]">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-primary)] border border-gray-100 group-hover/cinema:border-red-100 group-hover/cinema:scale-110 transition-all">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            {cinemaName}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 pl-2 sm:pl-13">
                                            {showsByCinema[cinemaName].map(show => (
                                                <Link
                                                    key={show.id}
                                                    to={`/shows/${show.id}/seats`}
                                                    className="relative overflow-hidden flex flex-col items-center justify-center px-6 py-3 rounded-xl bg-white border-2 border-transparent hover:border-[var(--color-primary)] shadow-sm hover:shadow-md transition-all min-w-[110px] group/time"
                                                >
                                                    <span className="text-lg font-bold text-[var(--color-light)] group-hover/time:text-[var(--color-primary)] transition-colors z-10">
                                                        {formatShowTime(show.time)}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider z-10 group-hover/time:text-red-400">
                                                        {show.screenName}
                                                    </span>

                                                    {/* Price Tag Badge */}
                                                    <div className="absolute top-0 right-0 bg-gray-100 text-[9px] font-bold text-gray-500 px-1.5 py-0.5 rounded-bl-lg group-hover/time:bg-[var(--color-primary)] group-hover/time:text-white transition-colors">
                                                        {formatPrice(show.priceLkr)}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-4">
                                            <Calendar className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium text-lg">No shows available for this date.</p>
                                        <button
                                            onClick={() => setSelectedDate(uniqueDates[0])}
                                            className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-[var(--color-primary)] font-bold text-sm hover:shadow-md transition-all"
                                        >
                                            View Next Available
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CalendarView = ({ availableDates, selectedDate, onSelectDate }) => {
    // Initialize with selected date or today
    const [currentMonth, setCurrentMonth] = useState(() => {
        return selectedDate ? new Date(selectedDate) : new Date();
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const days = [];
    // Empty cells for padding
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>);
    }

    // Date cells
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
        // Format to YYYY-MM-DD for comparison
        // Note: We need to handle timezone visual consistency. 
        // Simple way: create string from manual parts to avoid UTC shift
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(d).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const isAvailable = availableDates.includes(dateStr);
        const isSelected = selectedDate === dateStr;
        const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));

        days.push(
            <button
                key={dateStr}
                disabled={!isAvailable}
                onClick={() => isAvailable && onSelectDate(dateStr)}
                className={`
                    h-10 md:h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all relative
                    ${isSelected
                        ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-200'
                        : isAvailable
                            ? 'hover:bg-red-50 hover:text-[var(--color-primary)] text-gray-700 bg-gray-50'
                            : 'text-gray-300 cursor-not-allowed bg-transparent'
                    }
                `}
            >
                {d}
                {isAvailable && !isSelected && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-green-500"></div>
                )}
            </button>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-lg text-[var(--color-light)]">{monthName}</h3>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wide py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days}
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400 justify-end">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Available
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Unavailable
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
