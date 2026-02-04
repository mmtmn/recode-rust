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
          }
        ]),
      getProgress: () => Promise.resolve({ xp: 120, streak: 2, completed_lessons: 3 }),
      listAchievements: () =>
        Promise.resolve([
          { id: 1, key: "first_lesson", title: "First Steps", description: "", icon: "spark", points: 50 }
        ]),
      getLanguage: () =>
        Promise.resolve({
          id: 1,
          name: "Python",
          slug: "python",
          description: "Readable",
          color: "#000",
          icon: "snake",
          lessons: [
            {
              id: 1,
              title: "Hello World",
              summary: "",
              difficulty: "Beginner",
              order_index: 1,
              xp: 40
            }
          ]
        }),
      completeLesson: () => Promise.resolve({ progress: { xp: 160, streak: 2, completed_lessons: 4 }, new_achievements: [] })
    }
  };
});


describe("App", () => {
  it("renders hero content", async () => {
    render(<App />);
    expect(screen.getByText(/SyntaxQuest Beta/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Python/i)).toBeInTheDocument();
    });
  });
});
