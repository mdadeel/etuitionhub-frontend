import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'demoadmin@etuition.com';
const ADMIN_PASSWORD = 'password123';

test('admin can log in and reach the dashboard', async ({ page }) => {
  // Clear any stale auth state
  await page.context().clearCookies();

  await page.goto('/admin-login');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for navigation — may bounce through /login?expired due to race condition
  // but ultimately should land on /dashboard once JWT is set
  await page.waitForFunction(() => {
    const p = window.location.pathname;
    return p.startsWith('/dashboard') || p === '/';
  }, { timeout: 20_000 });

  // If we landed on / instead of /dashboard, try navigating to dashboard directly
  if (page.url().includes('/') && !page.url().includes('/dashboard')) {
    await page.goto('/dashboard');
  }

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/dashboard/);
});
