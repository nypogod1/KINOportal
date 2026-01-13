import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here-change-it'
    
    # База данных
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:1612@localhost:5432/movies_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS разрешённые домены
    CORS_ORIGINS = [
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

