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
