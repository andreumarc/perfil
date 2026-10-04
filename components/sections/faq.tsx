import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQ accesible con <details>: sin JS, indexable y compatible con FAQPage schema. */
export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-gray-200 border-y border-gray-200", className)}>
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-base font-semibold text-navy-900 marker:content-none md:text-lg [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDownIcon className="mt-1 size-5 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
