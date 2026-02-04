import { expect, test } from "@playwright/test";

test("editor layout is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Developer Syntax Studio")).toBeVisible();
  await expect(page.getByText("Playlist")).toBeVisible();
  await expect(page.getByText("Editor")).toBeVisible();
});
