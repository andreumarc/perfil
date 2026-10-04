import type { ContentBlock } from "@/content/insights/types";
import { slugify } from "@/lib/utils";

/** Renderiza bloques de contenido tipados con el estilo editorial `prose-executive`. */
export function RichContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-executive">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return <p key={index}>{block.text}</p>;
          case "h2":
            return (
              <h2 key={index} id={block.id ?? slugify(block.text)}>
                {block.text}
              </h2>
            );
          case "h3":
            return <h3 key={index}>{block.text}</h3>;
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            );
          case "quote":
            return <blockquote key={index}>{block.text}</blockquote>;
          case "callout":
            return (
              <aside key={index} className="my-8 rounded-md border border-navy-100 bg-navy-50 p-5 not-italic">
                {block.title ? <p className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-signal">{block.title}</p> : null}
                <p className="m-0 text-navy-900">{block.text}</p>
              </aside>
            );
          case "table":
            return (
              <div key={index} className="my-6 overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
