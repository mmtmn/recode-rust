from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.domain import schemas
from app.domain.models import Achievement, Challenge, Lesson
from app.repositories import achievement_repo, challenge_repo, language_repo, lesson_repo, progress_repo
from app.services.progress_service import complete_lesson
from app.services.validation_service import validate_code

router = APIRouter(prefix="/api")


def _lesson_to_read(lesson: Lesson) -> schemas.LessonRead:
    return schemas.LessonRead(
        id=lesson.id,
        title=lesson.title,
        summary=lesson.summary,
        difficulty=lesson.difficulty,
        order_index=lesson.order_index,
        xp=lesson.xp,
    )


@router.get("/languages", response_model=list[schemas.LanguageRead])
def list_languages(session: Session = Depends(get_session)):
    languages = language_repo.list_languages(session)
    return [
        schemas.LanguageRead(
            id=lang.id,
            name=lang.name,
            slug=lang.slug,
            description=lang.description,
            color=lang.color,
            icon=lang.icon,
        )
        for lang in languages
    ]


@router.get("/languages/{slug}", response_model=schemas.LanguageDetail)
def get_language(slug: str, session: Session = Depends(get_session)):
    language = language_repo.get_language_by_slug(session, slug)
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")

    lessons = lesson_repo.list_lessons_by_language(session, language.id)
    return schemas.LanguageDetail(
        id=language.id,
        name=language.name,
        slug=language.slug,
        description=language.description,
        color=language.color,
        icon=language.icon,
        lessons=[_lesson_to_read(lesson) for lesson in lessons],
    )


@router.get("/lessons/{lesson_id}", response_model=schemas.LessonDetail)
def get_lesson_detail(lesson_id: int, session: Session = Depends(get_session)):
    lesson = lesson_repo.get_lesson(session, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    challenges = session.exec(select(Challenge).where(Challenge.lesson_id == lesson_id)).all()
    return schemas.LessonDetail(
        **_lesson_to_read(lesson).model_dump(),
        challenges=[
            schemas.ChallengeRead(
                id=challenge.id,
                title=challenge.title,
                prompt=challenge.prompt,
                starter_code=challenge.starter_code,
                tests=challenge.tests,
                xp=challenge.xp,
            )
            for challenge in challenges
        ],
    )


@router.get("/achievements", response_model=list[schemas.AchievementRead])
def list_achievements(session: Session = Depends(get_session)):
    achievements = achievement_repo.list_achievements(session)
    return [
        schemas.AchievementRead(
            id=achievement.id,
            key=achievement.key,
            title=achievement.title,
            description=achievement.description,
            icon=achievement.icon,
            points=achievement.points,
        )
        for achievement in achievements
    ]


@router.get("/progress", response_model=schemas.ProgressRead)
def get_progress(session: Session = Depends(get_session)):
    user = progress_repo.get_or_create_user(session)
    completed_lessons = progress_repo.count_completed_lessons(session, user.id)
    return schemas.ProgressRead(
        xp=user.xp,
        streak=user.streak,
        last_completed_at=user.last_completed_at,
        completed_lessons=completed_lessons,
    )


@router.post("/lessons/{lesson_id}/complete", response_model=schemas.CompletionResponse)
def complete_lesson_endpoint(lesson_id: int, session: Session = Depends(get_session)):
    user = progress_repo.get_or_create_user(session)
    lesson = lesson_repo.get_lesson(session, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    new_achievements = complete_lesson(session, user, lesson_id, lesson.xp)
    completed_lessons = progress_repo.count_completed_lessons(session, user.id)

    return schemas.CompletionResponse(
        progress=schemas.ProgressRead(
            xp=user.xp,
            streak=user.streak,
            last_completed_at=user.last_completed_at,
            completed_lessons=completed_lessons,
        ),
        new_achievements=[
            schemas.AchievementRead(
                id=achievement.id,
                key=achievement.key,
                title=achievement.title,
                description=achievement.description,
                icon=achievement.icon,
                points=achievement.points,
            )
            for achievement in new_achievements
        ],
    )


@router.post("/challenges/{challenge_id}/validate", response_model=schemas.ValidationResult)
def validate_challenge(
    challenge_id: int,
    payload: schemas.ValidationRequest,
    session: Session = Depends(get_session),
):
    context = challenge_repo.get_challenge_context(session, challenge_id)
    if not context:
        raise HTTPException(status_code=404, detail="Challenge not found")

    challenge, lesson, language = context
    errors = validate_code(language.slug, payload.code)

    return schemas.ValidationResult(is_valid=len(errors) == 0, errors=errors)
