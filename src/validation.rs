use crate::domain::{Lesson, ValidationResponse};

#[must_use]
pub fn validate_code(lesson: &'static Lesson, code: &str) -> ValidationResponse {
    let code = code.trim();
    if code.is_empty() {
        return failure(lesson, "Write a Rust solution before checking it.", vec![]);
    }

    if let Err(error) = syn::parse_file(code) {
        return failure(
            lesson,
            "The snippet is not valid Rust syntax yet.",
            vec![error.to_string()],
        );
    }

    let normalized = normalize(code);
    let missing: Vec<String> = lesson
        .code
        .required
        .iter()
        .filter(|token| !normalized.contains(&normalize(token)))
        .map(|token| format!("Use `{token}` in the solution."))
        .collect();

    if !missing.is_empty() {
        return failure(
            lesson,
            "The syntax parses, but the lesson's target concepts are still missing.",
            missing,
        );
    }

    ValidationResponse {
        correct: true,
        message: "Valid Rust, and the target concepts are present.".to_owned(),
        details: vec![
            "Code is parsed only; it is never compiled or executed by the server.".to_owned(),
        ],
        solution: None,
        explanation: None,
    }
}

#[must_use]
pub fn validate_quiz(lesson: &'static Lesson, choice: usize) -> ValidationResponse {
    let correct = choice == lesson.quiz.answer;
    ValidationResponse {
        correct,
        message: if correct {
            "Correct. That distinction matters in real Rust services.".to_owned()
        } else {
            "Not quite. Use the explanation to tighten the mental model.".to_owned()
        },
        details: vec![],
        solution: None,
        explanation: Some(lesson.quiz.explanation),
    }
}

fn failure(
    lesson: &'static Lesson,
    message: impl Into<String>,
    details: Vec<String>,
) -> ValidationResponse {
    ValidationResponse {
        correct: false,
        message: message.into(),
        details,
        solution: Some(lesson.code.solution),
        explanation: None,
    }
}

fn normalize(value: &str) -> String {
    value
        .chars()
        .filter(|character| !character.is_whitespace())
        .collect()
}

#[cfg(test)]
mod tests {
    use crate::curriculum::lesson_by_id;

    use super::{validate_code, validate_quiz};

    #[test]
    fn accepts_a_valid_solution_with_required_concepts() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let result = validate_code(lesson, lesson.code.solution);
        assert!(result.correct);
    }

    #[test]
    fn rejects_invalid_rust_without_execution() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let result = validate_code(lesson, "fn main( {");
        assert!(!result.correct);
        assert!(result.message.contains("syntax"));
    }

    #[test]
    fn grades_quizzes_by_choice_index() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        assert!(validate_quiz(lesson, lesson.quiz.answer).correct);
        assert!(!validate_quiz(lesson, (lesson.quiz.answer + 1) % 3).correct);
    }
}
