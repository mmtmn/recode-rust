use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum Track {
    RustFoundations,
    AxumMastery,
}

impl Track {
    #[must_use]
    pub const fn label(self) -> &'static str {
        match self {
            Self::RustFoundations => "Rust Foundations",
            Self::AxumMastery => "Axum Mastery",
        }
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Difficulty {
    Beginner,
    Intermediate,
    Advanced,
}

#[derive(Clone, Debug)]
pub struct Source {
    pub label: &'static str,
    pub url: &'static str,
}

#[derive(Clone, Debug)]
pub struct CodeTask {
    pub prompt: &'static str,
    pub starter: &'static str,
    pub solution: &'static str,
    pub required: &'static [&'static str],
    pub hint: &'static str,
}

#[derive(Clone, Debug)]
pub struct Quiz {
    pub question: &'static str,
    pub choices: [&'static str; 3],
    pub answer: usize,
    pub explanation: &'static str,
}

#[derive(Clone, Debug)]
pub struct Lesson {
    pub id: &'static str,
    pub track: Track,
    pub unit: &'static str,
    pub title: &'static str,
    pub summary: &'static str,
    pub notes: &'static [&'static str],
    pub difficulty: Difficulty,
    pub minutes: u16,
    pub xp: u16,
    pub sources: &'static [Source],
    pub code: CodeTask,
    pub quiz: Quiz,
}

#[derive(Debug, Serialize)]
pub struct PublicSource {
    pub label: &'static str,
    pub url: &'static str,
}

#[derive(Debug, Serialize)]
pub struct PublicCodeTask {
    pub prompt: &'static str,
    pub starter: &'static str,
    pub hint: &'static str,
}

#[derive(Debug, Serialize)]
pub struct PublicQuiz {
    pub question: &'static str,
    pub choices: [&'static str; 3],
}

#[derive(Debug, Serialize)]
pub struct PublicLesson {
    pub id: &'static str,
    pub track: Track,
    pub track_label: &'static str,
    pub unit: &'static str,
    pub title: &'static str,
    pub summary: &'static str,
    pub notes: &'static [&'static str],
    pub difficulty: Difficulty,
    pub minutes: u16,
    pub xp: u16,
    pub sources: Vec<PublicSource>,
    pub code: PublicCodeTask,
    pub quiz: PublicQuiz,
}

impl From<&'static Lesson> for PublicLesson {
    fn from(lesson: &'static Lesson) -> Self {
        Self {
            id: lesson.id,
            track: lesson.track,
            track_label: lesson.track.label(),
            unit: lesson.unit,
            title: lesson.title,
            summary: lesson.summary,
            notes: lesson.notes,
            difficulty: lesson.difficulty,
            minutes: lesson.minutes,
            xp: lesson.xp,
            sources: lesson
                .sources
                .iter()
                .map(|source| PublicSource {
                    label: source.label,
                    url: source.url,
                })
                .collect(),
            code: PublicCodeTask {
                prompt: lesson.code.prompt,
                starter: lesson.code.starter,
                hint: lesson.code.hint,
            },
            quiz: PublicQuiz {
                question: lesson.quiz.question,
                choices: lesson.quiz.choices,
            },
        }
    }
}

#[derive(Debug, Serialize)]
pub struct CurriculumResponse {
    pub title: &'static str,
    pub description: &'static str,
    pub lesson_count: usize,
    pub activity_count: usize,
    pub total_xp: u32,
    pub lessons: Vec<PublicLesson>,
}

#[derive(Debug, Deserialize)]
pub struct CodeSubmission {
    pub code: String,
}

#[derive(Debug, Deserialize)]
pub struct QuizSubmission {
    pub choice: usize,
}

#[derive(Debug, Serialize)]
pub struct ValidationResponse {
    pub correct: bool,
    pub message: String,
    pub details: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub solution: Option<&'static str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub explanation: Option<&'static str>,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub service: &'static str,
    pub lessons: usize,
}
