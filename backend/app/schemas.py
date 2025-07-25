from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    description: str = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str = None
    description: str = None
    completed: bool = None

class TodoInDBBase(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True

class Todo(TodoInDBBase):
    pass
