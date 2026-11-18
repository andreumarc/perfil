import { LeadFormLazy } from "@/components/forms/lead-form-lazy";
import { getQuoteFormProps, type QuoteFormProps } from "@/components/forms/quote-form-props";

/**
 * Formulario de presupuesto diferido: el código del formulario (react-hook-form,
 * Zod, selects, Turnstile) se descarga solo cuando el bloque se acerca al viewport
 * o cuando se abre el popup. Este archivo no importa `lead-form`, para que su
 * chunk no entre en la carga inicial de las páginas que lo usan.
 */
export async function QuoteFormLazy(props: QuoteFormProps) {
  return <LeadFormLazy {...props} {...(await getQuoteFormProps())} />;
}
