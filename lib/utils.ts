import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un número como euros sin decimales (es-ES). */
export function formatEuro(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/** Formatea un número con separadores de miles (es-ES). */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, ...options }).format(value);
}

export function formatPercent(value: number, digits = 0) {
  return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: digits }).format(value)}%`;
}

export function formatDate(date: Date | string | number, options: Intl.DateTimeFormatOptions = {}) {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(d);
}

export function formatDateTime(date: Date | string | number) {
  return formatDate(date, { hour: "2-digit", minute: "2-digit" });
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function initials(first: string, last?: string) {
  return `${first.charAt(0)}${(last ?? "").charAt(0)}`.toUpperCase();
}
