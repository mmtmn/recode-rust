from typing import List, Optional

from sqlmodel import Session, select

from app.domain.models import Lesson


def list_lessons_by_language(session: Session, language_id: int) -> List[Lesson]:
    statement = select(Lesson).where(Lesson.language_id == language_id).order_by(Lesson.order_index)
    return session.exec(statement).all()


def get_lesson(session: Session, lesson_id: int) -> Optional[Lesson]:
    return session.exec(select(Lesson).where(Lesson.id == lesson_id)).first()
