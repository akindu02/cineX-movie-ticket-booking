import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const SeatSelectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Dummy show data
    const show = {
        id: parseInt(id),
        movieTitle: "Dune: Part Three",
        time: "7:15 PM",
        date: "February 4, 2026",
        screen: "IMAX",
        price: 500,
    };

    // Seat layout - row letters and seat numbers
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    // Dummy booked seats
    const bookedSeats = ['A3', 'A4', 'B7', 'B8', 'C5', 'D10', 'E2', 'E3', 'F6', 'F7', 'G1', 'H9', 'H10', 'H11'];

    const getSeatClass = (seatId) => {
        if (bookedSeats.includes(seatId)) {
            return 'bg-[var(--color-dark-400)] cursor-not-allowed opacity-50';
        }
        if (selectedSeats.includes(seatId)) {
            return 'bg-[var(--color-primary)] glow-effect scale-95';
        }
        return 'bg-[var(--color-dark-200)] hover:bg-[var(--color-primary)]/50 cursor-pointer';
    };

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const totalAmount = selectedSeats.length * show.price;

    const handleProceedToCheckout = () => {
        if (selectedSeats.length > 0) {
            navigate('/checkout', {
                state: {
                    show,
                    selectedSeats,
                    totalAmount
                }
            });
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <Link to={`/movies/1`} className="text-[var(--color-primary)] hover:underline mb-2 inline-block">
                        ← Back to movie
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{show.movieTitle}</h1>
                    <div className="flex justify-center gap-4 text-[var(--color-light-300)]">
                        <span>{show.date}</span>
                        <span>•</span>
                        <span>{show.time}</span>
                        <span>•</span>
                        <span className="badge badge-accent">{show.screen}</span>
                    </div>
                </div>

                {/* Screen */}
                <div className="mb-12 animate-slide-up">
                    <div className="relative">
                        <div className="h-2 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent rounded-full mb-2"></div>
                        <div className="h-12 bg-gradient-to-b from-[var(--color-primary)]/20 to-transparent rounded-t-[100%] flex items-start justify-center pt-2">
                            <span className="text-sm text-[var(--color-light-400)] uppercase tracking-widest">Screen</span>
                        </div>
                    </div>
                </div>

                {/* Seat Map */}
                <div className="mb-12 overflow-x-auto animate-scale-in">
                    <div className="min-w-fit mx-auto">
                        {rows.map((row) => (
                            <div key={row} className="flex items-center justify-center gap-2 mb-2">
                                <span className="w-6 text-center text-[var(--color-light-400)] font-medium">{row}</span>
                                <div className="flex gap-2">
                                    {Array.from({ length: seatsPerRow }, (_, i) => {
                                        const seatNumber = i + 1;
                                        const seatId = `${row}${seatNumber}`;
                                        return (
                                            <button
                                                key={seatId}
                                                onClick={() => handleSeatClick(seatId)}
                                                disabled={bookedSeats.includes(seatId)}
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-t-lg text-xs font-medium transition-all duration-200 ${getSeatClass(seatId)}`}
                                                title={seatId}
                                            >
                                                {seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="w-6 text-center text-[var(--color-light-400)] font-medium">{row}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mb-12">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[var(--color-dark-200)] rounded-t-md"></div>
                        <span className="text-sm text-[var(--color-light-400)]">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[var(--color-primary)] rounded-t-md glow-effect"></div>
                        <span className="text-sm text-[var(--color-light-400)]">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[var(--color-dark-400)] rounded-t-md opacity-50"></div>
                        <span className="text-sm text-[var(--color-light-400)]">Booked</span>
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-glass rounded-2xl p-6 max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

                    {selectedSeats.length > 0 ? (
                        <>
                            <div className="flex justify-between mb-3">
                                <span className="text-[var(--color-light-400)]">Selected Seats</span>
                                <span className="font-medium">{selectedSeats.sort().join(', ')}</span>
                            </div>
                            <div className="flex justify-between mb-3">
                                <span className="text-[var(--color-light-400)]">Price per seat</span>
                                <span>₹{show.price}</span>
                            </div>
                            <div className="flex justify-between mb-3">
                                <span className="text-[var(--color-light-400)]">Number of seats</span>
                                <span>{selectedSeats.length}</span>
                            </div>
                            <hr className="border-[var(--color-dark-300)] my-4" />
                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-[var(--color-primary)]">₹{totalAmount}</span>
                            </div>
                            <button
                                onClick={handleProceedToCheckout}
                                className="btn btn-primary w-full text-lg"
                            >
                                Proceed to Checkout
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-4xl mb-3">💺</div>
                            <p className="text-[var(--color-light-400)]">Select seats to continue</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
