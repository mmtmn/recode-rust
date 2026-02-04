from app.services.achievement_service import evaluate_unlocks


def test_unlocks_first_lesson():
    unlocked = evaluate_unlocks(completed_lessons=1, xp=10, streak=1, already_unlocked=[])
    assert "first_lesson" in unlocked


def test_does_not_unlock_twice():
    unlocked = evaluate_unlocks(completed_lessons=5, xp=600, streak=3, already_unlocked=["first_lesson", "five_lessons"])
    assert "first_lesson" not in unlocked
    assert "five_lessons" not in unlocked


def test_unlocks_multiple():
    unlocked = evaluate_unlocks(completed_lessons=5, xp=600, streak=3, already_unlocked=[])
    assert set(unlocked) == {"first_lesson", "five_lessons", "streak_3", "xp_500"}
