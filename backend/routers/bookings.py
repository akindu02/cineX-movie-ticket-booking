from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.post("/", response_model=schemas.Booking, status_code=201)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    """
    Create a new booking.
    
    Steps:
    1. Validate that the show exists
    2. Check if requested seats are already booked for that show
    3. Create the booking record
    4. Create individual seat records
    5. Return the created booking
    """
    
    # 1. Validate show exists
    show = db.query(models.Show).filter(models.Show.show_id == booking.show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # 2. Check for already booked seats
    # Get all existing bookings for this show
    existing_bookings = db.query(models.Booking).filter(
        models.Booking.show_id == booking.show_id,
        models.Booking.status != "cancelled"
    ).all()
    
    booked_seats = set()
    for existing_booking in existing_bookings:
        for seat in existing_booking.seats:
            booked_seats.add(seat.seat_number)
    
    # Check if any requested seat is already booked
    requested_seats = set(booking.seat_numbers)
    conflicts = requested_seats.intersection(booked_seats)
    
    if conflicts:
        raise HTTPException(
            status_code=400, 
            detail=f"Seats already booked: {', '.join(sorted(conflicts))}"
        )
    
    # 3. Create the booking record
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
    
    # 4. Create seat records
    for seat_number in booking.seat_numbers:
        db_seat = models.BookingSeat(
            booking_id=db_booking.booking_id,
            seat_number=seat_number
        )
        db.add(db_seat)
    
    db.commit()
    db.refresh(db_booking)
    
    return db_booking


@router.get("/user/{user_id}", response_model=List[schemas.BookingWithShow])
def get_user_bookings(user_id: str, db: Session = Depends(get_db)):
    """Get all bookings for a specific user with show details."""
    bookings = db.query(models.Booking).options(
        # Eager load show and cinema for each booking
    ).filter(
        models.Booking.user_id == user_id
    ).order_by(models.Booking.booking_date.desc()).all()
    return bookings


@router.get("/show/{show_id}/booked-seats")
def get_booked_seats(show_id: int, db: Session = Depends(get_db)):
    """Get all booked seat numbers for a specific show."""
    
    # Check if show exists
    show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Get all active bookings for this show
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
