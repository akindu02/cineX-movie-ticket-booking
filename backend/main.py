from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import movies

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CineX API", version="1.0.0")

# CORS (Cross-Origin Resource Sharing) - Allow Frontend to talk to Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(movies.router)

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
