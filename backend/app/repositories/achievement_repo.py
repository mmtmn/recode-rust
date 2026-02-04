from typing import List, Optional

from sqlmodel import Session, select

from app.domain.models import Achievement, UserAchievement


def list_achievements(session: Session) -> List[Achievement]:
    return session.exec(select(Achievement).order_by(Achievement.points)).all()


def get_achievements_by_keys(session: Session, keys: List[str]) -> List[Achievement]:
    return session.exec(select(Achievement).where(Achievement.key.in_(keys))).all()


def list_user_achievement_keys(session: Session, user_id: int) -> List[str]:
    statement = select(Achievement.key).join(UserAchievement).where(UserAchievement.user_id == user_id)
    return [row[0] for row in session.exec(statement).all()]
