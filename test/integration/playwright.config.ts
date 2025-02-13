import { PlaywrightTestConfig, devices } from '@playwright/test';

process.env.BROWSER = 'none';

const config: PlaywrightTestConfig<{ toolpadDev: boolean }> = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  testMatch: /.*.spec.[jt]sx?$/,
  workers: 1,
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000/',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
};

export default config;
