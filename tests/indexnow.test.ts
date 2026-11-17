import { describe, expect, it } from "vitest";

import { filterIndexNowUrls, isIndexNowHost, parseSitemapUrls } from "@/lib/indexnow-urls";

describe("IndexNow", () => {
  it("filtra URLs del dominio, sin duplicados ni rutas relativas", () => {
    const urls = ["https://reformasmardari.com/", "https://reformasmardari.com/servicios", "https://reformasmardari.com/servicios", "/relativa", "https://otro.com/x", "no es url"];
    expect(filterIndexNowUrls(urls, "reformasmardari.com")).toEqual(["https://reformasmardari.com/", "https://reformasmardari.com/servicios"]);
  });

  it("no envía dominios locales", () => {
    expect(isIndexNowHost("localhost:3000")).toBe(false);
    expect(isIndexNowHost("127.0.0.1")).toBe(false);
    expect(isIndexNowHost("reformas.local")).toBe(false);
    expect(isIndexNowHost("reformas-ten.vercel.app")).toBe(true);
    expect(isIndexNowHost("reformasmardari.com")).toBe(true);
  });

  it("lee las URLs de un sitemap", () => {
    const xml = `<?xml version="1.0"?><urlset><url><loc>https://reformasmardari.com/</loc></url><url><loc> https://reformasmardari.com/blog </loc></url></urlset>`;
    expect(parseSitemapUrls(xml)).toEqual(["https://reformasmardari.com/", "https://reformasmardari.com/blog"]);
  });
});
