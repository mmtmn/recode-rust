from datetime import date
from typing import List, Optional

from pydantic import BaseModel


class LessonRead(BaseModel):
    id: int
    title: str
    summary: str
    difficulty: str
    order_index: int
    xp: int


class LanguageRead(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    color: str
    icon: str


class LanguageDetail(LanguageRead):
    lessons: List[LessonRead]


class ChallengeRead(BaseModel):
    id: int
    title: str
    prompt: str
    starter_code: str
    tests: str
    xp: int


class LessonDetail(LessonRead):
    challenges: List[ChallengeRead]


class AchievementRead(BaseModel):
    id: int
    key: str
    title: str
    description: str
    icon: str
    points: int


class ProgressRead(BaseModel):
    xp: int
    streak: int
    last_completed_at: Optional[date]
    completed_lessons: int


class CompletionResponse(BaseModel):
    progress: ProgressRead
    new_achievements: List[AchievementRead]


class ValidationRequest(BaseModel):
    code: str


class ValidationResult(BaseModel):
    is_valid: bool
    errors: List[str]
