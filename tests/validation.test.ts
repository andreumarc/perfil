import { describe, expect, it } from "vitest";
import { z } from "zod";

import { leadsFilterSchema, loginSchema, passwordSchema, setupSchema } from "@/lib/validation/admin";
import {
  antiSpamSchema,
  emailSchema,
  fieldErrors,
  isSuspiciousFillTime,
  leadFormSchema,
  leadSubmissionSchema,
  phoneSchema,
  type LeadFormInput,
} from "@/lib/validation/lead";
import { mergeSettings } from "@/lib/cms/settings";
import { siteSettingsSchema } from "@/lib/validation/settings";
import { DEFAULT_SETTINGS } from "@/content/settings";

const VALID_LEAD: LeadFormInput = {
  name: "Laura Pérez",
  email: "Laura.Perez@gmail.com",
  phone: "600 123 456",
  locality: "Igualada",
  postalCode: "08700",
  propertyType: "piso",
  serviceSlug: "reformas-cocinas",
  sectorSlug: "",
  squareMeters: "85",
  budgetRange: "10k-25k",
  timeline: "1-3m",
  message: "Queremos abrir la cocina al salón.",
  privacyConsent: true,
  marketingConsent: false,
};

function errorsOf(result: z.ZodSafeParseResult<unknown>): Record<string, string> {
  if (result.success) throw new Error("Se esperaba un error de validación");
  return fieldErrors(result.error);
}

describe("emailSchema", () => {
  it("acepta emails de proveedores gratuitos (particulares) y normaliza", () => {
    expect(emailSchema.parse("  Persona@GMAIL.com ")).toBe("persona@gmail.com");
  });
  it("rechaza formatos inválidos", () => {
    expect(emailSchema.safeParse("no-es-un-email").success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("normaliza a E.164", () => {
    expect(phoneSchema.parse("600 123 456")).toBe("+34600123456");
  });
  it("rechaza teléfonos cortos o con letras", () => {
    expect(phoneSchema.safeParse("1234").success).toBe(false);
    expect(phoneSchema.safeParse("telefono").success).toBe(false);
  });
});

describe("leadFormSchema", () => {
  it("acepta un lead válido y convierte tipos", () => {
    const result = leadFormSchema.safeParse(VALID_LEAD);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("laura.perez@gmail.com");
      expect(result.data.phone).toBe("+34600123456");
      expect(result.data.squareMeters).toBe(85);
    }
  });
  it("exige nombre, email, teléfono y consentimiento de privacidad", () => {
    const errors = errorsOf(leadFormSchema.safeParse({ ...VALID_LEAD, name: "", email: "", phone: "", privacyConsent: false }));
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.privacyConsent).toBe("Debes aceptar la política de privacidad para continuar");
  });
  it("no exige marketing y por defecto es false", () => {
    const { marketingConsent: _m, ...rest } = VALID_LEAD;
    void _m;
    const result = leadFormSchema.parse(rest);
    expect(result.marketingConsent).toBe(false);
  });
  it("rechaza HTML y enlaces en el nombre", () => {
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, name: "<script>" }).success).toBe(false);
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, name: "http://spam.example" }).success).toBe(false);
  });
  it("rechaza servicios desconocidos y códigos postales inválidos", () => {
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, serviceSlug: "inventado" }).success).toBe(false);
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, postalCode: "123" }).success).toBe(false);
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, postalCode: "" }).success).toBe(true);
  });
});

describe("antiSpamSchema / fill time", () => {
  it("rechaza honeypot relleno y exige startedAt", () => {
    expect(antiSpamSchema.safeParse({ website: "x", startedAt: 1 }).success).toBe(false);
    expect(antiSpamSchema.safeParse({ website: "" }).success).toBe(false);
    expect(antiSpamSchema.safeParse({ website: "", startedAt: Date.now() }).success).toBe(true);
  });
  it("detecta envíos demasiado rápidos o demasiado antiguos", () => {
    const now = 1_000_000_000;
    expect(isSuspiciousFillTime(now - 1000, now)).toBe(true);
    expect(isSuspiciousFillTime(now - 10_000, now)).toBe(false);
    expect(isSuspiciousFillTime(now - 7 * 60 * 60 * 1000, now)).toBe(true);
  });
});

describe("leadSubmissionSchema", () => {
  it("aplica defaults de source, variante y contexto", () => {
    const parsed = leadSubmissionSchema.parse({
      lead: VALID_LEAD,
      antiSpam: { website: "", startedAt: Date.now() - 10_000 },
    });
    expect(parsed.source).toBe("presupuesto");
    expect(parsed.formVariant).toBe("general");
    expect(parsed.context).toEqual({});
    expect(parsed.attachmentCount).toBe(0);
  });
  it("acota el contexto a claves conocidas", () => {
    const parsed = leadSubmissionSchema.parse({
      lead: VALID_LEAD,
      antiSpam: { website: "", startedAt: Date.now() - 10_000 },
      context: { activity: "Tienda", installations: ["Electricidad"], premisesState: "bruto", desconocida: "x" },
    });
    expect(parsed.context).toEqual({ activity: "Tienda", installations: ["Electricidad"], premisesState: "bruto" });
  });
});

describe("admin schemas", () => {
  it("loginSchema normaliza el email", () => {
    expect(loginSchema.parse({ email: " Admin@Empresa.COM ", password: "x" }).email).toBe("admin@empresa.com");
  });
  it("passwordSchema exige 12 caracteres y mezcla", () => {
    expect(passwordSchema.safeParse("corta").success).toBe(false);
    expect(passwordSchema.safeParse("todominusculas").success).toBe(false);
    expect(passwordSchema.safeParse("ContraseñaSegura2026").success).toBe(true);
  });
  it("setupSchema valida token, nombre, email y contraseña", () => {
    expect(setupSchema.safeParse({ token: "t", name: "Ana", email: "ana@empresa.com", password: "ContraseñaSegura2026" }).success).toBe(true);
    expect(setupSchema.safeParse({ token: "", name: "Ana", email: "ana@empresa.com", password: "ContraseñaSegura2026" }).success).toBe(false);
  });
  it("leadsFilterSchema aplica defaults y rechaza fechas inválidas", () => {
    const f = leadsFilterSchema.parse({});
    expect(f.sort).toBe("createdAt");
    expect(f.page).toBe(1);
    expect(leadsFilterSchema.safeParse({ from: "no-date" }).success).toBe(false);
    expect(leadsFilterSchema.safeParse({ from: "2026-01-01", status: "WON" }).success).toBe(true);
  });
});

describe("site settings", () => {
  it("los defaults cumplen el esquema", () => {
    expect(siteSettingsSchema.safeParse(DEFAULT_SETTINGS).success).toBe(true);
  });
  it("mergeSettings pisa solo los campos guardados y rechaza IDs de analítica inválidos", () => {
    const merged = mergeSettings({ company: { name: "Reformas Demo", phone: "600123456" } });
    expect(merged.company.name).toBe("Reformas Demo");
    expect(merged.company.phone).toBe("600123456");
    expect(merged.company.zones).toEqual(DEFAULT_SETTINGS.company.zones);
    const bad = mergeSettings({ integrations: { gtmId: "<script>" } });
    expect(bad.integrations.gtmId).toBe("");
  });
});
