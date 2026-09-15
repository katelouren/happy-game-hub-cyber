import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/accessibility',
  timeout: 60000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3107',
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {},
  },
  webServer: { command: 'npm run start -- --port 3107', url: 'http://localhost:3107', reuseExistingServer: false },
});
