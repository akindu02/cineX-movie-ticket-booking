import { useLocation, Link } from 'react-router-dom';
import { Download, CheckCircle, Home, Calendar, Clock, MapPin, Share2 } from 'lucide-react';
import { formatShowTime } from '../data/shows';
import { getShowById } from '../data/shows';
import { getMovieById } from '../data/movies';
import toast from 'react-hot-toast';

const BookingSuccessPage = () => {
    const location = useLocation();
    const booking = location.state?.booking || {
        id: 'BK-TEST-123',
        seats: ['A1', 'A2', 'A3'],
        totalPrice: 2000,
        showId: 'show1',
        date: new Date().toISOString()
    };

    const show = getShowById(booking.showId);
    const movie = show ? getMovieById(show.movieId) : null;

    const handleDownload = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Generating PDF Ticket...',
            success: 'Ticket Downloaded Successfully!',
            error: 'Failed to download'
        });
    };

    if (!show || !movie) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">No booking found</h2>
                    <Link to="/" className="btn btn-primary">Go Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 flex flex-col items-center justify-center">

            <div className="w-full max-w-5xl">
                {/* Success Banner */}
                <div className="flex items-center justify-center gap-2 mb-8 text-green-600 font-bold bg-green-50 py-3 px-6 rounded-full w-fit mx-auto border border-green-100 shadow-sm animate-fade-in-up">
                    <CheckCircle className="w-5 h-5 fill-current" />
                    <span>Payment Successful! Your booking is confirmed.</span>
                </div>


                {/* Landscape Ticket */}
                <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative border border-gray-100 min-h-[400px]">

                    {/* Left Side: Movie & Details */}
                    <div className="flex-1 p-8 md:p-10 relative">
                        <div className="flex flex-col md:flex-row gap-8 h-full">
                            {/* Poster */}
                            <div className="shrink-0 mx-auto md:mx-0">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-48 aspect-[2/3] object-cover rounded-2xl shadow-lg"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <h2 className="text-3xl font-black text-[var(--color-light)] leading-none mb-2">{movie.title}</h2>
                                    <p className="text-gray-500 font-medium mb-6">{movie.genres.join(', ')} • {movie.rating}</p>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cinema</p>
                                            <p className="font-bold text-[var(--color-light)]">{show.cinemaName}</p>
                                            <p className="text-xs text-gray-500">{show.screenName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seats</p>
                                            <p className="font-black text-2xl text-[var(--color-primary)]">{booking.seats.join(', ')}</p>
                                            <p className="text-xs text-gray-500">{booking.seats.length} Tickets</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                                <span>{new Date(show.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                                                <span>{formatShowTime(show.time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-400">Total Paid</span>
                                    <span className="text-2xl font-black text-[var(--color-light)]">LKR {booking.totalPrice.toLocaleString()}</span>
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
                                <div className="w-32 h-32 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CineX-Ticket')] bg-cover"></div>
                            </div>
                            <p className="font-mono font-bold text-sm text-[var(--color-light)]">ID: {booking.id}</p>
                        </div>

                        <div className="w-full space-y-3 mt-6">
                            <button
                                onClick={handleDownload}
                                className="w-full btn btn-primary py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" /> Download PDF
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
