import { CASES } from "@/content/cases";
import { cn } from "@/lib/utils";

import { CaseCard } from "./case-card";

/** Lista apilada de los casos, cada uno con su ancla. */
export function CaseList({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8 md:space-y-10", className)}>
      {CASES.map((item, index) => (
        <CaseCard key={item.slug} item={item} index={index} />
      ))}
    </div>
  );
}
