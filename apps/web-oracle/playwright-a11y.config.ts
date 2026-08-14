/**
 * Wave 7E Task 125: Accessibility Testing Configuration
 * Keyboard navigation, screen reader support, color contrast
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/a11y',
  fullyParallel: false, // Accessibility tests should run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for accessibility tests
  reporter: [
    ['html'],
    ['json', { outputFile: 'a11y-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    // Enable accessibility testing
    a11y: {
      strict: true,
      verbose: true
    }
  },
  projects: [
    {
      name: 'accessibility-chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
