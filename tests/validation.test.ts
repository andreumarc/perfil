import { describe, expect, it } from "vitest";
import { z } from "zod";

import { QUESTIONS } from "@/lib/diagnostic/questions";
import { leadsFilterSchema, loginSchema, updateLeadStatusSchema } from "@/lib/validation/admin";
import { isFreeEmail } from "@/lib/validation/free-email-domains";
import {
  antiSpamSchema,
  contactFormSchema,
  isSuspiciousFillTime,
  contactSubmissionSchema,
  corporateEmailSchema,
  diagnosticAnswersSchema,
  diagnosticSubmissionSchema,
  fieldErrors,
  leadFormSchema,
  phoneSchema,
  type LeadFormInput,
} from "@/lib/validation/lead";

const VALID_LEAD: LeadFormInput = {
  firstName: "Marc",
  lastName: "Andreu",
  company: "Grupo Dental Norte",
  jobTitle: "ceo",
  email: "marc@grupodentalnorte.com",
  phone: "+34 600 000 000",
  numberLocations: "11-25",
  companyRevenue: "10-25M",
  sector: "dental",
  gdprConsent: true,
};

/** Respuestas completas y válidas: primera opción de cada pregunta. */
const VALID_ANSWERS: Record<string, string> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q.options[0].value]),
);

const VALID_CONTACT = {
  firstName: "Laura",
  lastName: "Pérez",
  company: "Clínicas Vet Sur",
  jobTitle: "coo",
  email: "laura@clinicasvetsur.es",
  phone: "",
  numberLocations: "6-10",
  mainProblem: "rentabilidad",
  message: "Queremos comparar la rentabilidad de nuestros 8 centros.",
  gdprConsent: true,
} as const;

function errorsOf(result: z.ZodSafeParseResult<unknown>): Record<string, string> {
  if (result.success) throw new Error("Se esperaba un error de validación");
  return fieldErrors(result.error);
}

describe("corporateEmailSchema", () => {
  it.each(["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com"])(
    "rechaza emails de %s con el mensaje de email corporativo",
    (domain) => {
      const result = corporateEmailSchema.safeParse(`persona@${domain}`);
      expect(result.success).toBe(false);
      expect(errorsOf(result)._form).toBe("Utiliza tu email corporativo (no Gmail, Hotmail, etc.)");
      expect(isFreeEmail(`persona@${domain}`)).toBe(true);
    },
  );

  it("rechaza dominios gratuitos aunque vengan en mayúsculas", () => {
    expect(corporateEmailSchema.safeParse("Persona@GMAIL.COM").success).toBe(false);
  });

  it("acepta un dominio corporativo y lo normaliza a minúsculas", () => {
    const result = corporateEmailSchema.safeParse("Marc@Empresa.COM");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("marc@empresa.com");
    expect(isFreeEmail("marc@empresa.com")).toBe(false);
  });

  it("recorta espacios antes de validar (autocompletado móvil)", () => {
    expect(corporateEmailSchema.parse("  Marc@Empresa.COM  ")).toBe("marc@empresa.com");
  });

  it("rechaza cadenas que no son email", () => {
    const result = corporateEmailSchema.safeParse("no-es-un-email");
    expect(result.success).toBe(false);
    expect(errorsOf(result)._form).toBe("Introduce un email válido");
    expect(corporateEmailSchema.safeParse("").success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("acepta vacío, undefined y un teléfono con prefijo y espacios", () => {
    expect(phoneSchema.safeParse("").success).toBe(true);
    expect(phoneSchema.safeParse(undefined).success).toBe(true);
    expect(phoneSchema.safeParse("+34 600 000 000").success).toBe(true);
    expect(phoneSchema.safeParse("(93) 123-45-67").success).toBe(true);
  });

  it("rechaza letras y teléfonos demasiado cortos", () => {
    const result = phoneSchema.safeParse("abc");
    expect(result.success).toBe(false);
    expect(errorsOf(result)._form).toBe("Introduce un teléfono válido");
    expect(phoneSchema.safeParse("600 ABC 000").success).toBe(false);
    expect(phoneSchema.safeParse("123").success).toBe(false);
  });
});

describe("leadFormSchema", () => {
  it("un payload válido pasa y normaliza el email", () => {
    const result = leadFormSchema.safeParse({ ...VALID_LEAD, email: "Marc@GrupoDentalNorte.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("marc@grupodentalnorte.com");
      expect(result.data.gdprConsent).toBe(true);
      expect(result.data.jobTitle).toBe("ceo");
    }
  });

  it("gdprConsent false falla con el mensaje esperado", () => {
    const result = leadFormSchema.safeParse({ ...VALID_LEAD, gdprConsent: false });
    expect(result.success).toBe(false);
    expect(errorsOf(result).gdprConsent).toBe("Debes aceptar la política de privacidad para continuar");
  });

  it("gdprConsent ausente también falla", () => {
    const { gdprConsent: _omit, ...rest } = VALID_LEAD;
    void _omit;
    const result = leadFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(errorsOf(result).gdprConsent).toBeDefined();
  });

  it("jobTitle fuera del enum falla", () => {
    const result = leadFormSchema.safeParse({ ...VALID_LEAD, jobTitle: "becario" });
    expect(result.success).toBe(false);
    expect(errorsOf(result).jobTitle).toBe("Selecciona tu cargo");
  });

  it("firstName con etiquetas HTML falla", () => {
    const result = leadFormSchema.safeParse({ ...VALID_LEAD, firstName: "<script>alert(1)</script>" });
    expect(result.success).toBe(false);
    expect(errorsOf(result).firstName).toBe("Caracteres no permitidos");
  });

  it("campos de texto vacíos o solo espacios fallan como obligatorios", () => {
    const result = leadFormSchema.safeParse({ ...VALID_LEAD, company: "   " });
    expect(result.success).toBe(false);
    expect(errorsOf(result).company).toBe("Campo obligatorio");
  });

  it("safeText recorta espacios y elimina caracteres de control", () => {
    const result = leadFormSchema.safeParse({ ...VALID_LEAD, firstName: "  Marc\u0000\u0007  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.firstName).toBe("Marc");
  });

  it("acepta phone vacío", () => {
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, phone: "" }).success).toBe(true);
  });
});

describe("diagnosticAnswersSchema", () => {
  it("un conjunto completo y válido pasa", () => {
    expect(Object.keys(VALID_ANSWERS)).toHaveLength(15);
    expect(diagnosticAnswersSchema.safeParse(VALID_ANSWERS).success).toBe(true);
  });

  it("falta una pregunta → falla con el path de la pregunta", () => {
    const { q5: _omit, ...incomplete } = VALID_ANSWERS;
    void _omit;
    const result = diagnosticAnswersSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].path).toEqual(["q5"]);
      expect(result.error.issues[0].message).toBe("Falta la respuesta a q5");
    }
  });

  it("valor que no es una opción → falla con el path de la pregunta", () => {
    const result = diagnosticAnswersSchema.safeParse({ ...VALID_ANSWERS, q2: "quizas" });
    expect(result.success).toBe(false);
    expect(errorsOf(result).q2).toBe("Respuesta no válida en q2");
  });

  it("pregunta desconocida → falla con el path de la clave", () => {
    const result = diagnosticAnswersSchema.safeParse({ ...VALID_ANSWERS, q99: "yes" });
    expect(result.success).toBe(false);
    expect(errorsOf(result).q99).toBe("Pregunta desconocida q99");
  });

  it("valores demasiado largos fallan", () => {
    const result = diagnosticAnswersSchema.safeParse({ ...VALID_ANSWERS, q2: "x".repeat(41) });
    expect(result.success).toBe(false);
  });
});

describe("diagnosticSubmissionSchema", () => {
  it("un envío completo pasa con source y attribution por defecto; antiSpam.startedAt es obligatorio", () => {
    const result = diagnosticSubmissionSchema.safeParse({
      lead: VALID_LEAD,
      answers: VALID_ANSWERS,
      antiSpam: { startedAt: 1700000000000 },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.antiSpam).toEqual({ website: "", startedAt: 1700000000000 });
      expect(result.data.source).toBe("diagnostic");
      expect(result.data.attribution).toEqual({});
      expect(result.data.visitorId).toBeUndefined();
    }
    // Sin antiSpam (o sin startedAt) el envío se rechaza: un bot no puede saltarse el control de tiempo.
    expect(diagnosticSubmissionSchema.safeParse({ lead: VALID_LEAD, answers: VALID_ANSWERS }).success).toBe(false);
    expect(
      diagnosticSubmissionSchema.safeParse({ lead: VALID_LEAD, answers: VALID_ANSWERS, antiSpam: {} }).success,
    ).toBe(false);
  });

  it("acepta source 'linkedin' y atribución acotada", () => {
    const result = diagnosticSubmissionSchema.safeParse({
      lead: VALID_LEAD,
      answers: VALID_ANSWERS,
      source: "linkedin",
      attribution: { utmSource: "linkedin", utmMedium: "social", utmCampaign: "ceo-multicentro" },
      antiSpam: { website: "", startedAt: "1700000000000" },
      visitorId: "v_123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("linkedin");
      expect(result.data.attribution.utmSource).toBe("linkedin");
      expect(result.data.antiSpam.startedAt).toBe(1700000000000);
    }
  });

  it("honeypot 'website' relleno → falla", () => {
    const result = diagnosticSubmissionSchema.safeParse({
      lead: VALID_LEAD,
      answers: VALID_ANSWERS,
      antiSpam: { website: "https://spam.example", startedAt: 1700000000000 },
    });
    expect(result.success).toBe(false);
    expect(errorsOf(result)["antiSpam.website"]).toBe("Spam detectado");
  });

  it("source fuera del enum falla", () => {
    expect(
      diagnosticSubmissionSchema.safeParse({ lead: VALID_LEAD, answers: VALID_ANSWERS, source: "google" }).success,
    ).toBe(false);
  });

  it("errores anidados del lead se reportan con path con puntos", () => {
    const result = diagnosticSubmissionSchema.safeParse({
      lead: { ...VALID_LEAD, email: "x@gmail.com" },
      answers: VALID_ANSWERS,
    });
    expect(result.success).toBe(false);
    expect(errorsOf(result)["lead.email"]).toBe("Utiliza tu email corporativo (no Gmail, Hotmail, etc.)");
  });
});

describe("antiSpamSchema", () => {
  it("exige startedAt positivo y entero; website vacío por defecto", () => {
    expect(antiSpamSchema.safeParse({}).success).toBe(false);
    expect(antiSpamSchema.safeParse({ website: "" }).success).toBe(false);
    expect(antiSpamSchema.safeParse({ startedAt: 1700000000000 }).success).toBe(true);
    expect(antiSpamSchema.parse({ startedAt: 1700000000000 }).website).toBe("");
    expect(antiSpamSchema.safeParse({ startedAt: -1 }).success).toBe(false);
    expect(antiSpamSchema.safeParse({ startedAt: 1.5 }).success).toBe(false);
  });

  it("isSuspiciousFillTime rechaza envíos en menos de 3 s o de más de 6 h", () => {
    const now = 1_700_000_000_000;
    expect(isSuspiciousFillTime(now - 1_000, now)).toBe(true);
    expect(isSuspiciousFillTime(now - 5_000, now)).toBe(false);
    expect(isSuspiciousFillTime(now - 7 * 60 * 60 * 1000, now)).toBe(true);
  });

  it("los campos de identidad rechazan URLs y direcciones de email", () => {
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, firstName: "Urgente https://evil.example" }).success).toBe(false);
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, company: "soporte@evil.example" }).success).toBe(false);
    expect(leadFormSchema.safeParse({ ...VALID_LEAD, company: "Grupo Dental Levante S.L." }).success).toBe(true);
  });
});

describe("contactFormSchema", () => {
  it("un contacto válido pasa (companyRevenue y sector opcionales)", () => {
    const result = contactFormSchema.safeParse(VALID_CONTACT);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.companyRevenue).toBeUndefined();
      expect(result.data.sector).toBeUndefined();
      expect(result.data.mainProblem).toBe("rentabilidad");
    }
  });

  it("message con menos de 10 caracteres falla", () => {
    const result = contactFormSchema.safeParse({ ...VALID_CONTACT, message: "Hola" });
    expect(result.success).toBe(false);
    expect(errorsOf(result).message).toBe("Campo obligatorio");
  });

  it("message con más de 2000 caracteres falla", () => {
    const result = contactFormSchema.safeParse({ ...VALID_CONTACT, message: "a".repeat(2001) });
    expect(result.success).toBe(false);
    expect(errorsOf(result).message).toBe("Máximo 2000 caracteres");
  });

  it("mainProblem es obligatorio", () => {
    const { mainProblem: _omit, ...rest } = VALID_CONTACT;
    void _omit;
    const result = contactFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(errorsOf(result).mainProblem).toBe("Selecciona el problema principal");
  });

  it("contactSubmissionSchema aplica defaults (source contact, attribution {}) y exige antiSpam", () => {
    const result = contactSubmissionSchema.safeParse({ contact: VALID_CONTACT, antiSpam: { startedAt: 1700000000000 } });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("contact");
      expect(result.data.antiSpam).toEqual({ website: "", startedAt: 1700000000000 });
      expect(result.data.attribution).toEqual({});
    }
    expect(contactSubmissionSchema.safeParse({ contact: VALID_CONTACT }).success).toBe(false);
  });

  it("contactSubmissionSchema acepta solo claves de contexto conocidas", () => {
    const antiSpam = { startedAt: 1700000000000 };
    expect(
      contactSubmissionSchema.safeParse({
        contact: VALID_CONTACT,
        source: "calculator",
        antiSpam,
        context: { locations: 12, revenue: 12_000_000, ebitdaMarginPct: 11, sector: "dental", opportunityLevel: "alto" },
      }).success,
    ).toBe(true);
    expect(
      contactSubmissionSchema.safeParse({ contact: VALID_CONTACT, antiSpam, context: { interes: "integration-100" } }).success,
    ).toBe(true);
    // Claves desconocidas, valores anidados o textos enormes se rechazan (no llegan a notas ni emails).
    expect(
      contactSubmissionSchema.safeParse({ contact: VALID_CONTACT, antiSpam, context: { nested: { a: 1 } } }).success,
    ).toBe(false);
    expect(
      contactSubmissionSchema.safeParse({ contact: VALID_CONTACT, antiSpam, context: { interes: "x".repeat(61) } }).success,
    ).toBe(false);
  });
});

describe("fieldErrors", () => {
  it("devuelve un mapa campo → primer mensaje, con '_form' para errores sin path", () => {
    const schema = z.object({
      name: z.string().min(2, { error: "Nombre corto" }).max(3, { error: "Nombre largo" }),
      nested: z.object({ email: z.email({ error: "Email inválido" }) }),
    });
    const result = schema.safeParse({ name: "a", nested: { email: "x" } });
    expect(result.success).toBe(false);
    if (!result.success) {
      const map = fieldErrors(result.error);
      expect(map).toEqual({ name: "Nombre corto", "nested.email": "Email inválido" });
    }

    const rootResult = z.string().min(5, { error: "Demasiado corto" }).safeParse("abc");
    expect(rootResult.success).toBe(false);
    if (!rootResult.success) expect(fieldErrors(rootResult.error)).toEqual({ _form: "Demasiado corto" });
  });

  it("conserva solo el primer error por campo", () => {
    const schema = z.string().min(5, { error: "Primero" }).regex(/^\d+$/, { error: "Segundo" });
    const result = schema.safeParse("ab");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1);
      expect(fieldErrors(result.error)).toEqual({ _form: "Primero" });
    }
  });
});

describe("leadsFilterSchema", () => {
  it("aplica defaults: sort createdAt, dir desc, page 1, pageSize 25", () => {
    const result = leadsFilterSchema.parse({});
    expect(result).toEqual({ sort: "createdAt", dir: "desc", page: 1, pageSize: 25 });
  });

  it("coerciona page y pageSize desde string", () => {
    const result = leadsFilterSchema.parse({ page: "3", pageSize: "50", status: "NEW", hot: "1", sort: "score" });
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(50);
    expect(result.status).toBe("NEW");
    expect(result.hot).toBe("1");
    expect(result.sort).toBe("score");
  });

  it("rechaza page < 1, pageSize fuera de 10-100 y valores de enum inválidos", () => {
    expect(leadsFilterSchema.safeParse({ page: "0" }).success).toBe(false);
    expect(leadsFilterSchema.safeParse({ pageSize: "5" }).success).toBe(false);
    expect(leadsFilterSchema.safeParse({ pageSize: "500" }).success).toBe(false);
    expect(leadsFilterSchema.safeParse({ sort: "email" }).success).toBe(false);
    expect(leadsFilterSchema.safeParse({ dir: "up" }).success).toBe(false);
    expect(leadsFilterSchema.safeParse({ status: "PENDING" }).success).toBe(false);
  });

  it("acepta 'ALL' en status y level", () => {
    expect(leadsFilterSchema.safeParse({ status: "ALL", level: "ALL" }).success).toBe(true);
  });
});

describe("updateLeadStatusSchema", () => {
  it("exige un leadId uuid y un status del enum", () => {
    expect(
      updateLeadStatusSchema.safeParse({ leadId: "6f1a2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b", status: "CONTACTED" }).success,
    ).toBe(true);
    expect(updateLeadStatusSchema.safeParse({ leadId: "abc", status: "CONTACTED" }).success).toBe(false);
    expect(updateLeadStatusSchema.safeParse({ leadId: "123", status: "NEW" }).success).toBe(false);
    expect(
      updateLeadStatusSchema.safeParse({ leadId: "6f1a2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b", status: "ARCHIVED" }).success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("normaliza el email y exige contraseña", () => {
    const ok = loginSchema.safeParse({ email: "Admin@Empresa.com", password: "secret" });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.email).toBe("admin@empresa.com");
    const ko = loginSchema.safeParse({ email: "admin@empresa.com", password: "" });
    expect(ko.success).toBe(false);
    expect(errorsOf(ko).password).toBe("Introduce la contraseña");
  });
});
