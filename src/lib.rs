pub mod curriculum;
pub mod domain;
pub mod validation;

use std::time::Duration;

use axum::{
    Json, Router,
    extract::Path,
    http::{HeaderName, StatusCode, header},
    response::IntoResponse,
    routing::{get, post},
};
use curriculum::{CURRICULUM, lesson_by_id};
use domain::{
    CodeSubmission, CurriculumResponse, HealthResponse, PublicLesson, QuizSubmission,
    ValidationResponse,
};
use serde::Serialize;
use tower_http::{
    compression::CompressionLayer,
    request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer},
    sensitive_headers::SetSensitiveRequestHeadersLayer,
    services::{ServeDir, ServeFile},
    timeout::TimeoutLayer,
    trace::TraceLayer,
};
use validation::{validate_code, validate_quiz};

pub fn app() -> Router {
    let request_id = HeaderName::from_static("x-request-id");
    let api = Router::new()
        .route("/health", get(health))
        .route("/curriculum", get(curriculum))
        .route("/lessons/{id}", get(lesson))
        .route("/lessons/{id}/code", post(check_code))
        .route("/lessons/{id}/quiz", post(check_quiz));

    let files = ServeDir::new("web").fallback(ServeFile::new("web/index.html"));

    Router::new()
        .nest("/api", api)
        .fallback_service(files)
        .layer(TimeoutLayer::with_status_code(
            StatusCode::REQUEST_TIMEOUT,
            Duration::from_secs(15),
        ))
        .layer(CompressionLayer::new().gzip(true))
        .layer(PropagateRequestIdLayer::new(request_id.clone()))
        .layer(SetRequestIdLayer::new(request_id, MakeRequestUuid))
        .layer(SetSensitiveRequestHeadersLayer::new([
            header::AUTHORIZATION,
            header::COOKIE,
        ]))
        .layer(TraceLayer::new_for_http())
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        service: "recode-rust",
        lessons: CURRICULUM.len(),
    })
}

async fn curriculum() -> Json<CurriculumResponse> {
    Json(CurriculumResponse {
        title: "Rust to Axum",
        description: "Two tracks, one path: own the language, then own the service stack.",
        lesson_count: CURRICULUM.len(),
        activity_count: CURRICULUM.len() * 2,
        total_xp: CURRICULUM
            .iter()
            .map(|lesson| u32::from(lesson.xp) * 2)
            .sum(),
        lessons: CURRICULUM.iter().map(PublicLesson::from).collect(),
    })
}

async fn lesson(Path(id): Path<String>) -> Result<Json<PublicLesson>, ApiError> {
    lesson_by_id(&id)
        .map(PublicLesson::from)
        .map(Json)
        .ok_or_else(|| ApiError::not_found(&id))
}

async fn check_code(
    Path(id): Path<String>,
    Json(submission): Json<CodeSubmission>,
) -> Result<Json<ValidationResponse>, ApiError> {
    let lesson = lesson_by_id(&id).ok_or_else(|| ApiError::not_found(&id))?;
    Ok(Json(validate_code(lesson, &submission.code)))
}

async fn check_quiz(
    Path(id): Path<String>,
    Json(submission): Json<QuizSubmission>,
) -> Result<Json<ValidationResponse>, ApiError> {
    let lesson = lesson_by_id(&id).ok_or_else(|| ApiError::not_found(&id))?;
    Ok(Json(validate_quiz(lesson, submission.choice)))
}

#[derive(Debug, Serialize)]
struct ErrorBody {
    error: String,
}

#[derive(Debug)]
struct ApiError {
    status: StatusCode,
    message: String,
}

impl ApiError {
    fn not_found(id: &str) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            message: format!("lesson `{id}` was not found"),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (
            self.status,
            Json(ErrorBody {
                error: self.message,
            }),
        )
            .into_response()
    }
}

#[cfg(test)]
mod tests {
    use axum::{
        body::Body,
        http::{Request, StatusCode},
    };
    use http_body_util::BodyExt;
    use serde_json::{Value, json};
    use tower::ServiceExt;

    use super::{app, curriculum::CURRICULUM};

    #[tokio::test]
    async fn health_reports_the_curriculum_size() {
        let response = app()
            .oneshot(
                Request::builder()
                    .uri("/api/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let payload: Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(payload["lessons"], CURRICULUM.len());
    }

    #[tokio::test]
    async fn public_curriculum_does_not_leak_answers() {
        let response = app()
            .oneshot(
                Request::builder()
                    .uri("/api/curriculum")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        let body = response.into_body().collect().await.unwrap().to_bytes();
        let payload: Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(payload["lesson_count"], CURRICULUM.len());
        assert!(payload["lessons"][0]["code"].get("solution").is_none());
        assert!(payload["lessons"][0]["quiz"].get("answer").is_none());
    }

    #[tokio::test]
    async fn quiz_endpoint_grades_a_submission() {
        let lesson = &CURRICULUM[0];
        let response = app()
            .oneshot(
                Request::post(format!("/api/lessons/{}/quiz", lesson.id))
                    .header("content-type", "application/json")
                    .body(Body::from(
                        json!({ "choice": lesson.quiz.answer }).to_string(),
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let payload: Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(payload["correct"], true);
    }

    #[tokio::test]
    async fn missing_lesson_returns_json_404() {
        let response = app()
            .oneshot(
                Request::builder()
                    .uri("/api/lessons/not-real")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);
        assert_eq!(
            response.headers().get("content-type").unwrap(),
            "application/json"
        );
    }
}
