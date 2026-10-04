import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-[0_18px_40px_-24px_rgba(10,26,51,0.35)] md:p-7",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{service.format}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy-900">{service.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 md:text-[15px]">{service.summary}</p>
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="tabular text-sm font-semibold text-navy-900">{service.priceLabel}</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 group-hover:gap-2 transition-all">
          {service.cta}
          <ArrowRightIcon className="size-4" />
        </span>
      </div>
    </Link>
  );
}
