import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Migas de pan" className={cn("text-sm text-gray-500", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, index) => {
            const last = index === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-navy-900">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-navy-900">
                    {item.name}
                  </Link>
                )}
                {!last ? <ChevronRightIcon className="size-3.5 text-gray-400" /> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
