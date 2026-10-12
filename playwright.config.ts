import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;
const chromePath = process.env.CHROME_PATH;

/**
 * E2E: arranca el build de producción y prueba la web pública, el banner de
 * cookies, las calculadoras y (si hay DATABASE_URL) el flujo lead → panel.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    locale: "es-ES",
    ...(chromePath ? { launchOptions: { executablePath: chromePath } } : {}),
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /public\.spec\.ts/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && npx next start -p ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
        // El servidor usa la misma BD que el runner: si el runner no tiene
        // DATABASE_URL, el servidor tampoco (evita que .env.local apunte a una
        // Neon inalcanzable y devuelva 404 en las páginas de contenido).
        env: {
          PORT: String(port),
          NEXT_PUBLIC_SITE_URL: baseURL,
          DATABASE_URL: process.env.DATABASE_URL ?? "",
          ADMIN_SETUP_TOKEN: process.env.ADMIN_SETUP_TOKEN ?? "",
        },
      },
});
