use axum::{
    body::Body,
    http::{Request, Response, StatusCode, header},
};
use http_body_util::BodyExt;
use recode_rust::{app, curriculum::CURRICULUM};
use serde_json::{Value, json};
use tower::ServiceExt;

async fn send(request: Request<Body>) -> Response<Body> {
    app().oneshot(request).await.expect("router response")
}

async fn json_body(response: Response<Body>) -> Value {
    let bytes = response
        .into_body()
        .collect()
        .await
        .expect("collect response body")
        .to_bytes();
    serde_json::from_slice(&bytes).expect("JSON response")
}

fn get(uri: &str) -> Request<Body> {
    Request::builder()
        .uri(uri)
        .body(Body::empty())
        .expect("GET request")
}

fn post(uri: &str, body: &Value) -> Request<Body> {
    Request::post(uri)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(body.to_string()))
        .expect("POST request")
}

#[tokio::test]
async fn health_contract_reports_service_state_and_request_id() {
    let response = send(get("/api/health")).await;

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(response.headers()[header::CONTENT_TYPE], "application/json");
    assert!(response.headers().contains_key("x-request-id"));

    let body = json_body(response).await;
    assert_eq!(body["status"], "ok");
    assert_eq!(body["service"], "recode-rust");
    assert_eq!(body["lessons"], CURRICULUM.len());
}

#[tokio::test]
async fn curriculum_contract_has_consistent_totals_and_no_answers() {
    let response = send(get("/api/curriculum")).await;
    assert_eq!(response.status(), StatusCode::OK);

    let body = json_body(response).await;
    let expected_xp: u32 = CURRICULUM
        .iter()
        .map(|lesson| u32::from(lesson.xp) * 2)
        .sum();
    assert_eq!(body["lesson_count"], CURRICULUM.len());
    assert_eq!(body["activity_count"], CURRICULUM.len() * 2);
    assert_eq!(body["total_xp"], expected_xp);
    assert_eq!(
        body["lessons"].as_array().map(Vec::len),
        Some(CURRICULUM.len())
    );

    for lesson in body["lessons"].as_array().expect("lesson list") {
        assert!(lesson["code"].get("solution").is_none());
        assert!(lesson["code"].get("required").is_none());
        assert!(lesson["quiz"].get("answer").is_none());
        assert!(lesson["quiz"].get("explanation").is_none());
    }
}

#[tokio::test]
async fn lesson_contract_returns_one_public_lesson() {
    let fixture = &CURRICULUM[0];
    let response = send(get(&format!("/api/lessons/{}", fixture.id))).await;

    assert_eq!(response.status(), StatusCode::OK);
    let body = json_body(response).await;
    assert_eq!(body["id"], fixture.id);
    assert_eq!(body["title"], fixture.title);
    assert_eq!(body["quiz"]["choices"].as_array().map(Vec::len), Some(3));
}

#[tokio::test]
async fn unknown_lesson_returns_a_structured_404() {
    let response = send(get("/api/lessons/not-a-lesson")).await;

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
    assert_eq!(response.headers()[header::CONTENT_TYPE], "application/json");
    assert_eq!(
        json_body(response).await,
        json!({ "error": "lesson `not-a-lesson` was not found" })
    );
}

#[tokio::test]
async fn code_endpoint_covers_success_syntax_and_concept_failures() {
    let lesson = &CURRICULUM[0];
    let uri = format!("/api/lessons/{}/code", lesson.id);

    let accepted =
        json_body(send(post(&uri, &json!({ "code": lesson.code.solution }))).await).await;
    assert_eq!(accepted["correct"], true);
    assert!(accepted.get("solution").is_none());

    let invalid = json_body(send(post(&uri, &json!({ "code": "fn main( {" }))).await).await;
    assert_eq!(invalid["correct"], false);
    assert!(
        invalid["message"]
            .as_str()
            .is_some_and(|value| value.contains("syntax"))
    );
    assert_eq!(invalid["solution"], lesson.code.solution);

    let incomplete = json_body(send(post(&uri, &json!({ "code": "fn main() {}" }))).await).await;
    assert_eq!(incomplete["correct"], false);
    assert_eq!(
        incomplete["details"].as_array().map(Vec::len),
        Some(lesson.code.required.len() - 1)
    );
}

#[tokio::test]
async fn quiz_endpoint_covers_correct_incorrect_and_out_of_range_choices() {
    let lesson = &CURRICULUM[0];
    let uri = format!("/api/lessons/{}/quiz", lesson.id);

    let correct = json_body(send(post(&uri, &json!({ "choice": lesson.quiz.answer }))).await).await;
    assert_eq!(correct["correct"], true);
    assert_eq!(correct["explanation"], lesson.quiz.explanation);

    let incorrect_choice = (lesson.quiz.answer + 1) % lesson.quiz.choices.len();
    let incorrect = json_body(send(post(&uri, &json!({ "choice": incorrect_choice }))).await).await;
    assert_eq!(incorrect["correct"], false);
    assert_eq!(incorrect["explanation"], lesson.quiz.explanation);

    let out_of_range = json_body(send(post(&uri, &json!({ "choice": 99 }))).await).await;
    assert_eq!(out_of_range["correct"], false);
}

#[tokio::test]
async fn malformed_payloads_and_wrong_methods_are_rejected() {
    let lesson = &CURRICULUM[0];
    let malformed = Request::post(format!("/api/lessons/{}/quiz", lesson.id))
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from("{not-json"))
        .expect("malformed request");
    assert_eq!(send(malformed).await.status(), StatusCode::BAD_REQUEST);

    let missing_field = post(
        &format!("/api/lessons/{}/code", lesson.id),
        &json!({ "source": "fn main() {}" }),
    );
    assert_eq!(
        send(missing_field).await.status(),
        StatusCode::UNPROCESSABLE_ENTITY
    );

    let wrong_method = Request::delete(format!("/api/lessons/{}", lesson.id))
        .body(Body::empty())
        .expect("DELETE request");
    assert_eq!(
        send(wrong_method).await.status(),
        StatusCode::METHOD_NOT_ALLOWED
    );
}

#[tokio::test]
async fn static_site_and_spa_routes_are_served() {
    let index = send(get("/")).await;
    assert_eq!(index.status(), StatusCode::OK);
    assert!(
        index.headers()[header::CONTENT_TYPE]
            .to_str()
            .expect("content type")
            .starts_with("text/html")
    );

    let script = send(get("/app.js")).await;
    assert_eq!(script.status(), StatusCode::OK);
    assert!(
        script.headers()[header::CONTENT_TYPE]
            .to_str()
            .expect("content type")
            .contains("javascript")
    );

    let spa_route = send(get("/learn/rust-toolchain")).await;
    assert_eq!(spa_route.status(), StatusCode::OK);
    let body = spa_route
        .into_body()
        .collect()
        .await
        .expect("collect HTML")
        .to_bytes();
    assert!(String::from_utf8_lossy(&body).contains("recode-rust — Rust to Axum"));
}
