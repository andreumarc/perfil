/** Divide un markdown en dos partes antes del enésimo H2 (para insertar un CTA en medio del artículo). */
export function splitMarkdownAtHeading(markdown: string, nth = 3): [string, string] {
  const lines = markdown.split("\n");
  let count = 0;
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    if (/^##\s+/.test(line)) {
      count += 1;
      if (count === nth) return [lines.slice(0, i).join("\n"), lines.slice(i).join("\n")];
    }
  }
  return [markdown, ""];
}
