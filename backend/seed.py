from database import SessionLocal, engine, Base
from models import Movie, Cinema, Show, MovieGenre
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Allow re-seeding by clearing existing data (Optional, be careful in prod)
    # db.query(BookingSeat).delete()
    # db.query(Booking).delete()
    # db.query(Show).delete()
    # db.query(MovieGenre).delete()
    # db.query(Movie).delete()
    # db.query(Cinema).delete()
    # db.commit()

    print("🌱 Seeding Cinemas...")
    cinemas = [
        Cinema(name="Scope Cinemas - Colombo City Centre", location="Colombo 02"),
        Cinema(name="PVR Cinemas - One Galle Face", location="Colombo 01"),
        Cinema(name="Liberty by Scope Cinemas", location="Kollupitiya"),
        Cinema(name="Savoy Premiere", location="Wellawatte")
    ]
    
    # Check if cinemas exist to avoid duplicates if re-running
    if db.query(Cinema).count() == 0:
        db.add_all(cinemas)
        db.commit() 
    
    # Refresh to get IDs
    cinemas = db.query(Cinema).all()

    print("🌱 Seeding Movies...")
    movies_data = [
        {
            "title": "Dune: Part Two",
            "description": "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
            "duration_mins": 166,
            "language": "English",
            "rating": 8.8,
            "release_date": datetime(2024, 3, 1).date(),
            "poster_url": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
            "genres": ["Sci-Fi", "Adventure"]
        },
        {
            "title": "Kung Fu Panda 4",
            "description": "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.",
            "duration_mins": 94,
            "language": "English",
            "rating": 7.6,
            "release_date": datetime(2024, 3, 8).date(),
            "poster_url": "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
            "genres": ["Animation", "Action", "Comedy"]
        },
        {
            "title": "Godzilla x Kong: The New Empire",
            "description": "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
            "duration_mins": 115,
            "language": "English",
            "rating": 7.2,
            "release_date": datetime(2024, 3, 29).date(),
            "poster_url": "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg",
            "genres": ["Action", "Sci-Fi"]
        }
    ]

    for m_data in movies_data:
        # Check if movie exists
        if db.query(Movie).filter_by(title=m_data["title"]).first():
            continue

        genres = m_data.pop("genres")
        movie = Movie(**m_data)
        db.add(movie)
        db.commit()
        db.refresh(movie)

        for g_name in genres:
            db.add(MovieGenre(movie_id=movie.movie_id, genre=g_name))
        db.commit()

    movies = db.query(Movie).all()

    print("🌱 Seeding Shows...")
    # Generate shows for the next 7 days
    screen_types = ["IMAX", "Dolby Atmos", "Standard"]
    
    if db.query(Show).count() == 0:
        shows = []
        today = datetime.now()
        
        for i in range(7): # Next 7 days
            current_date = today + timedelta(days=i)
            
            for cinema in cinemas:
                # 3 shows per cinema per day
                for _ in range(3):
                    movie = random.choice(movies)
                    hour = random.randint(10, 22) # 10 AM to 10 PM
                    minute = random.choice([0, 30])
                    start_time = current_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
                    
                    screen_type = random.choice(screen_types)
                    price = 1000
                    if screen_type == "IMAX": price = 2500
                    elif screen_type == "Dolby Atmos": price = 2000

                    shows.append(Show(
                        movie_id=movie.movie_id,
                        cinema_id=cinema.cinema_id,
                        screen_name=f"Screen {random.randint(1, 4)}",
                        screen_type=screen_type,
                        start_time=start_time,
                        ticket_price=price
                    ))
        
        db.add_all(shows)
        db.commit()

    print("✅ Database Seeding Completed Successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
