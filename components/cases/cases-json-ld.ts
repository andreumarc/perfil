import { casePath, type Case } from "@/content/cases";
import { site } from "@/lib/site";

/** ItemList de schema.org con los casos de intervención (anclas dentro de /casos). */
export function casesItemListJsonLd(cases: readonly Case[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Casos de intervención en redes multicentro",
    description:
      "Ejemplos de intervención construidos a partir de situaciones habituales en redes multicentro. No corresponden a clientes concretos.",
    itemListElement: cases.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.context,
      url: `${site.url}${casePath(item.slug)}`,
    })),
  };
}
