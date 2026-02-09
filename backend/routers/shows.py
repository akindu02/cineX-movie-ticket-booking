from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/shows",
    tags=["shows"]
)

@router.get("/", response_model=List[schemas.Show])
def get_all_shows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all shows with pagination."""
    shows = db.query(models.Show).offset(skip).limit(limit).all()
    return shows

@router.get("/{show_id}", response_model=schemas.Show)
def get_show(show_id: int, db: Session = Depends(get_db)):
    """Get a single show by ID with cinema details."""
    show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show


# Schema for creating shows by name
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class ShowCreateByName(BaseModel):
    movie_name: str
    cinema_name: str
    screen_name: str
    screen_type: str
    start_time: datetime
    ticket_price: Decimal


@router.post("/", response_model=schemas.Show, status_code=201)
def create_show(show: ShowCreateByName, db: Session = Depends(get_db)):
    """Create a new show using movie name and cinema name."""
    # Look up movie by name (case-insensitive partial match)
    movie = db.query(models.Movie).filter(
        models.Movie.title.ilike(f"%{show.movie_name}%")
    ).first()
    if not movie:
        raise HTTPException(status_code=404, detail=f"Movie '{show.movie_name}' not found")
    
    # Look up cinema by name (case-insensitive partial match)
    cinema = db.query(models.Cinema).filter(
        models.Cinema.name.ilike(f"%{show.cinema_name}%")
    ).first()
    if not cinema:
        raise HTTPException(status_code=404, detail=f"Cinema '{show.cinema_name}' not found")
    
    db_show = models.Show(
        movie_id=movie.movie_id,
        cinema_id=cinema.cinema_id,
        screen_name=show.screen_name,
        screen_type=show.screen_type,
        start_time=show.start_time,
        ticket_price=show.ticket_price
    )
    db.add(db_show)
    db.commit()
    db.refresh(db_show)
    return db_show


@router.delete("/{show_id}")
def delete_show(show_id: int, db: Session = Depends(get_db)):
    """Delete a show by ID."""
    show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    db.delete(show)
    db.commit()
    return {"message": "Show deleted successfully", "show_id": show_id}


# --- Cinemas ---
@router.get("/cinemas/all", response_model=List[schemas.Cinema])
def get_all_cinemas(db: Session = Depends(get_db)):
    """Get all cinemas."""
    cinemas = db.query(models.Cinema).all()
    return cinemas

