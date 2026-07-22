import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays board and initial columns', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Kanban Board' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'To Do' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Done' })).toBeVisible();
  });

  test('renames a column', async ({ page }) => {
    // Find the first column's edit button
    const firstColumn = page.locator('.column_module__column').first();
    // In CSS modules, the exact class name is hashed, so we'll select by text and role or aria-label
    const todoColumn = page.locator('div').filter({ has: page.locator('h2', { hasText: 'To Do' }) }).first();
    const editBtn = page.getByRole('button', { name: 'Edit column title' }).first();
    await editBtn.click();

    const input = page.locator('input').first();
    await input.fill('Backlog');
    await input.press('Enter');

    await expect(page.locator('h2').filter({ hasText: 'Backlog' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'To Do' })).toHaveCount(0);
  });
});
