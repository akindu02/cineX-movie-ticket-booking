import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Download, Home, Calendar, Clock, Check, Film, Ticket, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    // If no booking data was passed (e.g., direct URL visit), redirect home
    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <Ticket className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">No booking found</h2>
                    <p className="text-gray-500 mb-6">It looks like you haven't completed a booking yet.</p>
                    <Link to="/" className="btn btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // Extract data from booking state (passed from CheckoutPage)
    const { id, seats, totalPrice, movie, show, date } = booking;

    // Build display-friendly values with safe fallbacks
    const movieTitle = movie?.title || 'Movie';
    const moviePoster = movie?.poster_url || null;
    const movieGenres = movie?.genres?.map(g => typeof g === 'string' ? g : g.genre).join(', ') || '';
    const movieRating = movie?.rating || '';

    const cinemaName = show?.cinema?.name || 'Cinema';
    const cinemaLocation = show?.cinema?.location || '';
    const screenName = show?.screen_name || '';
    const screenType = show?.screen_type || '2D';

    // Format the show date and time
    const showDate = show?.start_time
        ? new Date(show.start_time).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
        : new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    const showTime = show?.start_time
        ? new Date(show.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '';

    // Generate a unique QR code URL using the booking ID
    const qrData = encodeURIComponent(`CineX-Ticket-${id}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

    const handleDownload = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Generating PDF Ticket...',
            success: 'Ticket Downloaded Successfully!',
            error: 'Failed to download'
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `CineX Ticket - ${movieTitle}`,
                text: `🎬 ${movieTitle} at ${cinemaName}\n📅 ${showDate} at ${showTime}\n💺 Seats: ${seats.join(', ')}`,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(`🎬 ${movieTitle} at ${cinemaName} | ${showDate} ${showTime} | Seats: ${seats.join(', ')} | Booking: ${id}`);
            toast.success('Booking details copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 flex flex-col items-center justify-center">

            <div className="w-full max-w-5xl">
                {/* Success Banner */}
                <div className="flex items-center justify-center gap-2 mb-8 text-green-600 font-bold bg-green-50 py-3 px-6 rounded-full w-fit mx-auto border border-green-100 shadow-sm animate-fade-in-up">
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span>Payment Successful! An E-Ticket has been sent to {booking.contact_email || 'your email'}.</span>
                </div>

                {/* Landscape Ticket */}
                <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative border border-gray-100 min-h-[400px]">

                    {/* Left Side: Movie & Details */}
                    <div className="flex-1 p-8 md:p-10 relative">
                        <div className="flex flex-col md:flex-row gap-8 h-full">
                            {/* Poster */}
                            <div className="shrink-0 mx-auto md:mx-0">
                                {moviePoster ? (
                                    <img
                                        src={moviePoster}
                                        alt={movieTitle}
                                        className="w-48 aspect-[2/3] object-cover rounded-2xl shadow-lg"
                                    />
                                ) : (
                                    <div className="w-48 aspect-[2/3] bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white">
                                        <Film className="w-16 h-16 mb-3 opacity-80" />
                                        <p className="text-sm font-bold opacity-90 text-center px-4">{movieTitle}</p>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <h2 className="text-3xl font-black text-[var(--color-light)] leading-none mb-2">{movieTitle}</h2>
                                    <p className="text-gray-500 font-medium mb-6">
                                        {[movieGenres, movieRating].filter(Boolean).join(' • ')}
                                    </p>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cinema</p>
                                            <p className="font-bold text-[var(--color-light)]">{cinemaName}</p>
                                            <p className="text-xs text-gray-500">
                                                {[screenName, screenType].filter(Boolean).join(' • ')}
                                                {cinemaLocation && (
                                                    <span className="flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> {cinemaLocation}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seats</p>
                                            <p className="font-black text-2xl text-[var(--color-primary)]">{seats.join(', ')}</p>
                                            <p className="text-xs text-gray-500">{seats.length} {seats.length === 1 ? 'Ticket' : 'Tickets'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                                <span>{showDate}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                                                <span>{showTime || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-400">Total Paid</span>
                                    <span className="text-2xl font-black text-[var(--color-light)]">LKR {totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cutout Circles (Visual Ticket Effect) */}
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full z-10 hidden md:block"></div>
                    </div>

                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-px bg-gray-200 border-l border-dashed border-gray-300 my-4 relative"></div>

                    {/* Right Side: QR & Actions */}
                    <div className="md:w-[320px] bg-gray-50/50 p-8 flex flex-col items-center justify-between border-l border-dashed border-gray-200 relative">

                        {/* Cutout Connectors */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full z-10 hidden md:block"></div>

                        <div className="w-full text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Scan at entrance</p>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block mb-2">
                                <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
                            </div>
                            <p className="font-mono font-bold text-sm text-[var(--color-light)]">ID: {id}</p>
                        </div>

                        <div className="w-full space-y-3 mt-6">
                            <button
                                onClick={handleDownload}
                                className="w-full btn btn-primary py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" /> Download PDF
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-full btn bg-white border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Ticket className="w-5 h-5" /> Share Ticket
                            </button>

                            <Link
                                to="/"
                                className="w-full btn bg-white border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" /> Back to Home
                            </Link>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default BookingSuccessPage;
