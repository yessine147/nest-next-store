import { test, expect } from "@playwright/test";

const password = "Password123!";

test("register, login, and see dashboard", async ({ page }) => {
  const email = `e2e+${Date.now()}@example.com`;

  // Register
  await page.goto("/register");
  await page.waitForLoadState("networkidle");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('input[type="password"]').nth(1).fill(password);
  await page.getByRole("button", { name: "Register" }).click();

  // After successful registration we should be redirected to login
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

  // Login
  await page.waitForLoadState("networkidle");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // Should land on dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  await expect(
    page.getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
});

test("create, view, and delete a product", async ({ page }) => {
  const email = `e2e-product+${Date.now()}@example.com`;
  const productName = `E2E Product ${Date.now()}`;

  // First register + login (reuse the same flow)
  await page.goto("/register");
  await page.waitForLoadState("networkidle");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('input[type="password"]').nth(1).fill(password);
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  await page.waitForLoadState("networkidle");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

  // Go to New Product
  await page.getByRole("button", { name: "New Product" }).click();
  await expect(page).toHaveURL(/\/products\/new/);
  await page.waitForLoadState("networkidle");

  // Fill product form (without image for simplicity)
  await page.locator('input[type="text"]').first().fill(productName);
  await page.locator('textarea').fill("E2E test product");
  await page.locator('input[type="number"]').fill("19.99");
  await page.getByRole("button", { name: "Create product" }).click();

  // Back on dashboard, product should be visible
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  const card = page.getByRole("heading", { name: productName });
  await expect(card).toBeVisible({ timeout: 10000 });

  // Open view page via clicking the title
  await card.click();
  await expect(page).toHaveURL(/\/products\/\d+$/, { timeout: 10000 });
  await expect(
    page.getByRole("heading", { name: productName }),
  ).toBeVisible();

  // Delete product
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
});

