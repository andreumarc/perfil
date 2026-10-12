import { expect, test } from "@playwright/test";

test("el banner de cookies bloquea scripts de terceros hasta aceptar y recuerda la decisión", async ({ page }) => {
  const thirdParty: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (/googletagmanager|google-analytics|connect\.facebook\.net/.test(url)) thirdParty.push(url);
  });
  await page.goto("/");
  const banner = page.getByRole("dialog").or(page.locator("[data-cookie-banner]")).first();
  await expect(page.getByRole("button", { name: /aceptar/i }).first()).toBeVisible();
  expect(thirdParty).toEqual([]);
  await page.getByRole("button", { name: /rechazar/i }).first().click();
  await expect(page.getByRole("button", { name: /rechazar/i })).toHaveCount(0);
  const cookies = await page.context().cookies();
  const consent = cookies.find((c) => c.name === "rf_consent");
  expect(consent).toBeTruthy();
  expect(decodeURIComponent(consent?.value ?? "")).toContain('"analytics":false');
  await page.reload();
  await expect(page.getByRole("button", { name: /rechazar/i })).toHaveCount(0);
  void banner;
});
