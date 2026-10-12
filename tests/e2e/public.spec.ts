import { expect, test } from "@playwright/test";

import { dismissCookies, expectNoA11yViolations } from "./helpers";

const PAGES = ["/", "/servicios", "/servicios/reformas-cocinas", "/sectores/restaurantes", "/proyectos", "/calculadoras", "/blog", "/presupuesto", "/contacto", "/zonas/barcelona", "/politica-cookies"];

test.describe("web pública", () => {
  for (const path of PAGES) {
    test(`renderiza ${path} con un único H1 y sin errores de accesibilidad graves`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await dismissCookies(page);
      await expect(page.locator("h1")).toHaveCount(1);
      await expectNoA11yViolations(page);
    });
  }

  test("todo visitante puede llegar al presupuesto en un clic desde la home", async ({ page }) => {
    await page.goto("/");
    await dismissCookies(page);
    await page.getByRole("link", { name: /pedir presupuesto/i }).first().click();
    await expect(page).toHaveURL(/\/presupuesto$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/presupuesto/i);
  });

  test("sitemap, robots y RSS responden", async ({ request }) => {
    for (const path of ["/sitemap.xml", "/robots.txt", "/rss.xml"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/calculadoras/reforma-integral");
  });

  test("las rutas inexistentes devuelven 404 y la página de error ofrece el presupuesto", async ({ page }) => {
    const response = await page.goto("/esta-ruta-no-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /pedir presupuesto/i })).toBeVisible();
  });
});
