from datetime import datetime
from typing import List, Optional, Tuple

from sqlmodel import Session, select

from app.domain.models import Attempt, BestScore, Language, Lesson


AttemptRow = Tuple[Attempt, Lesson, Language]
BestScoreRow = Tuple[BestScore, Lesson, Language]


def add_attempt(
    session: Session,
    user_id: int,
    lesson_id: int,
    duration_ms: int,
    is_correct: bool,
) -> Attempt:
    attempt = Attempt(
        user_id=user_id,
        lesson_id=lesson_id,
        duration_ms=duration_ms,
        is_correct=is_correct,
        created_at=datetime.utcnow(),
    )
    session.add(attempt)
    session.commit()
    session.refresh(attempt)
    return attempt


def get_best_score(session: Session, user_id: int, lesson_id: int) -> Optional[BestScore]:
    statement = select(BestScore).where(
        BestScore.user_id == user_id,
        BestScore.lesson_id == lesson_id,
    )
    return session.exec(statement).first()


def upsert_best_score(session: Session, user_id: int, lesson_id: int, duration_ms: int) -> BestScore:
    best = get_best_score(session, user_id, lesson_id)
    if best is None:
        best = BestScore(
            user_id=user_id,
            lesson_id=lesson_id,
            best_duration_ms=duration_ms,
            achieved_at=datetime.utcnow(),
        )
        session.add(best)
    else:
        best.best_duration_ms = duration_ms
        best.achieved_at = datetime.utcnow()
        session.add(best)
    session.commit()
    session.refresh(best)
    return best


def list_attempts(
    session: Session,
    user_id: int,
    language_slugs: Optional[List[str]] = None,
) -> List[AttemptRow]:
    statement = (
        select(Attempt, Lesson, Language)
        .join(Lesson, Lesson.id == Attempt.lesson_id)
        .join(Language, Language.id == Lesson.language_id)
        .where(Attempt.user_id == user_id)
        .order_by(Attempt.created_at.desc())
    )
    if language_slugs:
        statement = statement.where(Language.slug.in_(language_slugs))
    return session.exec(statement).all()


def list_best_scores(
    session: Session,
    user_id: int,
    language_slugs: Optional[List[str]] = None,
) -> List[BestScoreRow]:
    statement = (
        select(BestScore, Lesson, Language)
        .join(Lesson, Lesson.id == BestScore.lesson_id)
        .join(Language, Language.id == Lesson.language_id)
        .where(BestScore.user_id == user_id)
        .order_by(BestScore.best_duration_ms.asc())
    )
    if language_slugs:
        statement = statement.where(Language.slug.in_(language_slugs))
    return session.exec(statement).all()
