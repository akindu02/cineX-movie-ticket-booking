from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/movies",
    tags=["movies"]
)

@router.get("/", response_model=List[schemas.Movie])
def get_movies(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    genre: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Movie)
    
    if search:
        query = query.filter(models.Movie.title.ilike(f"%{search}%"))
    
    if genre:
        query = query.join(models.MovieGenre).filter(models.MovieGenre.genre == genre)
        
    movies = query.offset(skip).limit(limit).all()
    return movies

@router.get("/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.get("/{movie_id}/shows", response_model=List[schemas.Show])
def get_movie_shows(movie_id: int, db: Session = Depends(get_db)):
    shows = db.query(models.Show).filter(models.Show.movie_id == movie_id).all()
    return shows
