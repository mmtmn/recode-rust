import { expect, test } from "@playwright/test";

const firstLesson = {
  id: "rust-toolchain",
  title: "Rustup, rustc, and Cargo",
  solution: 'fn main() {\n    println!("cargo check");\n}',
  correctQuizChoice: "Package management plus build/test tooling",
  xp: 40,
};

test("loads the complete curriculum without browser errors", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page.locator("#lesson-content")).toBeVisible();
  await expect(page.locator("#lesson-title")).toHaveText(firstLesson.title);
  await expect(page.locator("#activity-count")).toHaveText("148");
  await expect(page.locator("#lesson-position")).toHaveText("Lesson 1 of 74");
  await expect(page.locator(".nav-lesson")).toHaveCount(74);
  await expect(page.locator(".safe-badge")).toContainText("safe parser");
  expect(pageErrors).toEqual([]);
});

test("searches, filters, selects, and deep-links lessons", async ({ page }) => {
  await page.goto("/");

  await page.locator("#lesson-search").fill("WebSocket upgrades");
  await expect(page.locator(".nav-lesson")).toHaveCount(1);
  await page.locator(".nav-lesson").click();
  await expect(page.locator("#lesson-title")).toHaveText(
    "WebSocket upgrades and split streams",
  );
  await expect(page).toHaveURL(/#axum-websockets$/);

  await page.goto("/#axum-routing");
  await expect(page.locator("#lesson-title")).toHaveText(
    "MethodRouter and route composition",
  );

  await page.locator("#lesson-search").clear();
  await page.locator('[data-track="axum-mastery"]').first().click();
  expect(await page.locator(".nav-lesson").count()).toBeGreaterThan(30);
  await expect(page.locator(".nav-lesson").first()).toContainText(
    "The Axum dependency stack",
  );
});

test("completes code and quiz activities and persists progress", async ({ page }) => {
  await page.goto(`/#${firstLesson.id}`);

  await page.locator("#code-editor").fill(firstLesson.solution);
  await page.locator("#check-code").click();
  await expect(page.locator("#code-feedback")).toHaveClass(/success/);
  await expect(page.locator("#code-feedback")).toContainText(
    "Valid Rust, and the target concepts are present.",
  );
  await expect(page.locator("#completed-count")).toHaveText("1");
  await expect(page.locator("#earned-xp")).toHaveText(String(firstLesson.xp));

  await page.locator("#quiz-tab").click();
  await page
    .locator(".quiz-choice")
    .filter({ hasText: firstLesson.correctQuizChoice })
    .click();
  await page.locator("#check-quiz").click();
  await expect(page.locator("#quiz-feedback")).toHaveClass(/success/);
  await expect(page.locator("#completed-count")).toHaveText("2");
  await expect(page.locator("#earned-xp")).toHaveText(
    String(firstLesson.xp * 2),
  );

  await page.reload();
  await expect(page.locator("#completed-count")).toHaveText("2");
  await expect(page.locator("#code-tab")).toHaveClass(/complete/);
  await expect(page.locator("#quiz-tab")).toHaveClass(/complete/);

  const progress = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("recode-rust-progress-v1")),
  );
  expect(Object.keys(progress.completed).sort()).toEqual([
    `${firstLesson.id}:code`,
    `${firstLesson.id}:quiz`,
  ]);
});

test("shows useful validation feedback and lets the learner recover", async ({
  page,
}) => {
  await page.goto(`/#${firstLesson.id}`);

  await page.locator("#code-editor").fill("fn main( {");
  await page.locator("#check-code").click();
  await expect(page.locator("#code-feedback")).toHaveClass(/error/);
  await expect(page.locator("#code-feedback")).toContainText(
    "The snippet is not valid Rust syntax yet.",
  );
  await expect(page.locator("#code-feedback details")).toContainText(
    "Compare with one reference solution",
  );
  await expect(page.locator("#completed-count")).toHaveText("0");

  await page.locator("#code-editor").fill(firstLesson.solution);
  await page.locator("#check-code").click();
  await expect(page.locator("#code-feedback")).toHaveClass(/success/);
  await expect(page.locator("#completed-count")).toHaveText("1");
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, selects a lesson, and closes the course drawer", async ({ page }) => {
    await page.goto("/");

    await page.locator("#open-nav").click();
    await expect(page.locator("#sidebar")).toHaveClass(/open/);
    await expect(page.locator("#nav-scrim")).toBeVisible();

    await page.locator("#lesson-search").fill("WebSocket upgrades");
    await page.locator(".nav-lesson").click();
    await expect(page.locator("#lesson-title")).toHaveText(
      "WebSocket upgrades and split streams",
    );
    await expect(page.locator("#sidebar")).not.toHaveClass(/open/);
    await expect(page.locator("#nav-scrim")).toBeHidden();
  });
});
