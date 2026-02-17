from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    OWNER = "owner"
    AGENT = "agent"
    ADMIN = "admin"


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.OWNER


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str
    role: UserRole = UserRole.OWNER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    avatar: Optional[str] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
