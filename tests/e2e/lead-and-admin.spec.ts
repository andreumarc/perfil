import { expect, test } from "@playwright/test";

import { HAS_DB, dismissCookies } from "./helpers";

const SETUP_TOKEN = process.env.ADMIN_SETUP_TOKEN ?? "";
const ADMIN = { name: "E2E Admin", email: `e2e-admin-${Date.now()}@example.com`, password: "E2eContrasena-Segura-2026" };

test.describe("lead → panel (requiere DATABASE_URL)", () => {
  test.skip(!HAS_DB || !SETUP_TOKEN, "Sin DATABASE_URL o ADMIN_SETUP_TOKEN: pruebas de panel omitidas.");
  test.describe.configure({ mode: "serial" });

  test("el formulario de presupuesto crea una solicitud", async ({ page }) => {
    await page.goto("/presupuesto");
    await dismissCookies(page);
    await page.locator("#lf-name").fill("Cliente Prueba E2E");
    await page.locator("#lf-phone").fill("600123456");
    await page.locator("#lf-email").fill(`cliente-e2e-${Date.now()}@example.com`);
    await page.locator("#lf-message").fill("Solicitud de prueba automática (e2e).");
    await page.locator("#lf-privacy").click();
    await page.waitForTimeout(3200); // ventana mínima anti-bot
    await page.getByRole("button", { name: /pedir presupuesto/i }).click();
    await expect(page.getByRole("status")).toContainText(/solicitud recibida/i, { timeout: 20_000 });
  });

  test("setup del primer admin o login, y la solicitud aparece en el CRM", async ({ page }) => {
    await page.goto("/admin/setup");
    if (page.url().includes("/admin/setup") && (await page.locator("input[name=token]").count())) {
      await page.locator("input[name=token]").fill(SETUP_TOKEN);
      await page.locator("input[name=name]").fill(ADMIN.name);
      await page.locator("input[name=email]").fill(ADMIN.email);
      await page.locator("input[name=password]").fill(ADMIN.password);
      await page.getByRole("button", { name: /crear/i }).click();
      await expect(page).toHaveURL(/\/admin(\/login)?/);
    }
    if (!page.url().endsWith("/admin")) {
      await page.goto("/admin/login");
      await page.locator("input[name=email]").fill(process.env.E2E_ADMIN_EMAIL ?? ADMIN.email);
      await page.locator("input[name=password]").fill(process.env.E2E_ADMIN_PASSWORD ?? ADMIN.password);
      await page.getByRole("button", { name: /entrar|iniciar sesión/i }).click();
    }
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/leads");
    await expect(page.getByText("Cliente Prueba E2E").first()).toBeVisible();
  });

  test("un editor no puede entrar en usuarios ni ajustes", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input[name=email]").fill(process.env.E2E_EDITOR_EMAIL ?? "");
    test.skip(!process.env.E2E_EDITOR_EMAIL, "Sin E2E_EDITOR_EMAIL/E2E_EDITOR_PASSWORD.");
    await page.locator("input[name=password]").fill(process.env.E2E_EDITOR_PASSWORD ?? "");
    await page.getByRole("button", { name: /entrar|iniciar sesión/i }).click();
    await page.goto("/admin/usuarios");
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/ajustes");
    await expect(page).toHaveURL(/\/admin$/);
  });
});
