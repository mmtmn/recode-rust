import { expect, test } from "@playwright/test";

test("homepage shows hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("SyntaxQuest Beta")).toBeVisible();
  await expect(page.getByText("Pick your syntax adventure")).toBeVisible();
});
