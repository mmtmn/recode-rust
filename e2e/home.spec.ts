import { expect, test } from "@playwright/test";

test("editor layout is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Syntax Lab")).toBeVisible();
  await expect(page.getByText("Playlist")).toBeVisible();
});
