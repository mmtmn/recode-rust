from typing import Optional, Tuple

from sqlmodel import Session, select

from app.domain.models import Challenge, Language, Lesson


ChallengeContext = Tuple[Challenge, Lesson, Language]


def get_challenge_context(session: Session, challenge_id: int) -> Optional[ChallengeContext]:
    statement = (
        select(Challenge, Lesson, Language)
        .join(Lesson, Lesson.id == Challenge.lesson_id)
        .join(Language, Language.id == Lesson.language_id)
        .where(Challenge.id == challenge_id)
    )
    return session.exec(statement).first()
