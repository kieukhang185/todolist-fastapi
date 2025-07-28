from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    status = Column(String, default="new")      # new, todo, in_progress, done, etc.
    reporter = Column(String, nullable=False)       # user who created the todo
    assign = Column(String, nullable=False)          # user assigned to the todo
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    comments = relationship("Comment", back_populates="todo", cascade="all, delete-orphan")
    type_name = Column(String, ForeignKey("todo_types.name"), nullable=False)
    type = relationship("TodoType")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    todo_id = Column(String, ForeignKey("todos.id"), nullable=False)
    content = Column(String, nullable=False)
    author = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    todo = relationship("Todo", back_populates="comments")

class TodoType(Base):
    __tablename__ = "todo_types"
    name = Column(String, primary_key=True, index=True) 
    description = Column(String, nullable=True)
