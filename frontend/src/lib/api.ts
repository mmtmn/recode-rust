export type Language = {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
};

export type Lesson = {
  id: number;
  title: string;
  summary: string;
  difficulty: string;
  order_index: number;
  xp: number;
};

export type Challenge = {
  id: number;
  title: string;
  prompt: string;
  starter_code: string;
  solution_code: string;
  tests: string;
  xp: number;
};

export type LanguageDetail = Language & { lessons: Lesson[] };

export type LessonDetail = Lesson & { challenges: Challenge[] };

export type Achievement = {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  points: number;
};

export type Progress = {
  xp: number;
  streak: number;
  last_completed_at?: string | null;
  completed_lessons: number;
};

export type CompletionResponse = {
  progress: Progress;
  new_achievements: Achievement[];
};

export type ValidationResult = {
  is_valid: boolean;
  errors: string[];
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const api = {
  listLanguages: () => fetchJson<Language[]>("/api/languages"),
  getLanguage: (slug: string) => fetchJson<LanguageDetail>(`/api/languages/${slug}`),
  getLesson: (lessonId: number) => fetchJson<LessonDetail>(`/api/lessons/${lessonId}`),
  listAchievements: () => fetchJson<Achievement[]>("/api/achievements"),
  getProgress: () => fetchJson<Progress>("/api/progress"),
  completeLesson: (lessonId: number) =>
    fetchJson<CompletionResponse>(`/api/lessons/${lessonId}/complete`, {
      method: "POST"
    }),
  validateChallenge: (challengeId: number, code: string) =>
    fetchJson<ValidationResult>(`/api/challenges/${challengeId}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })
};
