import { useState } from 'react';
import { Link } from 'react-router-dom';
import { movies } from '../data/movies';
import { Star, Calendar, Clock, Ticket, Film, Users, Trophy } from 'lucide-react';

const HomePage = () => {
    // Featured movies logic - maybe use for "Trending" instead of full hero
    const nowShowing = movies.slice(0, 8);

    return (
        <div className="min-h-screen pb-20 pt-20">
            {/* New Hero Section - Clean White Theme */}
            <section className="relative px-4 md:px-8 py-12 md:py-20 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="z-10 animate-fade-in order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[var(--color-primary)] text-sm font-bold mb-6 border border-red-100">
                        <Star className="w-4 h-4 fill-current" />
                        <span>#1 Movie Booking Platform</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-[var(--color-light)]">
                        Reimagining the <br />
                        <span className="text-[var(--color-primary)]">Cinema Experience</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--color-light-400)] mb-8 max-w-xl leading-relaxed">
                        Book tickets for the latest blockbusters in seconds. Experience premium screens, immersive sound, and hassle-free entry with CineX.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/movies"
                            className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-red-600/20 hover:shadow-red-600/30 flex items-center gap-2"
                        >
                            <Ticket className="w-5 h-5" />
                            Book Tickets
                        </Link>
                        <Link to="/about" className="btn btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                            Learn More
                        </Link>
                    </div>


                </div>

                <div className="relative order-1 lg:order-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-red-500/10 to-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                            <img src={movies[0].posterUrl} className="rounded-2xl shadow-2xl hover:-translate-y-2 transition-transform duration-500 rotate-[-2deg]" alt="Movie 1" />
                            <img src={movies[2].posterUrl} className="rounded-2xl shadow-2xl hover:-translate-y-2 transition-transform duration-500 rotate-[-1deg]" alt="Movie 2" />
                        </div>
                        <div className="space-y-4">
                            <img src={movies[1].posterUrl} className="rounded-2xl shadow-2xl hover:-translate-y-2 transition-transform duration-500 rotate-[2deg]" alt="Movie 3" />
                            <img src={movies[4].posterUrl} className="rounded-2xl shadow-2xl hover:-translate-y-2 transition-transform duration-500 rotate-[1deg]" alt="Movie 4" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                    {nowShowing.map((movie) => (
                        <Link
                            key={movie.id}
                            to={`/movies/${movie.id}`}
                            className="bg-white rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl border border-[var(--color-dark-300)] group h-full flex flex-col"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 badge bg-white/90 backdrop-blur text-xs font-bold flex items-center gap-1 shadow-sm px-2 py-1 rounded-md text-[var(--color-light)]">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {movie.rating}
                                </div>
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
                                    <span>{movie.genres[0]}</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Customer Feedback Section Removed */}
        </div>
    );
};

// Imports: I need to make sure I import what I used.
import { ChevronRight } from 'lucide-react';

export default HomePage;
