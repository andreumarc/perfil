import type { InsightPost } from "@/content/insights";
import { cn } from "@/lib/utils";

import { PostCard } from "./post-card";

/** Rejilla responsive de tarjetas de artículo (1 → 2 → 3 columnas). */
export function PostGrid({
  posts,
  headingLevel = "h3",
  className,
}: {
  posts: InsightPost[];
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  if (posts.length === 0) return null;
  return (
    <div className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
