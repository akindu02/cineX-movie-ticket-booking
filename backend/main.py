from fastapi import FastAPI
from database import engine, Base

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CineX API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    try:
        # Test connection
        with engine.connect() as conn:
            print("\n✅ Database Connected Successfully!\n")
    except Exception as e:
        print(f"\n❌ Database Connection Failed: {e}\n")

@app.get("/")
def read_root():
    return {"message": "Welcome to CineX Backend API! 🎬"}
