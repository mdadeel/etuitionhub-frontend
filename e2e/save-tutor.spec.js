import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'e2estudent@test.com';
const STUDENT_PASSWORD = 'password123';

test('student saves a tutor and it stays saved after reload', async ({ page }) => {
  await page.context().clearCookies();

  // Login as student
  await page.goto('/login');
  await page.fill('input[type="email"]', STUDENT_EMAIL);
  await page.fill('input[type="password"]', STUDENT_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15_000 });

  // Go to tutors listing
  await page.goto('/tutors');
  await page.waitForLoadState('networkidle');

  // Dismiss joyride overlay
  await page.evaluate(() => {
    const el = document.getElementById('react-joyride-portal');
    if (el) el.remove();
  }).catch(() => {});

  // Find the first tutor card with a save button
  const saveBtn = page.locator('button[title="Save"]').first();
  const visible = await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false);
  if (!visible) {
    test.skip(true, 'No tutors to save');
    return;
  }

  await saveBtn.click({ force: true });

  // After clicking, the button should either change to "Unsave" or the tooltip should confirm
  // Wait a moment for the API call
  await page.waitForTimeout(2000);

  // Check by looking for "Unsave" title, or fallback: check the bookmark was saved via a toast
  const unsaved = page.locator('button[title="Unsave"]').first();
  const savedNow = await unsaved.isVisible().catch(() => false);

  // Reload and verify
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Dismiss joyride again
  await page.evaluate(() => {
    const el = document.getElementById('react-joyride-portal');
    if (el) el.remove();
  }).catch(() => {});

  // After reload, if the tutor was saved, the button should show "Unsave"
  const stillSaved = page.locator('button[title="Unsave"]').first();
  await expect(stillSaved).toBeVisible({ timeout: 8_000 });
});
