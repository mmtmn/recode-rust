from __future__ import annotations

from datetime import datetime, date
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Language(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    slug: str = Field(index=True, sa_column_kwargs={"unique": True})
    description: str
    color: str
    icon: str

    lessons: List["Lesson"] = Relationship(back_populates="language")


class Lesson(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    language_id: int = Field(foreign_key="language.id")
    title: str
    summary: str
    difficulty: str
    order_index: int
    xp: int

    language: Optional[Language] = Relationship(back_populates="lessons")
    challenges: List["Challenge"] = Relationship(back_populates="lesson")


class Challenge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lesson_id: int = Field(foreign_key="lesson.id")
    title: str
    prompt: str
    starter_code: str
    solution_code: str
    tests: str
    xp: int

    lesson: Optional[Lesson] = Relationship(back_populates="challenges")


class Achievement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(index=True, sa_column_kwargs={"unique": True})
    title: str
    description: str
    icon: str
    points: int

    unlocks: List["UserAchievement"] = Relationship(back_populates="achievement")


class UserProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    xp: int = 0
    streak: int = 0
    last_completed_at: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    completions: List["LessonCompletion"] = Relationship(back_populates="user")
    achievements: List["UserAchievement"] = Relationship(back_populates="user")


class LessonCompletion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    lesson_id: int = Field(foreign_key="lesson.id")
    completed_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[UserProfile] = Relationship(back_populates="completions")


class UserAchievement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    achievement_id: int = Field(foreign_key="achievement.id")
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[UserProfile] = Relationship(back_populates="achievements")
    achievement: Optional[Achievement] = Relationship(back_populates="unlocks")
