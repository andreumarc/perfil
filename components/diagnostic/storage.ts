import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";

/**
 * Persistencia del borrador del diagnóstico en sessionStorage.
 * Almacenamiento técnico de sesión (se borra al cerrar la pestaña): permite
 * retomar las respuestas si el usuario recarga o navega por error.
 */
const STORAGE_KEY = "mg_diag";

export interface DiagnosticDraft {
  answers: Record<string, string>;
  step: number;
  startedAt: number | null;
}

const QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

function isValidDraft(value: unknown): value is DiagnosticDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<DiagnosticDraft>;
  if (!draft.answers || typeof draft.answers !== "object") return false;
  if (typeof draft.step !== "number" || draft.step < 0 || draft.step >= TOTAL_QUESTIONS) return false;
  return Object.entries(draft.answers).every(
    ([id, answer]) => QUESTION_IDS.has(id) && typeof answer === "string" && answer.length <= 40,
  );
}

export function readDraft(): DiagnosticDraft | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidDraft(parsed)) return null;
    // Solo conserva respuestas que siguen siendo opciones válidas.
    const answers: Record<string, string> = {};
    for (const q of QUESTIONS) {
      const v = parsed.answers[q.id];
      if (v && q.options.some((o) => o.value === v)) answers[q.id] = v;
    }
    if (Object.keys(answers).length === 0) return null;
    return {
      answers,
      step: parsed.step,
      startedAt: typeof parsed.startedAt === "number" ? parsed.startedAt : null,
    };
  } catch {
    return null;
  }
}

export function writeDraft(draft: DiagnosticDraft) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Sin almacenamiento disponible: el diagnóstico sigue funcionando en memoria.
  }
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
