import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'e2estudent@test.com';
const STUDENT_PASSWORD = 'password123';

test('student can log in and reach the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', STUDENT_EMAIL);
  await page.fill('input[type="password"]', STUDENT_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15_000 });
  await expect(page).toHaveURL(/dashboard/);
});
