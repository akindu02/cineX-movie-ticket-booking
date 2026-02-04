import { Link } from 'react-router-dom';
import { movies } from '../data/movies';

const HomePage = () => {
    // Get first 4 movies as featured
    const featuredMovies = movies.slice(0, 4);

    // Get top rated movies
    const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${movies[0].backdropUrl}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark)]/70 via-[var(--color-dark)]/50 to-[var(--color-dark)]"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Experience Cinema Like
                        <span className="text-gradient"> Never Before</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--color-light-300)] mb-8 max-w-2xl mx-auto">
                        Book your tickets for the latest blockbusters with the best seats in premium theaters
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/movies" className="btn btn-primary text-lg px-8 py-4">
                            Browse Movies
                        </Link>
                        <Link to="/my-bookings" className="btn btn-secondary text-lg px-8 py-4">
                            My Bookings
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-[var(--color-light-400)] rounded-full flex justify-center pt-2">
                        <div className="w-1.5 h-3 bg-[var(--color-primary)] rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Now Showing Section */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Now Showing</h2>
                            <p className="text-[var(--color-light-400)]">Catch the latest releases in theaters</p>
                        </div>
                        <Link to="/movies" className="btn btn-secondary">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredMovies.map((movie) => (
                            <Link
                                key={movie.id}
                                to={`/movies/${movie.id}`}
                                className="card group"
                            >
                                <div className="relative overflow-hidden aspect-[2/3]">
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-3 right-3 badge badge-accent">
                                        ⭐ {movie.rating}
                                    </div>
                                    <div className="absolute top-3 left-3 badge badge-primary">
                                        {movie.language}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {movie.genres.slice(0, 2).map((genre, i) => (
                                            <span key={i} className="text-xs text-[var(--color-light-400)]">
                                                {genre}{i < Math.min(movie.genres.length, 2) - 1 ? ' •' : ''}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-[var(--color-light-400)]">
                                        ⏱️ {Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Rated Section */}
            <section className="py-20 px-4 md:px-8 bg-[var(--color-secondary-dark)]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top Rated</h2>
                            <p className="text-[var(--color-light-400)]">Highest rated movies this month</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topRated.map((movie, index) => (
                            <Link
                                key={movie.id}
                                to={`/movies/${movie.id}`}
                                className="card group relative"
                            >
                                <div className="absolute top-3 left-3 z-10 w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center font-bold text-lg">
                                    #{index + 1}
                                </div>
                                <div className="relative overflow-hidden aspect-[2/3]">
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent"></div>
                                    <div className="absolute top-3 right-3 badge badge-accent">
                                        ⭐ {movie.rating}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{movie.title}</h3>
                                    <span className="text-sm text-[var(--color-light-400)]">{movie.genres[0]}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Why Choose <span className="text-gradient">CineX</span>?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🎬",
                                title: "Premium Experience",
                                description: "Enjoy movies in state-of-the-art theaters with Dolby Atmos and IMAX screens"
                            },
                            {
                                icon: "🎟️",
                                title: "Easy Booking",
                                description: "Book your tickets in seconds with our intuitive seat selection system"
                            },
                            {
                                icon: "🍿",
                                title: "Exclusive Perks",
                                description: "Get special discounts, early access to blockbusters, and combo offers"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-glass rounded-2xl p-8 text-center hover-lift"
                            >
                                <div className="text-5xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                                <p className="text-[var(--color-light-400)]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8 bg-[var(--color-secondary-dark)]/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready for Your Next Movie Night?
                    </h2>
                    <p className="text-xl text-[var(--color-light-400)] mb-8">
                        Join thousands of movie lovers who trust CineX for their cinema experience
                    </p>
                    <Link to="/movies" className="btn btn-primary text-lg px-12 py-4 glow-effect">
                        Book Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
