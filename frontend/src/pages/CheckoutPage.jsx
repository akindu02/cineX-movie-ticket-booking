import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Get booking data from navigation state or use defaults
    const bookingData = location.state || {
        show: {
            movieTitle: "Dune: Part Three",
            time: "7:15 PM",
            date: "February 4, 2026",
            screen: "IMAX",
            price: 500,
        },
        selectedSeats: ['D5', 'D6'],
        totalAmount: 1000,
    };

    const { show, selectedSeats, totalAmount } = bookingData;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            navigate('/my-bookings', {
                state: {
                    newBooking: {
                        id: Date.now(),
                        ...show,
                        selectedSeats,
                        totalAmount,
                        bookingTime: new Date().toISOString(),
                    }
                }
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <Link to={-1} className="text-[var(--color-primary)] hover:underline mb-2 inline-block">
                        ← Back to seat selection
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2 space-y-6 animate-slide-up">
                        {/* Payment Methods */}
                        <div className="bg-glass rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {[
                                    { id: 'card', label: 'Card', icon: '💳' },
                                    { id: 'upi', label: 'UPI', icon: '📱' },
                                    { id: 'wallet', label: 'Wallet', icon: '👛' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                                : 'border-[var(--color-dark-300)] hover:border-[var(--color-dark-200)]'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{method.icon}</div>
                                        <div className="font-medium">{method.label}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Card Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-light-400)] mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="input"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-[var(--color-light-400)] mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[var(--color-light-400)] mb-2">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="input"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-light-400)] mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="input"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* UPI Form */}
                            {paymentMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm text-[var(--color-light-400)] mb-2">UPI ID</label>
                                    <input
                                        type="text"
                                        placeholder="yourname@upi"
                                        className="input"
                                    />
                                </div>
                            )}

                            {/* Wallet Form */}
                            {paymentMethod === 'wallet' && (
                                <div className="space-y-3">
                                    {['Paytm', 'PhonePe', 'Amazon Pay'].map((wallet) => (
                                        <button
                                            key={wallet}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-[var(--color-dark-200)] hover:bg-[var(--color-dark-300)] transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-[var(--color-dark-400)] rounded-lg flex items-center justify-center">
                                                💰
                                            </div>
                                            <span className="font-medium">{wallet}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-glass rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[var(--color-light-400)] mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--color-light-400)] mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="input"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-[var(--color-light-400)] mt-3">
                                Tickets will be sent to your email and phone
                            </p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-glass rounded-2xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <h3 className="font-semibold text-lg">{show.movieTitle}</h3>
                                    <p className="text-[var(--color-light-400)] text-sm">{show.date} • {show.time}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="badge badge-accent">{show.screen}</span>
                                </div>

                                <hr className="border-[var(--color-dark-300)]" />

                                <div className="flex justify-between">
                                    <span className="text-[var(--color-light-400)]">Seats</span>
                                    <span className="font-medium">{selectedSeats?.join(', ')}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-[var(--color-light-400)]">Tickets</span>
                                    <span>{selectedSeats?.length} × ₹{show.price}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-[var(--color-light-400)]">Convenience Fee</span>
                                    <span>₹49</span>
                                </div>

                                <hr className="border-[var(--color-dark-300)]" />

                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-[var(--color-primary)]">₹{totalAmount + 49}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`btn btn-primary w-full text-lg ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing...
                                    </span>
                                ) : (
                                    `Pay ₹${totalAmount + 49}`
                                )}
                            </button>

                            <p className="text-xs text-center text-[var(--color-light-400)] mt-4">
                                🔒 Your payment is secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
