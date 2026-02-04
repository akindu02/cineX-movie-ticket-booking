import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { formatPrice, getShowById, formatShowTime } from '../data/shows';
import { getMovieById } from '../data/movies';
import { CreditCard, Wallet, Mail, Phone, Lock, Calendar, Clock, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showId, selectedSeats, totalPrice } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    // If no state, redirect back to movies (prevent direct access)
    // We do this check early, but we also need hooks to be valid, so conditional return is fine here 
    // as long as hooks above didn't depend on state conditionally (they didn't).

    // However, to be safe with hooks (though useLocation is already called), let's keep it here.
    if (!location.state) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h2 className="text-2xl font-bold">No booking in progress</h2>
                <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
            </div>
        );
    }

    const show = getShowById(showId);
    const movie = show ? getMovieById(show.movieId) : null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.phone) {
            toast.error("Please fill in your contact details");
            return;
        }

        if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cvc)) {
            toast.error("Please fill in your card details");
            return;
        }

        // Simulate API call
        const processPromise = new Promise((resolve) => setTimeout(resolve, 2000));

        toast.promise(processPromise, {
            loading: 'Processing payment...',
            success: 'Booking confirmed!',
            error: 'Payment failed'
        }).then(() => {
            // Navigate to success/bookings page
            navigate('/my-bookings', {
                state: {
                    newBooking: {
                        id: 'BK' + Math.floor(Math.random() * 100000),
                        showId,
                        seats: selectedSeats,
                        totalPrice,
                        date: new Date().toISOString(),
                        status: 'confirmed'
                    }
                }
            });
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
            <Link to={`/shows/${showId}/seats`} className="inline-flex items-center gap-2 text-[var(--color-light-400)] hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Seat Selection
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                {/* Left Column: Form */}
                <div>
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    {/* Contact Info */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-[var(--color-primary)] w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Contact Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm text-[var(--color-light-400)] mb-2 font-medium group-focus-within:text-[var(--color-primary)] transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-light-400)] w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--color-dark-200)] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm text-[var(--color-light-400)] mb-2 font-medium group-focus-within:text-[var(--color-primary)] transition-colors">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-light-400)] w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--color-dark-200)] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                        placeholder="+94 77 123 4567"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-[var(--color-primary)] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h2>

                        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all min-w-[160px] ${paymentMethod === 'card'
                                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                                        : 'bg-[var(--color-dark-200)] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span className="font-semibold">Card</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('wallet')}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all min-w-[160px] ${paymentMethod === 'wallet'
                                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                                        : 'bg-[var(--color-dark-200)] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <Wallet className="w-5 h-5" />
                                <span className="font-semibold">Wallet</span>
                            </button>
                        </div>

                        {/* Card Form */}
                        {paymentMethod === 'card' && (
                            <div className="bg-[var(--color-dark-200)]/50 p-6 rounded-2xl border border-white/5 animate-fade-in">
                                <div className="mb-6">
                                    <label className="block text-sm text-[var(--color-light-400)] mb-2">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-light-400)] w-5 h-5" />
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--color-dark)] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)]"
                                            placeholder="0000 0000 0000 0000"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                            {/* Card logos */}
                                            <div className="w-8 h-5 bg-white/10 rounded"></div>
                                            <div className="w-8 h-5 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-[var(--color-light-400)] mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={formData.expiry}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--color-dark)] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--color-primary)]"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-light-400)] mb-2">CVC</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-light-400)] w-4 h-4" />
                                            <input
                                                type="text"
                                                name="cvc"
                                                value={formData.cvc}
                                                onChange={handleInputChange}
                                                className="w-full bg-[var(--color-dark)] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary)]"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-8 btn btn-primary py-4 text-lg font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" /> Confirm Payment • {formatPrice(totalPrice)}
                    </button>
                    <p className="text-center text-xs text-[var(--color-light-400)] mt-4 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Payments are secure and encrypted
                    </p>
                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-[var(--color-dark-200)] rounded-3xl p-8 border border-white/5 h-fit sticky top-24">
                    <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                    <div className="flex gap-4 mb-6">
                        <img src={movie?.posterUrl} alt={movie?.title} className="w-20 h-28 object-cover rounded-lg shadow-md" />
                        <div>
                            <h4 className="font-bold text-lg leading-tight mb-2">{movie?.title}</h4>
                            <p className="text-sm text-[var(--color-light-400)] mb-1">{movie?.genres[0]}</p>
                            <div className="flex items-center gap-2 text-xs text-[var(--color-light-300)] bg-white/5 px-2 py-1 rounded w-fit">
                                <span className="border border-[var(--color-light-400)]/30 px-1 rounded">UA</span>
                                <span>{Math.floor(movie?.durationMins / 60)}h {movie?.durationMins % 60}m</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
                        <div className="flex items-start gap-3 text-sm">
                            <MapPin className="w-5 h-5 text-[var(--color-light-400)] shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-white">{show?.cinemaName}</p>
                                <p className="text-[var(--color-light-400)] text-xs">{show?.screenName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-5 h-5 text-[var(--color-light-400)] shrink-0" />
                            <p className="text-[var(--color-light-300)]">{new Date(show?.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-5 h-5 text-[var(--color-light-400)] shrink-0" />
                            <p className="text-[var(--color-light-300)]">{formatShowTime(show?.time)}</p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between text-[var(--color-light-300)]">
                            <span>Ticket Price ({selectedSeats.length}x)</span>
                            <span>{formatPrice(totalPrice - (selectedSeats.length * 150))}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-light-300)]">
                            <span>Booking Fee</span>
                            <span>{formatPrice(selectedSeats.length * 150)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-accent)]">
                            <span>Discount</span>
                            <span>- LKR 0.00</span>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-2xl text-[var(--color-primary)]">{formatPrice(totalPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
