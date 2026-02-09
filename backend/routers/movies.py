from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/", response_model=schemas.Movie, status_code=201)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    """Create a new movie with genres."""
    # Create the movie
    db_movie = models.Movie(
        title=movie.title,
        description=movie.description,
        duration_mins=movie.duration_mins,
        language=movie.language,
        release_date=movie.release_date,
        rating=movie.rating,
        poster_url=movie.poster_url,
        trailer_url=movie.trailer_url
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    
    # Add genres
    for genre_name in movie.genres:
        db_genre = models.MovieGenre(movie_id=db_movie.movie_id, genre=genre_name)
        db.add(db_genre)
    
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.delete("/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """Delete a movie by ID."""
    movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db.delete(movie)
    db.commit()
    return {"message": "Movie deleted successfully", "movie_id": movie_id}


@router.put("/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, movie_update: schemas.MovieCreate, db: Session = Depends(get_db)):
    """Update an existing movie."""
    db_movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Update movie fields
    db_movie.title = movie_update.title
    db_movie.description = movie_update.description
    db_movie.duration_mins = movie_update.duration_mins
    db_movie.language = movie_update.language
    db_movie.release_date = movie_update.release_date
    db_movie.rating = movie_update.rating
    db_movie.poster_url = movie_update.poster_url
    db_movie.trailer_url = movie_update.trailer_url
    
    # Update genres - delete existing and add new
    db.query(models.MovieGenre).filter(models.MovieGenre.movie_id == movie_id).delete()
    for genre_name in movie_update.genres:
        db_genre = models.MovieGenre(movie_id=movie_id, genre=genre_name)
        db.add(db_genre)
    
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.get("/{movie_id}/shows", response_model=List[schemas.Show])
def get_movie_shows(movie_id: int, db: Session = Depends(get_db)):
    shows = db.query(models.Show).filter(models.Show.movie_id == movie_id).all()
    return shows
