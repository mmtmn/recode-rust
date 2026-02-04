from typing import Optional, Tuple

from sqlmodel import Session

from app.domain.models import BestScore, UserProfile
from app.repositories import attempt_repo


class BestScoreResult(Tuple[Optional[BestScore], bool]):
    pass


def record_attempt(
    session: Session,
    user: UserProfile,
    lesson_id: int,
    duration_ms: int,
    is_correct: bool,
) -> tuple[Optional[BestScore], bool]:
    attempt_repo.add_attempt(session, user.id, lesson_id, duration_ms, is_correct)

    if not is_correct:
        return None, False

    best = attempt_repo.get_best_score(session, user.id, lesson_id)
    if best is None or duration_ms < best.best_duration_ms:
        best = attempt_repo.upsert_best_score(session, user.id, lesson_id, duration_ms)
        return best, True

    return best, False
