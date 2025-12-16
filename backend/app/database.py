from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL from docker-compose.yml
# POSTGRES_USER=admin, POSTGRES_PASSWORD=admin, POSTGRES_DB=maintenance_db, Port=5432
SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin@localhost:5432/maintenance_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
