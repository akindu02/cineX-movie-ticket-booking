from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from pydantic import BaseModel
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
    shows = db.query(models.Show).options(joinedload(models.Show.cinema)).offset(skip).limit(limit).all()
    return shows

@router.get("/{show_id}", response_model=schemas.Show)
def get_show(show_id: int, db: Session = Depends(get_db)):
    """Get a single show by ID with cinema details."""
    show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show


@router.post("/", response_model=schemas.Show, status_code=201)
def create_show(show: schemas.ShowCreate, db: Session = Depends(get_db)):
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


@router.put("/{show_id}", response_model=schemas.Show)
def update_show(show_id: int, show_update: schemas.ShowCreate, db: Session = Depends(get_db)):
    """Update an existing show."""
    db_show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not db_show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Validate movie exists
    movie = db.query(models.Movie).filter(models.Movie.movie_id == show_update.movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Validate cinema exists
    cinema = db.query(models.Cinema).filter(models.Cinema.cinema_id == show_update.cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    
    db_show.movie_id = show_update.movie_id
    db_show.cinema_id = show_update.cinema_id
    db_show.screen_name = show_update.screen_name
    db_show.screen_type = show_update.screen_type
    db_show.start_time = show_update.start_time
    db_show.ticket_price = show_update.ticket_price
    
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


class CinemaCreate(BaseModel):
    name: str
    location: str


@router.post("/cinemas/", response_model=schemas.Cinema, status_code=201)
def create_cinema(cinema: CinemaCreate, db: Session = Depends(get_db)):
    """Create a new cinema."""
    # Check if cinema with same name already exists
    existing = db.query(models.Cinema).filter(models.Cinema.name == cinema.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cinema with this name already exists")
    
    db_cinema = models.Cinema(
        name=cinema.name,
        location=cinema.location
    )
    db.add(db_cinema)
    db.commit()
    db.refresh(db_cinema)
    return db_cinema


@router.delete("/cinemas/{cinema_id}")
def delete_cinema(cinema_id: int, db: Session = Depends(get_db)):
    """Delete a cinema by ID."""
    cinema = db.query(models.Cinema).filter(models.Cinema.cinema_id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    
    # Check if cinema has associated shows
    shows_count = db.query(models.Show).filter(models.Show.cinema_id == cinema_id).count()
    if shows_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete cinema. It has {shows_count} associated shows. Delete the shows first."
        )
    
    db.delete(cinema)
    db.commit()
    return {"message": "Cinema deleted successfully", "cinema_id": cinema_id}


@router.put("/cinemas/{cinema_id}", response_model=schemas.Cinema)
def update_cinema(cinema_id: int, cinema_update: CinemaCreate, db: Session = Depends(get_db)):
    """Update an existing cinema."""
    db_cinema = db.query(models.Cinema).filter(models.Cinema.cinema_id == cinema_id).first()
    if not db_cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    
    # Check if another cinema with the same name exists
    existing = db.query(models.Cinema).filter(
        models.Cinema.name == cinema_update.name,
        models.Cinema.cinema_id != cinema_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Another cinema with this name already exists")
    
    db_cinema.name = cinema_update.name
    db_cinema.location = cinema_update.location
    
    db.commit()
    db.refresh(db_cinema)
    return db_cinema
