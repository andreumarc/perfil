import { LeadForm } from "@/components/forms/lead-form";
import { getQuoteFormProps, type QuoteFormProps } from "@/components/forms/quote-form-props";

/**
 * Formulario de presupuesto renderizado en servidor (HTML completo desde el primer
 * byte). Solo para las páginas cuyo contenido principal es el formulario
 * (/presupuesto, /contacto): su código se carga con la página. En el resto usa
 * `QuoteFormLazy`, que no importa el formulario hasta que hace falta.
 */
export async function QuoteForm(props: QuoteFormProps) {
  return <LeadForm {...props} {...(await getQuoteFormProps())} />;
}
