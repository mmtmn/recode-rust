import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import App from "./App";

vi.mock("./lib/api", () => {
  return {
    api: {
      listLanguages: () =>
        Promise.resolve([
          {
            id: 1,
            name: "Python",
            slug: "python",
            description: "Readable",
            color: "#000",
            icon: "snake"
          },
          {
            id: 2,
            name: "JavaScript",
            slug: "javascript",
            description: "Web",
            color: "#111",
            icon: "bolt"
          }
        ]),
      getProgress: () => Promise.resolve({ xp: 120, streak: 2, completed_lessons: 3 }),
      listAchievements: () =>
        Promise.resolve([
          { id: 1, key: "first_lesson", title: "First Steps", description: "", icon: "spark", points: 50 }
        ]),
      getLanguage: (slug: string) =>
        Promise.resolve({
          id: slug === "python" ? 1 : 2,
          name: slug === "python" ? "Python" : "JavaScript",
          slug,
          description: "Readable",
          color: "#000",
          icon: "snake",
          lessons: [
            {
              id: slug === "python" ? 1 : 2,
              title: "Hello World",
              summary: "",
              difficulty: "Beginner",
              order_index: 1,
              xp: 40
            }
          ]
        }),
      getLesson: () =>
        Promise.resolve({
          id: 1,
          title: "Hello World",
          summary: "",
          difficulty: "Beginner",
          order_index: 1,
          xp: 40,
          challenges: [
            {
              id: 10,
              title: "Hello World Challenge",
              prompt: "Print a greeting message.",
              starter_code: "",
              solution_code: "print('hello')",
              tests: "Verify output and syntax.",
              xp: 40
            }
          ]
        }),
      completeLesson: () => Promise.resolve({ progress: { xp: 160, streak: 2, completed_lessons: 4 }, new_achievements: [] }),
      validateChallenge: () => Promise.resolve({ is_valid: true, errors: [], new_best: false, best_duration_ms: 1200 }),
      listAttempts: () => Promise.resolve([]),
      listBestScores: () => Promise.resolve([])
    }
  };
});


describe("App", () => {
  it("renders header and playlist", async () => {
    render(<App />);
    expect(screen.getByText(/RECODE/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Playlist mode/i)).toBeInTheDocument();
    });
  });
});
