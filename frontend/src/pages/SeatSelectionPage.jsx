import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getShowById, formatShowTime, formatPrice } from '../data/shows';
import { getMovieById } from '../data/movies';
import { generateSeatMap, calculateTotalPrice, seatTypes } from '../data/seats';
import { ArrowLeft, Monitor, Info, Armchair } from 'lucide-react';
import toast from 'react-hot-toast';

const SeatSelectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Fetch data
    const show = getShowById(id);
    const movie = show ? getMovieById(show.movieId) : null;

    // Generate seat map (memoized)
    const seatMap = useMemo(() => {
        if (!show) return null;
        return generateSeatMap(show.screenName, show.id); // Use show.id as seed
    }, [show]);

    if (!show || !movie || !seatMap) return <div className="p-8 text-center">Loading...</div>;

    const handleSeatClick = (seatId) => {
        // Check if seat exists and is available
        let seat;
        seatMap.rows.forEach(row => {
            const found = row.seats.find(s => s.id === seatId);
            if (found) seat = found;
        });

        if (!seat || seat.status === 'sold' || seat.status === 'held') return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= 8) {
                toast.error("You can only select up to 8 seats");
                return;
            }
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const totalPrice = calculateTotalPrice(selectedSeats, show.priceLkr, seatMap);
    const bookingFee = selectedSeats.length * 150; // LKR 150 booking fee per seat
    const grandTotal = totalPrice + bookingFee;

    const handleProceed = () => {
        if (selectedSeats.length === 0) {
            toast.error("Please select at least one seat");
            return;
        }

        navigate('/checkout', {
            state: {
                showId: show.id,
                selectedSeats,
                totalPrice: grandTotal
            }
        });
    };

    return (
        <div className="min-h-screen pb-32 pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to={`/movies/${movie.id}`} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{movie.title}</h1>
                        <p className="text-[var(--color-light-400)] text-sm">
                            {show.cinemaName} • {show.screenName} • {new Date(show.date).toLocaleDateString()} • {formatShowTime(show.time)}
                        </p>
                    </div>
                </div>

                {/* Screen */}
                <div className="mb-12 relative perspective-1000">
                    <div className="w-3/4 mx-auto h-16 bg-gradient-to-b from-white/20 to-transparent transform -rotate-x-45 rounded-t-[50%] mb-4 border-t-2 border-white/30 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
                    <p className="text-center text-sm text-[var(--color-light-400)] flex items-center justify-center gap-2">
                        <Monitor className="w-4 h-4" /> SCREEN
                    </p>
                </div>

                {/* Seat Map */}
                <div className="mb-12 overflow-x-auto pb-8">
                    <div className="min-w-[700px] flex flex-col gap-3 items-center">
                        {seatMap.rows.map((row) => (
                            <div key={row.rowLabel} className="flex gap-4 items-center">
                                <span className="w-6 text-center text-sm font-bold text-[var(--color-light-400)]">{row.rowLabel}</span>
                                <div className="flex gap-1.5 md:gap-3">
                                    {row.seats.map((seat) => {
                                        const isSelected = selectedSeats.includes(seat.id);
                                        const isSold = seat.status === 'sold';
                                        const isHeld = seat.status === 'held';

                                        let seatColor = 'bg-[var(--color-dark-200)] border-white/20 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 cursor-pointer';
                                        if (isSelected) seatColor = 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[0_0_10px_var(--color-primary)]';
                                        if (isSold) seatColor = 'bg-gray-700/50 border-transparent opacity-50 cursor-not-allowed';
                                        if (isHeld) seatColor = 'bg-gray-700/50 border-transparent opacity-50 cursor-not-allowed';

                                        // Type Colors (override base if not selected/sold)
                                        if (!isSelected && !isSold && !isHeld) {
                                            if (seat.type === seatTypes.PREMIUM) seatColor += ' border-purple-500/50';
                                            if (seat.type === seatTypes.VIP) seatColor += ' border-yellow-500/50';
                                        }

                                        return (
                                            <button
                                                key={seat.id}
                                                disabled={isSold || isHeld}
                                                onClick={() => handleSeatClick(seat.id)}
                                                className={`w-7 h-7 md:w-9 md:h-9 rounded-t-lg rounded-b-md border transition-all flex items-center justify-center text-[10px] ${seatColor}`}
                                                title={`${seat.row}${seat.number} - ${seat.type.toUpperCase()} - ${formatPrice(show.priceLkr * seat.priceMultiplier)}`}
                                            >
                                                <Armchair className={`w-4 h-4 md:w-5 md:h-5 ${isSelected ? 'fill-white' : ''}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-[var(--color-light-300)] bg-[var(--color-dark-200)] p-4 rounded-xl border border-white/5 mx-auto max-w-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-white/20 bg-[var(--color-dark-200)] flex items-center justify-center"><Armchair className="w-3 h-3" /></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[var(--color-primary)] border border-[var(--color-primary)] flex items-center justify-center text-white"><Armchair className="w-3 h-3 fill-white" /></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-700/50 opacity-50 flex items-center justify-center"><Armchair className="w-3 h-3" /></div>
                        <span>Sold</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <div className="w-5 h-5 rounded border border-purple-500/50 bg-[var(--color-dark-200)] flex items-center justify-center"><Armchair className="w-3 h-3" /></div>
                        <span>Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-yellow-500/50 bg-[var(--color-dark-200)] flex items-center justify-center"><Armchair className="w-3 h-3" /></div>
                        <span>VIP</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-[var(--color-dark)] border-t border-white/10 p-4 md:p-6 z-40 transform transition-transform duration-300 translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-[var(--color-light-400)] text-sm mb-1">Total Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-bold text-white">{formatPrice(grandTotal)}</span>
                            <span className="text-xs text-[var(--color-light-400)]">({selectedSeats.length} seats)</span>
                        </div>
                    </div>
                    <button
                        onClick={handleProceed}
                        disabled={selectedSeats.length === 0}
                        className="btn btn-primary px-8 md:px-12 py-3 md:py-4 rounded-full text-lg font-bold shadow-lg shadow-[var(--color-primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                    >
                        Proceed to Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
