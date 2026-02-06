from sqlalchemy import Column, Integer, String, Text, Date, TIMESTAMP, Numeric, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(255), primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(20), default="customer")
    created_at = Column(TIMESTAMP, server_default=func.now())

class Movie(Base):
    __tablename__ = "movies"

    movie_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    duration_mins = Column(Integer, nullable=False)
    language = Column(String(50))
    release_date = Column(Date)
    rating = Column(DECIMAL(3, 1))
    poster_url = Column(Text)
    trailer_url = Column(Text)

    # Relationships
    genres = relationship("MovieGenre", back_populates="movie", cascade="all, delete-orphan")
    shows = relationship("Show", back_populates="movie")

class MovieGenre(Base):
    __tablename__ = "movie_genres"

    movie_id = Column(Integer, ForeignKey("movies.movie_id"), primary_key=True)
    genre = Column(String(50), primary_key=True)

    movie = relationship("Movie", back_populates="genres")

class Cinema(Base):
    __tablename__ = "cinemas"

    cinema_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)

    shows = relationship("Show", back_populates="cinema")

class Show(Base):
    __tablename__ = "shows"

    show_id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.movie_id"))
    cinema_id = Column(Integer, ForeignKey("cinemas.cinema_id"))
    screen_name = Column(String(50), nullable=False)
    screen_type = Column(String(50))
    start_time = Column(TIMESTAMP, nullable=False)
    ticket_price = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    movie = relationship("Movie", back_populates="shows")
    cinema = relationship("Cinema", back_populates="shows")
    bookings = relationship("Booking", back_populates="show")

class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.user_id"))
    show_id = Column(Integer, ForeignKey("shows.show_id"))
    booking_date = Column(TIMESTAMP, server_default=func.now())
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(20), default="confirmed")
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(20), nullable=False)

    show = relationship("Show", back_populates="bookings")
    user = relationship("User")
    seats = relationship("BookingSeat", back_populates="booking", cascade="all, delete-orphan")

class BookingSeat(Base):
    __tablename__ = "booking_seats"

    booking_seat_id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.booking_id"))
    seat_number = Column(String(10), nullable=False)

    booking = relationship("Booking", back_populates="seats")
