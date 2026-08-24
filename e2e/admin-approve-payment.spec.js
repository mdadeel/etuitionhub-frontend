import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@etuition.com';
const ADMIN_PASSWORD = 'adeel1212';

test('admin can log in and reach the dashboard', async ({ page }) => {
  // Clear any stale auth state
  await page.context().clearCookies();

  await page.goto('/admin-login');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  // A super_admin (globalRole === 'super_admin') lands in the admin app.
  await page.waitForURL('**/super-admin**', { timeout: 20_000 });

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/super-admin/);
});
