import { expect, test } from "@playwright/test";

test("editor layout is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("RECODE")).toBeVisible();
  await expect(page.getByText("Playlist mode")).toBeVisible();
  await expect(page.getByText("Editor")).toBeVisible();
  await expect(page.getByText("Timer")).toBeVisible();
});
