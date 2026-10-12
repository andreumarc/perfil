import { expect, test } from "@playwright/test";

import { dismissCookies } from "./helpers";

test("la calculadora de reforma integral recalcula en vivo y precarga el formulario", async ({ page }) => {
  await page.goto("/calculadoras/reforma-integral");
  await dismissCookies(page);
  const summary = page.getByText(/^Estimación entre/);
  const before = await summary.textContent();
  const m2 = page.locator("#calc-reforma-integral-m2");
  await m2.fill("120");
  await expect(summary).not.toHaveText(before ?? "");
  await expect(page.getByText(/Obra general y acabados/)).toBeVisible();
  await page.getByRole("link", { name: /pedir presupuesto con estos datos/i }).click();
  await expect(page.locator("#presupuesto-calculadora")).toBeInViewport();
  await expect(page.locator("#presupuesto-calculadora")).toContainText("120 m²");
});

test("la calculadora de pintura muestra la superficie estimada", async ({ page }) => {
  await page.goto("/calculadoras/pintura");
  await dismissCookies(page);
  await expect(page.getByText(/Superficie estimada de paredes y techos/)).toBeVisible();
});
