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
