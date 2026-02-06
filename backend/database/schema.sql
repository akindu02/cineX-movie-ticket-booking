-- Enable UUID extension if needed (good practice for IDs, though we use Serial/Int here for simplicity matching frontend)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. Users Table (Synced with Clerk)
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    -- Clerk ID (e.g., user_2xyz...)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. Movies Table
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_mins INTEGER NOT NULL,
    language VARCHAR(50),
    release_date DATE,
    rating DECIMAL(3, 1),
    poster_url TEXT,
    trailer_url TEXT
);
-- 3. Movie Genres (3NF: Many-to-Many handling without multi-value strings)
CREATE TABLE movie_genres (
    movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
    genre VARCHAR(50) NOT NULL,
    PRIMARY KEY (movie_id, genre)
);
-- 4. Cinemas Table
CREATE TABLE cinemas (
    cinema_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    -- e.g. "Scope Cinemas - CCC"
    location VARCHAR(255) NOT NULL
);
-- 5. Shows Table (Scheduling)
-- Assuming universal seat structure, so no separate screens table needed
CREATE TABLE shows (
    show_id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
    cinema_id INTEGER REFERENCES cinemas(cinema_id) ON DELETE CASCADE,
    screen_name VARCHAR(50) NOT NULL,
    -- e.g. "Screen 1" or "IMAX Hall"
    screen_type VARCHAR(50),
    -- e.g. "IMAX", "2D", "Gold Class"
    start_time TIMESTAMP NOT NULL,
    -- Combined Date + Time
    ticket_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 6. Bookings Table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE
    SET NULL,
        show_id INTEGER REFERENCES shows(show_id) ON DELETE RESTRICT,
        -- Don't delete shows if they have bookings
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(20) NOT NULL
);
-- 7. Booking Seats (3NF: Atomic seat storage)
CREATE TABLE booking_seats (
    booking_seat_id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    -- e.g. "A1", "B5"
    UNIQUE(booking_id, seat_number) -- Prevent duplicate seats in same booking
);