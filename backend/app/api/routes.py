from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.domain import schemas
from app.domain.models import Achievement, Challenge, Lesson
from app.repositories import (
    achievement_repo,
    attempt_repo,
    challenge_repo,
    language_repo,
    lesson_repo,
    preferences_repo,
    progress_repo,
)
from app.services.attempt_service import record_attempt
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
                solution_code=challenge.solution_code,
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


def _build_language_preferences(session: Session, prefs) -> schemas.LanguagePreferenceRead:
    languages = language_repo.list_languages(session)
    slugs_ordered = [language.slug for language in languages]
    available = set(slugs_ordered)

    playlist_mode = prefs.playlist_mode if prefs.playlist_mode in {"all", "multi"} else "multi"
    selected_slug = prefs.selected_slug if prefs.selected_slug in available else None

    if playlist_mode == "all":
        if not slugs_ordered:
            return schemas.LanguagePreferenceRead(playlist_mode="all", selected_slugs=[], selected_slug=None)
        if not selected_slug:
            selected_slug = slugs_ordered[0]
        ordered = [selected_slug] + [slug for slug in slugs_ordered if slug != selected_slug]
        return schemas.LanguagePreferenceRead(
            playlist_mode="all",
            selected_slugs=ordered,
            selected_slug=selected_slug,
        )

    stored_slugs = preferences_repo.load_selected_slugs(prefs)
    filtered = [slug for slug in stored_slugs if slug in available]
    if not filtered and slugs_ordered:
        fallback = selected_slug or slugs_ordered[0]
        filtered = [fallback]
    if filtered and selected_slug not in filtered:
        selected_slug = filtered[0]
    return schemas.LanguagePreferenceRead(
        playlist_mode="multi",
        selected_slugs=filtered,
        selected_slug=selected_slug,
    )


@router.get("/preferences/languages", response_model=schemas.LanguagePreferenceRead)
def get_language_preferences(session: Session = Depends(get_session)):
    user = progress_repo.get_or_create_user(session)
    prefs = preferences_repo.get_or_create_preferences(session, user.id)
    return _build_language_preferences(session, prefs)


@router.put("/preferences/languages", response_model=schemas.LanguagePreferenceRead)
def set_language_preferences(
    payload: schemas.LanguagePreferenceWrite,
    session: Session = Depends(get_session),
):
    if payload.playlist_mode not in {"all", "multi"}:
        raise HTTPException(status_code=400, detail="Invalid playlist mode")
    user = progress_repo.get_or_create_user(session)
    languages = language_repo.list_languages(session)
    slugs_ordered = [language.slug for language in languages]
    available = set(slugs_ordered)

    selected_slug = payload.selected_slug if payload.selected_slug in available else None
    filtered_slugs = [slug for slug in payload.selected_slugs if slug in available]

    if payload.playlist_mode == "all":
        if not selected_slug:
            if filtered_slugs:
                selected_slug = filtered_slugs[0]
            elif slugs_ordered:
                selected_slug = slugs_ordered[0]
        stored_slugs: list[str] = []
    else:
        if not filtered_slugs and selected_slug:
            filtered_slugs = [selected_slug]
        if not filtered_slugs and slugs_ordered:
            filtered_slugs = [slugs_ordered[0]]
        if filtered_slugs and selected_slug not in filtered_slugs:
            selected_slug = filtered_slugs[0]
        stored_slugs = filtered_slugs

    prefs = preferences_repo.update_preferences(
        session,
        user.id,
        payload.playlist_mode,
        stored_slugs,
        selected_slug,
    )
    return _build_language_preferences(session, prefs)


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
    errors = validate_code(language.slug, payload.code, challenge.solution_code, challenge.tests)

    return schemas.ValidationResult(is_valid=len(errors) == 0, errors=errors)


@router.post("/challenges/{challenge_id}/submit", response_model=schemas.ValidationResult)
def submit_challenge(
    challenge_id: int,
    payload: schemas.SubmissionRequest,
    session: Session = Depends(get_session),
):
    context = challenge_repo.get_challenge_context(session, challenge_id)
    if not context:
        raise HTTPException(status_code=404, detail="Challenge not found")

    challenge, lesson, language = context
    errors = validate_code(language.slug, payload.code, challenge.solution_code, challenge.tests)
    is_valid = len(errors) == 0
    user = progress_repo.get_or_create_user(session)
    best, new_best = record_attempt(session, user, lesson.id, payload.duration_ms, is_valid)

    return schemas.ValidationResult(
        is_valid=is_valid,
        errors=errors,
        new_best=new_best,
        best_duration_ms=best.best_duration_ms if best else None,
    )


@router.get("/stats/attempts", response_model=list[schemas.AttemptRead])
def list_attempts(languages: str | None = None, session: Session = Depends(get_session)):
    user = progress_repo.get_or_create_user(session)
    slugs = [slug.strip() for slug in languages.split(",")] if languages else None
    rows = attempt_repo.list_attempts(session, user.id, slugs)
    return [
        schemas.AttemptRead(
            lesson_id=lesson.id,
            lesson_title=lesson.title,
            language_slug=language.slug,
            language_name=language.name,
            duration_ms=attempt.duration_ms,
            is_correct=attempt.is_correct,
            created_at=attempt.created_at.isoformat(),
        )
        for attempt, lesson, language in rows
    ]


@router.get("/stats/best", response_model=list[schemas.BestScoreRead])
def list_best_scores(languages: str | None = None, session: Session = Depends(get_session)):
    user = progress_repo.get_or_create_user(session)
    slugs = [slug.strip() for slug in languages.split(",")] if languages else None
    rows = attempt_repo.list_best_scores(session, user.id, slugs)
    return [
        schemas.BestScoreRead(
            lesson_id=lesson.id,
            lesson_title=lesson.title,
            language_slug=language.slug,
            language_name=language.name,
            best_duration_ms=best.best_duration_ms,
            achieved_at=best.achieved_at.isoformat(),
        )
        for best, lesson, language in rows
    ]
