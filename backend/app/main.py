from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os

from . import models, schemas, crud

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/todos/", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db=db, todo=todo)

@app.get("/todos/", response_model=list[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_todos(db, skip=skip, limit=limit)

@app.get("/todos/{todo_id}", response_model=schemas.Todo)
def read_todo(todo_id: str, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.put("/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: str, todo_update: schemas.TodoUpdate, db: Session = Depends(get_db)):
    db_todo = crud.update_todo(db, todo_id=todo_id, todo_update=todo_update)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.delete("/todos/{todo_id}", response_model=schemas.Todo)
def delete_todo(todo_id: str, db: Session = Depends(get_db)):
    db_todo = crud.delete_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.post("/todos/{todo_id}/comments/", response_model=schemas.Comment)
def create_comment(todo_id: str, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return crud.create_comment(db, todo_id, comment)

@app.get("/todos/{todo_id}/comments/", response_model=list[schemas.Comment])
def list_comments(todo_id: str, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return crud.get_comments(db, todo_id)

@app.get("/todo-types/", response_model=list[schemas.TodoTypeSchema])
def list_types(db: Session = Depends(get_db)):
    return db.query(models.TodoType).all()

@app.post("/todo-types/", response_model=schemas.TodoTypeSchema)
def create_type(type_in: schemas.TodoTypeCreate, db: Session = Depends(get_db)):
    db_type = models.TodoType(name=type_in.name, description=type_in.description)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

@app.put("/todo-types/{type_id}", response_model=schemas.TodoTypeSchema)
def update_type(type_id: int, type_in: schemas.TodoTypeCreate, db: Session = Depends(get_db)):
    db_type = db.query(models.TodoType).filter_by(id=type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Type not found")
    db_type.name = type_in.name
    db_type.description = type_in.description
    db.commit()
    db.refresh(db_type)
    return db_type

@app.delete("/todo-types/{type_id}")
def delete_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.TodoType).filter_by(id=type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Type not found")
    db.delete(db_type)
    db.commit()
    return {"ok": True}