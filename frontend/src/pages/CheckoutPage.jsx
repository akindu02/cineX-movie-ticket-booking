import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { formatPrice, formatShowTime } from '../data/shows';
import { getShowById, getMovieById, createBooking } from '../services/api';
import { useUser } from '@clerk/clerk-react';
import { CreditCard, Mail, Phone, Lock, Calendar, Clock, MapPin, ArrowLeft, CheckCircle, Ticket, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const { showId, selectedSeats, totalPrice } = location.state || {};

    const [show, setShow] = useState(null);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    // Fetch show and movie data
    useEffect(() => {
        const fetchData = async () => {
            if (!showId) return;
            try {
                setLoading(true);
                const showData = await getShowById(showId);
                setShow(showData);

                if (showData.movie_id) {
                    const movieData = await getMovieById(showData.movie_id);
                    setMovie(movieData);
                }
            } catch (err) {
                console.error("Failed to fetch show/movie:", err);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showId]);

    // Pre-fill email from Clerk user
    useEffect(() => {
        if (isLoaded && user) {
            setFormData(prev => ({
                ...prev,
                email: user.primaryEmailAddress?.emailAddress || ''
            }));
        }
    }, [isLoaded, user]);

    if (!location.state) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">No booking in progress</h2>
                <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    const bookingFee = selectedSeats.length * 150;
    const ticketTotal = totalPrice - bookingFee;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Card validation: Strict 16 digits for card number
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 16);
        }

        // CVV validation: Strict 3 digits only
        if (name === 'cvc') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.phone) {
            toast.error("Please fill in your contact details");
            return;
        }

        if (paymentMethod === 'card') {
            const cleanCardNum = formData.cardNumber.replace(/\s/g, '');
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            const cvcRegex = /^\d{3}$/;

            if (!cleanCardNum || !formData.expiry || !formData.cvc) {
                toast.error("Please fill in all card details");
                return;
            }

            if (!/^\d{16}$/.test(cleanCardNum)) {
                toast.error("Invalid card number. Must be 16 digits.");
                return;
            }

            if (!expiryRegex.test(formData.expiry)) {
                toast.error("Invalid expiry date. Use MM/YY format.");
                return;
            }

            if (!cvcRegex.test(formData.cvc)) {
                toast.error("Invalid CVV. Must be 3 digits.");
                return;
            }
        }

        // Submit booking to API
        setSubmitting(true);

        const bookingPayload = {
            show_id: showId,
            user_id: user?.id || null,
            seat_numbers: selectedSeats,
            total_amount: totalPrice,
            contact_email: formData.email,
            contact_phone: formData.phone
        };

        try {
            const result = await createBooking(bookingPayload);

            toast.success('Booking confirmed!');

            navigate('/booking-success', {
                state: {
                    booking: {
                        id: `BK${result.booking_id}`,
                        showId,
                        seats: selectedSeats,
                        totalPrice,
                        date: new Date().toISOString(),
                        status: 'confirmed',
                        movie: movie,
                        show: show
                    }
                }
            });
        } catch (err) {
            console.error("Booking failed:", err);
            const errorMsg = err.response?.data?.detail || "Booking failed. Please try again.";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <Link to={`/shows/${showId}/seats`} className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] mb-8 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Seat Selection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
                    {/* Left Column: Form */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-[var(--color-light)] mb-8">Checkout</h1>

                        {/* Contact Info */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[var(--color-light)]">
                                <span className="bg-[var(--color-primary)] w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold shadow-lg shadow-red-200">1</span>
                                Contact Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-sm text-gray-500 mb-2 font-bold group-focus-within:text-[var(--color-primary)] transition-colors">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-sm text-gray-500 mb-2 font-bold group-focus-within:text-[var(--color-primary)] transition-colors">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[var(--color-light)]">
                                <span className="bg-[var(--color-primary)] w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold shadow-lg shadow-red-200">2</span>
                                Payment Method
                            </h2>

                            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all min-w-[160px] ${paymentMethod === 'card'
                                        ? 'bg-red-50 border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-bold">Card</span>
                                </button>
                            </div>

                            {/* Card Form */}
                            {paymentMethod === 'card' && (
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-fade-in space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2 font-bold">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                                                placeholder="0000 0000 0000 0000"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-50">
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2 font-bold">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={formData.expiry}
                                                onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2 font-bold">CVC</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    value={formData.cvc}
                                                    onChange={handleInputChange}
                                                    maxLength={3}
                                                    inputMode="numeric"
                                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full mt-8 btn btn-primary py-4 text-lg font-bold rounded-xl shadow-xl shadow-red-600/20 hover:scale-[1.01] hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" /> Confirm Payment • {formatPrice(totalPrice)}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1 font-medium">
                            <Lock className="w-3 h-3" /> Payments are secure and encrypted
                        </p>
                    </div>

                    {/* Right Column: Order Summary (White Theme) */}
                    <div>
                        <div className="sticky top-24">
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/40">
                                <h3 className="text-xl font-extrabold mb-6 text-[var(--color-light)]">Order Summary</h3>

                                {/* Movie Info */}
                                <div className="flex gap-4 mb-6 pb-6 border-b border-dashed border-gray-200">
                                    <img src={movie?.poster_url || "https://via.placeholder.com/80x112"} alt={movie?.title} className="w-20 h-28 object-cover rounded-xl shadow-sm" />
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-bold text-lg leading-tight mb-1 text-[var(--color-light)]">{movie?.title}</h4>
                                        <p className="text-sm text-gray-500 mb-2">{movie?.genres?.[0]?.genre || 'Movie'}</p>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <span className="px-1.5 py-0.5 border border-gray-200 rounded text-[10px]">UA</span>
                                            <span>{movie?.duration_mins ? `${Math.floor(movie.duration_mins / 60)}h ${movie.duration_mins % 60}m` : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--color-light)]">{show?.cinema?.name || 'Cinema'}</p>
                                            <p className="text-xs text-gray-500">{show?.screen_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-400">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {show?.start_time ? new Date(show.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {show?.start_time ? formatShowTime(show.start_time) : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                        <span>Ticket Price ({selectedSeats.length}x)</span>
                                        <span className="text-[var(--color-light)]">{formatPrice(ticketTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                        <span>Booking Fee</span>
                                        <span className="text-[var(--color-light)]">{formatPrice(bookingFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-yellow-500">
                                        <span>Discount</span>
                                        <span>- LKR 0.00</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-dashed border-gray-200">
                                    <span className="text-lg font-bold text-[var(--color-light)]">Total</span>
                                    <span className="text-2xl font-black text-red-600">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-3">
                                <Ticket className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-[var(--color-light)]">Cancellation Policy</p>
                                    <p className="text-xs text-gray-500 mt-1">Tickets are non-refundable. You can reschedule up to 2 hours before the show.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
