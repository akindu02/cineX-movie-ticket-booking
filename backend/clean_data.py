from database import SessionLocal
import models

def clean_database():
    db = SessionLocal()
    try:
        print("🧹 Cleaning database test data...")
        
        # 1. Booking Seats (Child of Bookings)
        seats_deleted = db.query(models.BookingSeat).delete()
        print(f"   - Deleted {seats_deleted} booking seats")
        
        # 2. Bookings (Child of Shows/Users)
        bookings_deleted = db.query(models.Booking).delete()
        print(f"   - Deleted {bookings_deleted} bookings")

        # 3. Shows (Child of Movies/Cinemas)
        shows_deleted = db.query(models.Show).delete()
        print(f"   - Deleted {shows_deleted} shows")

        # 4. Movie Genres (Child of Movies)
        genres_deleted = db.query(models.MovieGenre).delete()
        print(f"   - Deleted {genres_deleted} movie genres")

        # 5. Movies
        movies_deleted = db.query(models.Movie).delete()
        print(f"   - Deleted {movies_deleted} movies")

        # 6. Cinemas
        cinemas_deleted = db.query(models.Cinema).delete()
        print(f"   - Deleted {cinemas_deleted} cinemas")

        # 7. Users
        # We delete users last. This will clear customer records.
        # Admin access is managed via Clerk, so re-login will handle access.
        users_deleted = db.query(models.User).delete()
        print(f"   - Deleted {users_deleted} users")

        db.commit()
        print("\n✨ Database cleaned successfully! You can now populate real data.")
        
    except Exception as e:
        print(f"\n❌ Error cleaning database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()
