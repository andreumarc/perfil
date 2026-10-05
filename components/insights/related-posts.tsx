import { Section, SectionHeading } from "@/components/layout/section";
import type { InsightPost } from "@/content/insights";

import { PostGrid } from "./post-grid";

/** Artículos relacionados al final de un post. No renderiza nada si no hay más contenido. */
export function RelatedPosts({ posts }: { posts: InsightPost[] }) {
  if (posts.length === 0) return null;
  return (
    <Section tone="muted">
      <SectionHeading eyebrow="Seguir leyendo" title="Artículos relacionados" />
      <PostGrid posts={posts} className="mt-12" />
    </Section>
  );
}
