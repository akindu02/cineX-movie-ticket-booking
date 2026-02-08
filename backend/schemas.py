from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal

# --- Users ---
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str

class UserCreate(UserBase):
    user_id: str  # From Clerk

class User(UserBase):
    user_id: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Genres ---
class MovieGenreBase(BaseModel):
    genre: str

class MovieGenre(MovieGenreBase):
    movie_id: int

    class Config:
        from_attributes = True

# --- Movies ---
class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration_mins: int
    language: Optional[str] = None
    release_date: Optional[date] = None
    rating: Optional[float] = None
    poster_url: Optional[str] = None
    trailer_url: Optional[str] = None

class MovieCreate(MovieBase):
    genres: List[str]  # List of strings for easier input

class Movie(MovieBase):
    movie_id: int
    genres: List[MovieGenre] = []

    class Config:
        from_attributes = True

# --- Cinemas & Shows ---
class CinemaBase(BaseModel):
    name: str
    location: str

class Cinema(CinemaBase):
    cinema_id: int

    class Config:
        from_attributes = True

class ShowBase(BaseModel):
    screen_name: str
    screen_type: Optional[str] = None
    start_time: datetime
    ticket_price: float

class Show(ShowBase):
    show_id: int
    movie_id: int
    cinema_id: int
    cinema: Optional[Cinema] = None  # Include cinema details in show info

    class Config:
        from_attributes = True

# --- Bookings ---
class BookingBase(BaseModel):
    contact_email: str
    contact_phone: str
    booking_date: Optional[datetime] = None

class BookingCreate(BookingBase):
    show_id: int
    user_id: str
    seat_numbers: List[str]
    total_amount: float

class BookingSeat(BaseModel):
    seat_number: str
    
    class Config:
        from_attributes = True

class Booking(BookingBase):
    booking_id: int
    status: str
    # show: Show
    seats: List[BookingSeat] = []

    class Config:
        from_attributes = True
