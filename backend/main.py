from fastapi import FastAPI
from database import engine, Base

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CineX API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to CineX Backend API! 🎬"}
