from typing import Dict, List


ACHIEVEMENT_RULES: Dict[str, str] = {
    "first_lesson": "complete_1",
    "five_lessons": "complete_5",
    "streak_3": "streak_3",
    "xp_500": "xp_500",
}


def evaluate_unlocks(
    completed_lessons: int,
    xp: int,
    streak: int,
    already_unlocked: List[str],
) -> List[str]:
    unlocked: List[str] = []

    if "first_lesson" not in already_unlocked and completed_lessons >= 1:
        unlocked.append("first_lesson")
    if "five_lessons" not in already_unlocked and completed_lessons >= 5:
        unlocked.append("five_lessons")
    if "streak_3" not in already_unlocked and streak >= 3:
        unlocked.append("streak_3")
    if "xp_500" not in already_unlocked and xp >= 500:
        unlocked.append("xp_500")

    return unlocked
