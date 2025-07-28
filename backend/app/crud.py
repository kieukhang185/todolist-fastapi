from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def generate_todo_id(db, type_name):
    # Find latest todo with this type, extract number, and increment
    prefix = type_name if type_name != "sub-task" else "subtask"
    pattern = f"{prefix}-%"
    latest = (
        db.query(models.Todo)
        .filter(models.Todo.id.like(pattern))
        .order_by(models.Todo.id.desc())
        .first()
    )
    if latest:
        # Extract number from latest.id (e.g., 'task-05' -> 5)
        try:
            num = int(latest.id.split("-")[-1])
            next_num = num + 1
        except Exception:
            next_num = 1
    else:
        next_num = 1
    # Zero-padded (always two digits)
    return f"{prefix}-{next_num:02d}"


def get_todo(db: Session, todo_id: str):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def get_todos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Todo).offset(skip).limit(limit).all()

def create_todo(db: Session, todo: schemas.TodoCreate):
    new_id = generate_todo_id(db, todo.type_name)
    db_todo = models.Todo(
        id=new_id,
        type_name=todo.type_name,
        title=todo.title,
        description=todo.description,
        status='new',
        reporter=todo.reporter,
        assign=todo.assign,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        # ... any other fields ...
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: str, todo_update: schemas.TodoUpdate):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        return None
    update_data = todo_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)
    todo_obj.updated_at = datetime.utcnow() 
    db.commit()
    db.refresh(todo)
    return todo

def delete_todo(db: Session, todo_id: str):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        return None
    db.delete(todo)
    db.commit()
    return todo

def get_comments(db: Session, todo_id: str):
    return db.query(models.Comment).filter(models.Comment.todo_id == todo_id).all()

def create_comment(db: Session, todo_id: str, comment: schemas.CommentCreate):
    db_comment = models.Comment(todo_id=todo_id, **comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
