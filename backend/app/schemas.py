from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    author: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TodoBase(BaseModel):
    title: str
    description: str = None
    status: Optional[str] = "new"
    reporter: str
    assign: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str = None
    description: str = None
    status: Optional[str] = None
    reporter: Optional[str] = None
    assign: Optional[str] = None

class TodoInDBBase(TodoBase):
    id: int
    created_at: datetime
    last_edit: datetime
    comments: List[Comment] = Field(default_factory=list)

    class Config:
        from_attributes = True

class Todo(TodoInDBBase):
    pass

