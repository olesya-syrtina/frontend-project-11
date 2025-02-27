import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:8080/',
    reuseExistingServer: !process.env.CI,
  },
});
