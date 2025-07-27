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
    type_name: str
    assign: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str = None
    description: str = None
    status: Optional[str] = None
    reporter: Optional[str] = None
    assign: Optional[str] = None
    type_name: str

class TodoInDBBase(TodoBase):
    id: str
    created_at: datetime
    updated_at: datetime
    comments: List[Comment] = Field(default_factory=list)

    class Config:
        from_attributes = True

class Todo(TodoInDBBase):
    pass

class TodoTypeSchema(BaseModel):
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class TodoTypeCreate(BaseModel):
    name: str
    description: Optional[str] = None
