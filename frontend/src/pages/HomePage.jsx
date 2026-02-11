import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import { Star, Calendar, Clock, Ticket, Film, Users, Trophy, Loader, ChevronRight } from 'lucide-react';
import a1 from '../assets/a1.jpg';
import a2 from '../assets/a2.jpg';
import a3 from '../assets/a3.jpg';

const HomePage = () => {
    // State for movies from API
    const [nowShowing, setNowShowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const heroImages = [
        a1,
        a2,
        a3
    ];

    // Fetch movies from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getMovies();
                setNowShowing(data.slice(0, 10)); // Show first 10 movies
            } catch (err) {
                console.error('Failed to fetch movies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // Auto-transition images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="min-h-screen pb-20">
            {/* Full-width Slideshow Hero Section */}
            <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black">
                {/* Background Images Layer */}
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex items-center">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
                        <div className="max-w-2xl animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-500 text-sm font-bold mb-6 border border-red-600/30 backdrop-blur-sm">
                                <Star className="w-4 h-4 fill-current" />
                                <span>#1 Movie Booking Platform</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg">
                                Reimagining the <br />
                                <span className="text-[var(--color-primary)]">Cinema Experience</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl drop-shadow-md">
                                Book tickets for the latest blockbusters in seconds. Experience premium screens, immersive sound, and hassle-free entry with CineX.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/movies"
                                    className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-red-600/30 hover:shadow-red-600/40 flex items-center gap-2 transition-transform hover:-translate-y-1"
                                >
                                    <Ticket className="w-5 h-5" />
                                    Book Tickets
                                </Link>
                                <Link
                                    to="/about"
                                    className="btn bg-white/10 backdrop-blur-md text-white border border-white/20 text-lg px-8 py-4 flex items-center gap-2 hover:bg-white/20 transition-all font-bold rounded-xl"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slider Indicators (Optional but nice) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                ? 'bg-[var(--color-primary)] w-8'
                                : 'bg-white/50 hover:bg-white'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>
            <section className="py-8 border-y border-[var(--color-dark-300)] bg-[var(--color-dark-100)]">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24">
                    {[
                        { label: 'Cinemas', value: '50+', icon: Film },
                        { label: 'Happy Users', value: '100k+', icon: Users },
                        { label: 'Movies Screened', value: '1,000+', icon: Film },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-4 py-2">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-dark-300)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[var(--color-light)]">{stat.value}</h4>
                                <p className="text-sm text-[var(--color-light-400)] font-medium uppercase tracking-wide">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Now Showing Section */}
            <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">
                            Now Showing
                        </h2>
                        <p className="text-[var(--color-light-400)]">Movies currently in theaters</p>
                    </div>
                    <Link to="/movies" className="text-[var(--color-primary)] hover:underline font-bold flex items-center gap-1 group">
                        View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
                    </div>
                ) : nowShowing.length === 0 ? (
                    <div className="text-center py-16">
                        <Film className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No movies available</h3>
                        <p className="text-gray-400">Check back soon for new releases!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {nowShowing.map((movie) => (
                            <Link
                                key={movie.movie_id}
                                to={`/movies/${movie.movie_id}`}
                                className="bg-white rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl border border-[var(--color-dark-300)] group h-full flex flex-col"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                                    {movie.poster_url ? (
                                        <img
                                            src={movie.poster_url}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                            <Film className="w-16 h-16 text-gray-300" />
                                        </div>
                                    )}
                                    {movie.rating && (
                                        <div className="absolute top-2 right-2 badge bg-white/90 backdrop-blur text-xs font-bold flex items-center gap-1 shadow-sm px-2 py-1 rounded-md text-[var(--color-light)]">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {movie.rating}
                                        </div>
                                    )}
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <span className="btn btn-primary rounded-full px-6 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                                            <Ticket className="w-4 h-4" /> Book Now
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg mb-1 truncate text-[var(--color-light)] group-hover:text-[var(--color-primary)] transition-colors">{movie.title}</h3>
                                    <div className="flex justify-between items-center text-sm text-[var(--color-light-400)] mt-auto">
                                        <span>{movie.genres?.[0]?.genre || 'Movie'}</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{Math.floor(movie.duration_mins / 60)}h {movie.duration_mins % 60}m</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Customer Feedback Section Removed */}
        </div>
    );
};



export default HomePage;
