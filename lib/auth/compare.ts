import { createHash, timingSafeEqual } from "node:crypto";

/** Comparación en tiempo constante de dos cadenas (hash previo para igualar longitud). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}
