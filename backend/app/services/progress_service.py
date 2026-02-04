from datetime import datetime
from typing import List

from sqlmodel import Session

from app.domain.models import Achievement, UserProfile
from app.repositories import achievement_repo, progress_repo
from app.services.achievement_service import evaluate_unlocks


def _update_streak(user: UserProfile, completed_at: datetime) -> None:
    if user.last_completed_at is None:
        user.streak = 1
        user.last_completed_at = completed_at.date()
        return

    last_date = user.last_completed_at
    current_date = completed_at.date()

    if current_date == last_date:
        return

    if (current_date - last_date).days == 1:
        user.streak += 1
    else:
        user.streak = 1

    user.last_completed_at = current_date


def complete_lesson(session: Session, user: UserProfile, lesson_id: int, xp_award: int) -> List[Achievement]:
    if progress_repo.has_completed_lesson(session, user.id, lesson_id):
        return []

    progress_repo.add_completion(session, user.id, lesson_id)

    user.xp += xp_award
    _update_streak(user, datetime.utcnow())
    session.add(user)
    session.commit()
    session.refresh(user)

    completed_count = progress_repo.count_completed_lessons(session, user.id)
    unlocked_keys = achievement_repo.list_user_achievement_keys(session, user.id)
    new_keys = evaluate_unlocks(completed_count, user.xp, user.streak, unlocked_keys)

    if not new_keys:
        return []

    achievements = achievement_repo.get_achievements_by_keys(session, new_keys)
    for achievement in achievements:
        progress_repo.add_user_achievement(session, user.id, achievement.id)

    return achievements
