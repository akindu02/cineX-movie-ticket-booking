import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getShowById, formatShowTime, formatPrice } from '../data/shows';
import { getMovieById } from '../data/movies';
import { generateSeatMap, calculateTotalPrice, seatTypes } from '../data/seats';
import { ArrowLeft, Monitor, Armchair, Check } from 'lucide-react';
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
        <div className="min-h-screen bg-white pb-32 pt-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <Link to={`/movies/${movie.id}`} className="p-2 rounded-full hover:bg-gray-100 text-[var(--color-light)] transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-light)]">{movie.title}</h1>
                        <p className="text-[var(--color-light-400)] text-sm font-medium">
                            {show.cinemaName} • <span className="text-[var(--color-primary)]">{show.screenName}</span> • {new Date(show.date).toLocaleDateString()} • {formatShowTime(show.time)}
                        </p>
                    </div>
                </div>

                {/* Screen */}
                <div className="mb-16 relative perspective-1000">
                    <div className="w-3/4 mx-auto h-12 bg-gradient-to-b from-gray-200 to-white transform -rotate-x-45 rounded-t-[50%] mb-8 border-t-4 border-gray-300 shadow-xl opacity-80"></div>
                    <p className="text-center text-xs font-bold text-[var(--color-light-400)] tracking-[0.2em] flex items-center justify-center gap-2 uppercase">
                        <Monitor className="w-4 h-4" /> Screen Area
                    </p>
                </div>

                {/* Seat Map */}
                <div className="mb-12 overflow-x-auto pb-12">
                    <div className="min-w-[700px] flex flex-col gap-3 items-center">
                        {seatMap.rows.map((row) => (
                            <div key={row.rowLabel} className="flex gap-6 items-center">
                                <span className="w-6 text-center text-sm font-bold text-[var(--color-light-400)]">{row.rowLabel}</span>
                                <div className="flex gap-2 md:gap-3">
                                    {row.seats.map((seat) => {
                                        const isSelected = selectedSeats.includes(seat.id);
                                        const isSold = seat.status === 'sold';

                                        // Base Styles
                                        let seatStyle = 'bg-white border-2 border-gray-200 text-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer';

                                        // Status Styles
                                        if (isSelected) {
                                            seatStyle = 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-red-200 scale-110 z-10';
                                        } else if (isSold) {
                                            seatStyle = 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed';
                                        } else {
                                            // Available Styles (Type specific)
                                            if (seat.type === seatTypes.PREMIUM) seatStyle += ' border-purple-200 text-purple-200 hover:border-purple-500 hover:text-purple-500';
                                            if (seat.type === seatTypes.VIP) seatStyle += ' border-yellow-300 text-yellow-300 hover:border-yellow-500 hover:text-yellow-500';
                                        }

                                        return (
                                            <button
                                                key={seat.id}
                                                disabled={isSold}
                                                onClick={() => handleSeatClick(seat.id)}
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-t-xl rounded-b-md transition-all duration-200 flex items-center justify-center relative group ${seatStyle}`}
                                                title={`${seat.row}${seat.number} - ${seat.type} - ${formatPrice(show.priceLkr * seat.priceMultiplier)}`}
                                            >
                                                <Armchair className={`w-4 h-4 md:w-5 md:h-5 ${isSelected ? 'fill-current' : 'fill-current'}`} strokeWidth={2.5} />
                                                {/* Tooltip on Hover */}
                                                {!isSold && (
                                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                                                        {seat.row}{seat.number} • {formatPrice(show.priceLkr * seat.priceMultiplier)}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="w-6 text-center text-sm font-bold text-[var(--color-light-400)]">{row.rowLabel}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 text-sm font-medium text-[var(--color-light-300)] bg-gray-50 p-6 rounded-2xl border border-gray-100 mx-auto max-w-3xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-gray-200 bg-white flex items-center justify-center text-gray-300"><Armchair className="w-3.5 h-3.5 fill-current" /></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[var(--color-primary)] border-2 border-[var(--color-primary)] flex items-center justify-center text-white"><Armchair className="w-3.5 h-3.5 fill-current" /></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-100 border-2 border-gray-100 flex items-center justify-center text-gray-300"><Armchair className="w-3.5 h-3.5 fill-current" /></div>
                        <span>Sold</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-purple-300 bg-white flex items-center justify-center text-purple-300"><Armchair className="w-3.5 h-3.5 fill-current" /></div>
                        <span>Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-yellow-400 bg-white flex items-center justify-center text-yellow-400"><Armchair className="w-3.5 h-3.5 fill-current" /></div>
                        <span>VIP</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:p-6 z-40 shadow-[0_-5px_30px_rgba(0,0,0,0.08)]">
                <div className="max-w-[1200px] mx-auto flex justify-between items-center transition-all">
                    <div>
                        <p className="text-[var(--color-light-400)] text-xs font-bold uppercase tracking-wider mb-1">Total Amount</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[var(--color-light)]">{formatPrice(grandTotal)}</span>
                            {selectedSeats.length > 0 && <span className="text-sm font-medium text-[var(--color-primary)] bg-red-50 px-2 py-0.5 rounded-full">{selectedSeats.length} seats</span>}
                        </div>
                    </div>
                    <button
                        onClick={handleProceed}
                        disabled={selectedSeats.length === 0}
                        className="btn btn-primary px-8 md:px-12 py-3 md:py-4 rounded-xl text-lg font-bold shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        Proceed to Pay {selectedSeats.length > 0 && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple Chevron for button
import { ChevronRight } from 'lucide-react';

export default SeatSelectionPage;
