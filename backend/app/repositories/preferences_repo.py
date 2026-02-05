import json
from datetime import datetime
from typing import List, Optional

from sqlmodel import Session, select

from app.domain.models import UserPreference


def _serialize_slugs(slugs: List[str]) -> str:
    return json.dumps(slugs)


def _deserialize_slugs(raw: str) -> List[str]:
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if not isinstance(data, list):
        return []
    return [item for item in data if isinstance(item, str)]


def get_preferences(session: Session, user_id: int) -> Optional[UserPreference]:
    statement = select(UserPreference).where(UserPreference.user_id == user_id)
    return session.exec(statement).first()


def get_or_create_preferences(session: Session, user_id: int) -> UserPreference:
    prefs = get_preferences(session, user_id)
    if prefs:
        return prefs
    prefs = UserPreference(user_id=user_id)
    session.add(prefs)
    session.commit()
    session.refresh(prefs)
    return prefs


def update_preferences(
    session: Session,
    user_id: int,
    playlist_mode: str,
    selected_slugs: List[str],
    selected_slug: Optional[str],
) -> UserPreference:
    prefs = get_or_create_preferences(session, user_id)
    prefs.playlist_mode = playlist_mode
    prefs.selected_slugs = _serialize_slugs(selected_slugs)
    prefs.selected_slug = selected_slug
    prefs.updated_at = datetime.utcnow()
    session.add(prefs)
    session.commit()
    session.refresh(prefs)
    return prefs


def load_selected_slugs(prefs: UserPreference) -> List[str]:
    return _deserialize_slugs(prefs.selected_slugs)
