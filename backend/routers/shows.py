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


# Schema for creating shows
class ShowCreate(schemas.ShowBase):
    movie_id: int
    cinema_id: int


@router.post("/", response_model=schemas.Show, status_code=201)
def create_show(show: ShowCreate, db: Session = Depends(get_db)):
    """Create a new show."""
    # Validate movie exists
    movie = db.query(models.Movie).filter(models.Movie.movie_id == show.movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Validate cinema exists
    cinema = db.query(models.Cinema).filter(models.Cinema.cinema_id == show.cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    
    db_show = models.Show(
        movie_id=show.movie_id,
        cinema_id=show.cinema_id,
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

