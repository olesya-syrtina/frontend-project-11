import { test, expect } from '@playwright/test';

const validFeedUrl = 'https://lorem-rss.hexlet.app/feed';
const invalidUrl = 'invalid-url';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Проверка успешного добавления RSS', async ({ page }) => {
  await page.fill('input[name="url"]', validFeedUrl);
  await page.click('button[type="submit"]');

  await expect(page.locator('h2', { hasText: 'Фиды' })).toBeVisible({ timeout: 6000 });
  await expect(page.locator('h2', { hasText: 'Посты' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Просмотр' }).first()).toBeVisible();
});

test('Проверка ошибки пустого поля', async ({ page }) => {
  await page.fill('input[name="url"]', '');
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('Поле не должно быть пустым');
});

test('Проверка ошибки невалидного URL', async ({ page }) => {
  await page.fill('input[name="url"]', invalidUrl);
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('Некорректный URL');
});

test('Проверка ошибки дублирования RSS', async ({ page }) => {
  await page.fill('input[name="url"]', validFeedUrl);
  await page.click('button[type="submit"]');
  await expect(page.locator('h2', { hasText: 'Фиды' })).toBeVisible({ timeout: 6000 });
  await page.fill('input[name="url"]', validFeedUrl);
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('RSS уже добавлен');
});

test('Проверка модального окна предпросмотра', async ({ page }) => {
  await page.fill('input[name="url"]', validFeedUrl);
  await page.click('button[type="submit"]');
  await expect(page.locator('h2', { hasText: 'Посты' })).toBeVisible({ timeout: 6000 });
  const previewButton = page.locator('button', { hasText: 'Просмотр' }).first();
  await previewButton.click();

  const modal = page.locator('#modal');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-title')).not.toHaveText('');
  await expect(modal.locator('.modal-body')).not.toHaveText('');
});

test('Проверка ошибки сети', async ({ page }) => {
  await page.route('**/get**', (route) => {
    route.fulfill({
      status: 500,
      body: 'Internal Server Error',
    });
  });

  await page.fill('input[name="url"]', validFeedUrl);
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('Произошла ошибка');
});
