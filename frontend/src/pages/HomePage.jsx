import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { movies } from '../data/movies';

const HomePage = () => {
    // Featured movies for hero carousel
    const heroMovies = movies.slice(0, 5);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const nextHeroSlide = () => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    };

    const prevHeroSlide = () => {
        setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
    };

    // Auto-advance hero slide (optional, can be enabled/disabled)
    // useEffect(() => { ... }, []) 

    const nowShowing = movies.slice(0, 8); // Simulate "Now Showing"
    const comingSoon = movies.slice(4, 12); // Simulate "Coming Soon"

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Carousel */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                {heroMovies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${movie.backdropUrl})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark)]/80 via-transparent to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start justify-end h-full">
                            <div className="max-w-2xl animate-slide-up">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="badge badge-primary">{movie.genres[0]}</span>
                                    <span className="text-[var(--color-light-300)] font-medium">
                                        ⭐ {movie.rating}/10
                                    </span>
                                    <span className="text-[var(--color-light-300)]">
                                        {new Date(movie.releaseDate).getFullYear()}
                                    </span>
                                    <span className="text-[var(--color-light-300)]">
                                        {Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                                    {movie.title}
                                </h1>
                                <p className="text-lg md:text-xl text-[var(--color-light-300)] mb-8 line-clamp-3">
                                    {movie.description}
                                </p>

                                <div className="flex gap-4">
                                    <Link
                                        to={`/movies/${movie.id}`}
                                        className="btn btn-primary text-lg px-8 py-3 glow-effect"
                                    >
                                        Buy Tickets
                                    </Link>
                                    <button className="btn btn-secondary text-lg px-8 py-3 flex items-center gap-2">
                                        <span>▶</span> Watch Trailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Buttons */}
                <button
                    onClick={prevHeroSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-2xl transition-all"
                >
                    ‹
                </button>
                <button
                    onClick={nextHeroSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-2xl transition-all"
                >
                    ›
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                    {heroMovies.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentHeroIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentHeroIndex
                                ? 'bg-[var(--color-primary)] w-8'
                                : 'bg-[var(--color-light-400)]/50 hover:bg-[var(--color-light-400)]'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Now Showing Section */}
            <section className="py-12 px-4 md:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 border-l-4 border-[var(--color-primary)] pl-4">
                            Now Showing
                        </h2>
                        <p className="text-[var(--color-light-400)] ml-5">Movies currently in theaters</p>
                    </div>
                    <Link to="/movies" className="text-[var(--color-primary)] hover:underline font-medium">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {nowShowing.map((movie) => (
                        <Link
                            key={movie.id}
                            to={`/movies/${movie.id}`}
                            className="bg-[var(--color-dark-200)] rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 shadow-lg group"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                                    <span className="btn btn-primary rounded-full px-6">Buy Tickets</span>
                                </div>
                                <div className="absolute top-2 right-2 badge badge-accent text-xs font-bold">
                                    {movie.rating}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                                <div className="flex justify-between items-center text-sm text-[var(--color-light-400)]">
                                    <span>{movie.genres[0]}</span>
                                    <span>{Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>



            {/* Coming Soon Section */}
            <section className="py-12 px-4 md:px-8 bg-[var(--color-dark-200)]/30">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 border-l-4 border-[var(--color-accent)] pl-4">
                            Coming Soon
                        </h2>
                        <p className="text-[var(--color-light-400)] ml-5">Get ready for these blockbusters</p>
                    </div>
                    <Link to="/movies" className="text-[var(--color-accent)] hover:underline font-medium">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {comingSoon.map((movie) => (
                        <div
                            key={movie.id}
                            className="bg-[var(--color-dark-200)] rounded-xl overflow-hidden hover:shadow-xl transition-all group"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white font-medium text-center">Release: {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                                <p className="text-sm text-[var(--color-light-400)] truncate">{movie.genres.join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
