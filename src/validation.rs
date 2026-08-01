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
        assert!(result.solution.is_none());
        assert!(result.explanation.is_none());
        assert_eq!(result.details.len(), 1);
    }

    #[test]
    fn ignores_whitespace_when_matching_required_concepts() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let result = validate_code(
            lesson,
            "fn\nmain () {\n    // greeting\n    println! ( \"Hello, Rust!\" );\n}\n",
        );

        assert!(result.correct);
    }

    #[test]
    fn rejects_invalid_rust_without_execution() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let result = validate_code(lesson, "fn main( {");
        assert!(!result.correct);
        assert!(result.message.contains("syntax"));
        assert!(!result.details.is_empty());
        assert_eq!(result.solution, Some(lesson.code.solution));
    }

    #[test]
    fn rejects_an_empty_submission_with_the_reference_solution() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let result = validate_code(lesson, "  \n\t");

        assert!(!result.correct);
        assert!(result.message.contains("Write a Rust solution"));
        assert!(result.details.is_empty());
        assert_eq!(result.solution, Some(lesson.code.solution));
    }

    #[test]
    fn reports_every_missing_target_concept() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let result = validate_code(lesson, "fn main() {}\n");

        assert!(!result.correct);
        assert_eq!(result.details.len(), 3);
        assert!(
            result
                .details
                .iter()
                .any(|detail| detail.contains("println!"))
        );
        assert!(
            result
                .details
                .iter()
                .any(|detail| detail.contains("Hello, Rust!"))
        );
    }

    #[test]
    fn grades_quizzes_by_choice_index() {
        let lesson = lesson_by_id("rust-hello").expect("fixture lesson");
        let correct = validate_quiz(lesson, lesson.quiz.answer);
        let incorrect = validate_quiz(lesson, (lesson.quiz.answer + 1) % 3);

        assert!(correct.correct);
        assert!(!incorrect.correct);
        assert_eq!(correct.explanation, Some(lesson.quiz.explanation));
        assert_eq!(incorrect.explanation, Some(lesson.quiz.explanation));
        assert!(correct.solution.is_none());
    }
}
