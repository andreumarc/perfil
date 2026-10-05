import { describe, expect, it } from "vitest";

import { detectDevice, extractIp, hashIp, metaFromHeaders } from "@/lib/request-meta";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  ipad: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  androidPhone:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  chromeDesktop:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  headless:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/124.0.0.0 Safari/537.36",
  lighthouse:
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
};

describe("detectDevice", () => {
  it.each([
    ["iPhone", UA.iphone, "mobile"],
    ["Android phone", UA.androidPhone, "mobile"],
    ["iPad", UA.ipad, "tablet"],
    ["Android tablet (sin 'Mobile')", UA.androidTablet, "tablet"],
    ["Chrome desktop", UA.chromeDesktop, "desktop"],
    ["Safari macOS", UA.macSafari, "desktop"],
    ["Googlebot", UA.googlebot, "bot"],
    ["HeadlessChrome", UA.headless, "bot"],
    ["Lighthouse", UA.lighthouse, "bot"],
  ] as const)("%s → %s", (_, ua, expected) => {
    expect(detectDevice(ua)).toBe(expected);
  });

  it("null, undefined o cadena vacía → unknown", () => {
    expect(detectDevice(null)).toBe("unknown");
    expect(detectDevice(undefined)).toBe("unknown");
    expect(detectDevice("")).toBe("unknown");
  });

  it("los bots tienen prioridad sobre el tipo de dispositivo", () => {
    expect(detectDevice("Mozilla/5.0 (iPhone) crawler/1.0")).toBe("bot");
  });
});

describe("hashIp", () => {
  it("es determinista y devuelve 32 caracteres hexadecimales", () => {
    const a = hashIp("83.45.12.9");
    const b = hashIp("83.45.12.9");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{32}$/);
  });

  it("devuelve hashes distintos para IPs distintas y no expone la IP", () => {
    const a = hashIp("83.45.12.9");
    const b = hashIp("83.45.12.10");
    expect(a).not.toBe(b);
    expect(a).not.toContain("83.45");
  });

  it("null, undefined y cadena vacía → null", () => {
    expect(hashIp(null)).toBeNull();
    expect(hashIp(undefined)).toBeNull();
    expect(hashIp("")).toBeNull();
  });

  it("funciona con IPv6", () => {
    expect(hashIp("2001:db8::1")).toMatch(/^[0-9a-f]{32}$/);
    expect(hashIp("2001:db8::1")).not.toBe(hashIp("2001:db8::2"));
  });
});

describe("extractIp", () => {
  it("con x-forwarded-for múltiple toma la primera IP", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.5, 70.41.3.18, 150.172.238.178" });
    expect(extractIp(h)).toBe("203.0.113.5");
  });

  it("recorta espacios en x-forwarded-for con una sola IP", () => {
    expect(extractIp(new Headers({ "x-forwarded-for": "  203.0.113.5  " }))).toBe("203.0.113.5");
  });

  it("x-forwarded-for tiene prioridad sobre x-real-ip y cf-connecting-ip", () => {
    const h = new Headers({
      "x-forwarded-for": "203.0.113.5",
      "x-real-ip": "198.51.100.1",
      "cf-connecting-ip": "192.0.2.1",
    });
    expect(extractIp(h)).toBe("203.0.113.5");
  });

  it("usa x-real-ip y después cf-connecting-ip como fallback", () => {
    expect(extractIp(new Headers({ "x-real-ip": "198.51.100.1", "cf-connecting-ip": "192.0.2.1" }))).toBe(
      "198.51.100.1",
    );
    expect(extractIp(new Headers({ "cf-connecting-ip": "192.0.2.1" }))).toBe("192.0.2.1");
  });

  it("sin cabeceras de IP → null", () => {
    expect(extractIp(new Headers())).toBeNull();
    expect(extractIp(new Headers({ "user-agent": UA.chromeDesktop }))).toBeNull();
  });
});

describe("metaFromHeaders", () => {
  it("x-vercel-ip-country 'ES' → country ES, y compone ip/ipHash/device", () => {
    const h = new Headers({
      "x-forwarded-for": "203.0.113.5, 10.0.0.1",
      "user-agent": UA.iphone,
      "x-vercel-ip-country": "ES",
    });
    const meta = metaFromHeaders(h);
    expect(meta.country).toBe("ES");
    expect(meta.ip).toBe("203.0.113.5");
    expect(meta.ipHash).toBe(hashIp("203.0.113.5"));
    expect(meta.ipHash).toMatch(/^[0-9a-f]{32}$/);
    expect(meta.device).toBe("mobile");
    expect(meta.userAgent).toBe(UA.iphone);
  });

  it("país con formato inválido → null", () => {
    expect(metaFromHeaders(new Headers({ "x-vercel-ip-country": "Spain" })).country).toBeNull();
    expect(metaFromHeaders(new Headers({ "x-vercel-ip-country": "es" })).country).toBeNull();
    expect(metaFromHeaders(new Headers({ "x-vercel-ip-country": "E" })).country).toBeNull();
    expect(metaFromHeaders(new Headers({ "x-vercel-ip-country": "" })).country).toBeNull();
  });

  it("sin cabeceras → todo null/unknown", () => {
    const meta = metaFromHeaders(new Headers());
    expect(meta).toEqual({ ip: null, ipHash: null, rateKey: expect.any(String), userAgent: null, device: "unknown", country: null });
  });

  it("trunca el user-agent a 400 caracteres", () => {
    const longUa = `${UA.chromeDesktop} ${"x".repeat(600)}`;
    const meta = metaFromHeaders(new Headers({ "user-agent": longUa }));
    expect(meta.userAgent).toHaveLength(400);
    expect(meta.device).toBe("desktop");
  });
});
