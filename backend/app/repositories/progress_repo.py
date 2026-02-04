from datetime import datetime
from typing import Optional

from sqlmodel import Session, select

from app.domain.models import LessonCompletion, UserAchievement, UserProfile


def get_or_create_user(session: Session, name: str = "Player One") -> UserProfile:
    user = session.exec(select(UserProfile).limit(1)).first()
    if user:
        return user
    user = UserProfile(name=name)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def count_completed_lessons(session: Session, user_id: int) -> int:
    statement = select(LessonCompletion).where(LessonCompletion.user_id == user_id)
    return len(session.exec(statement).all())


def has_completed_lesson(session: Session, user_id: int, lesson_id: int) -> bool:
    statement = select(LessonCompletion).where(
        LessonCompletion.user_id == user_id,
        LessonCompletion.lesson_id == lesson_id,
    )
    return session.exec(statement).first() is not None


def add_completion(session: Session, user_id: int, lesson_id: int) -> LessonCompletion:
    completion = LessonCompletion(user_id=user_id, lesson_id=lesson_id, completed_at=datetime.utcnow())
    session.add(completion)
    session.commit()
    session.refresh(completion)
    return completion


def add_user_achievement(session: Session, user_id: int, achievement_id: int) -> UserAchievement:
    unlock = UserAchievement(user_id=user_id, achievement_id=achievement_id)
    session.add(unlock)
    session.commit()
    session.refresh(unlock)
    return unlock
