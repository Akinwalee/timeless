import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3110", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `${process.env.PLAYWRIGHT_SKIP_BUILD ? "" : "npm run build && "}npm run start -- --hostname 127.0.0.1 --port 3110`,
    url: "http://127.0.0.1:3110/api/health",
    timeout: 180000,
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_SANITY_PROJECT_ID: "", NEXT_PUBLIC_WHATSAPP_NUMBER: "15555550123", NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST000000", NEXT_PUBLIC_ANALYTICS_ENABLED: "true", BREVO_API_KEY: "", NEXT_PUBLIC_SENTRY_DSN: "", SENTRY_DSN: "", NEXT_TELEMETRY_DISABLED: "1" },
  },
});
