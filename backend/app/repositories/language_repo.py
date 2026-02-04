from typing import List, Optional

from sqlmodel import Session, select

from app.domain.models import Language


def list_languages(session: Session) -> List[Language]:
    return session.exec(select(Language).order_by(Language.name)).all()


def get_language_by_slug(session: Session, slug: str) -> Optional[Language]:
    return session.exec(select(Language).where(Language.slug == slug)).first()
