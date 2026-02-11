from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
import models
import schemas
from utils.email_service import send_booking_confirmation

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.post("/", response_model=schemas.Booking, status_code=201)
def create_booking(
    booking: schemas.BookingCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    """
    Create a new booking and send confirmation email.
    
    Steps:
    1. Validate that the show exists (and fetch movie/cinema details for email)
    2. Check if requested seats are already booked for that show
    3. If user_id provided, ensure user exists in DB
    4. Create the booking record
    5. Create individual seat records
    6. Send confirmation email (background task)
    7. Return the created booking
    """
    
    # 1. Validate show exists (and eagerly load details for email)
    show = db.query(models.Show).options(
        joinedload(models.Show.movie),
        joinedload(models.Show.cinema)
    ).filter(models.Show.show_id == booking.show_id).first()

    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # 2. Check for already booked seats
    existing_bookings = db.query(models.Booking).filter(
        models.Booking.show_id == booking.show_id,
        models.Booking.status != "cancelled"
    ).all()
    
    booked_seats = set()
    for existing_booking in existing_bookings:
        for seat in existing_booking.seats:
            booked_seats.add(seat.seat_number)
    
    requested_seats = set(booking.seat_numbers)
    conflicts = requested_seats.intersection(booked_seats)
    
    if conflicts:
        raise HTTPException(
            status_code=400, 
            detail=f"Seats already booked: {', '.join(sorted(conflicts))}"
        )
    
    # 3. If user_id is provided, ensure user exists in DB (auto-create for Clerk users)
    if booking.user_id:
        existing_user = db.query(models.User).filter(models.User.user_id == booking.user_id).first()
        if not existing_user:
            email_name = booking.contact_email.split('@')[0] if booking.contact_email else 'User'
            new_user = models.User(
                user_id=booking.user_id,
                first_name=email_name,
                last_name='',
                email=booking.contact_email or '',
                role='customer'
            )
            db.add(new_user)
            db.commit()
    
    # 4. Create the booking record
    db_booking = models.Booking(
        user_id=booking.user_id,
        show_id=booking.show_id,
        total_amount=booking.total_amount,
        contact_email=booking.contact_email,
        contact_phone=booking.contact_phone,
        status="confirmed"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # 5. Create seat records
    for seat_number in booking.seat_numbers:
        db_seat = models.BookingSeat(
            booking_id=db_booking.booking_id,
            seat_number=seat_number
        )
        db.add(db_seat)
    
    db.commit()
    db.refresh(db_booking)
    
    # 6. Send confirmation email (Background Task)
    if booking.contact_email:
        background_tasks.add_task(
            send_booking_confirmation,
            contact_email=booking.contact_email,
            movie_title=show.movie.title,
            cinema_name=show.cinema.name,
            screen_name=show.screen_name,
            show_time_obj=show.start_time,
            seat_numbers=booking.seat_numbers,
            booking_id=db_booking.booking_id,
            total_amount=booking.total_amount
        )
    
    return db_booking


@router.get("/user/{user_id}", response_model=List[schemas.BookingWithShow])
def get_user_bookings(user_id: str, db: Session = Depends(get_db)):
    """Get all bookings for a specific user with show details."""
    bookings = db.query(models.Booking).options(
        joinedload(models.Booking.show).joinedload(models.Show.cinema),
        joinedload(models.Booking.show).joinedload(models.Show.movie),
        joinedload(models.Booking.seats)
    ).filter(
        models.Booking.user_id == user_id
    ).order_by(models.Booking.booking_date.desc()).all()
    return bookings


@router.get("/", response_model=List[schemas.BookingWithShow])
def get_all_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all bookings (admin endpoint)."""
    bookings = db.query(models.Booking).options(
        joinedload(models.Booking.show).joinedload(models.Show.cinema),
        joinedload(models.Booking.show).joinedload(models.Show.movie),
        joinedload(models.Booking.seats)
    ).order_by(
        models.Booking.booking_date.desc()
    ).offset(skip).limit(limit).all()
    return bookings


@router.get("/show/{show_id}/booked-seats")
def get_booked_seats(show_id: int, db: Session = Depends(get_db)):
    """Get all booked seat numbers for a specific show."""
    
    show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    bookings = db.query(models.Booking).filter(
        models.Booking.show_id == show_id,
        models.Booking.status != "cancelled"
    ).all()
    
    booked_seats = []
    for booking in bookings:
        for seat in booking.seats:
            booked_seats.append(seat.seat_number)
    
    return {"booked_seats": booked_seats}


@router.patch("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking by ID."""
    
    booking = db.query(models.Booking).filter(
        models.Booking.booking_id == booking_id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
    
    booking.status = "cancelled"
    db.commit()
    
    return {"message": "Booking cancelled successfully", "booking_id": booking_id}
