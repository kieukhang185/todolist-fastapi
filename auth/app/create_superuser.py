import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from models import Base, User
from passlib.context import CryptContext

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_superuser(username, password):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if user:
        print("Superuser already exists!")
        return
    hashed_password = pwd_context.hash(password)
    superuser = User(username=username, hashed_password=hashed_password, role="admin", is_superuser=True)
    db.add(superuser)
    db.commit()
    db.close()
    print("Superuser created!")

if __name__ == "__main__":
    create_superuser("admin", "admin")
