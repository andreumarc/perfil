import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export const HAS_DB = Boolean(process.env.DATABASE_URL);

/** Acepta el banner de cookies si aparece (no bloquea el resto de pruebas). */
export async function dismissCookies(page: Page) {
  const reject = page.getByRole("button", { name: /rechazar/i }).first();
  if (await reject.isVisible().catch(() => false)) await reject.click();
}

/** Auditoría de accesibilidad WCAG 2.x AA con axe: sin violaciones graves ni críticas. */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodos)`).join("\n")).toEqual([]);
}

/** Recorre la página para disparar las animaciones de entrada y espera a que todo sea visible (axe mide colores con la opacidad aplicada). */
export async function settleReveals(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).every((el) => getComputedStyle(el).opacity === "1"), undefined, { timeout: 10_000 }).catch(() => undefined);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}
