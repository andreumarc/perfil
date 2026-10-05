import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SERVICES, type ServiceSlug } from "@/content/services";
import { cn } from "@/lib/utils";

import { servicePath } from "./services-json-ld";

interface ComparisonRow {
  audience: string;
  duration: string;
  result: string;
}

/** Columnas resumidas que no viven en el catálogo (copy corto para la tabla). */
const COMPARISON: Record<ServiceSlug, ComparisonRow> = {
  "multisite-performance-audit": {
    audience: "CEOs, CFOs e inversores que no pueden comparar la rentabilidad de sus centros con criterios homogéneos.",
    duration: "3-4 semanas",
    result: "P&L por centro, ranking, mapa de desviaciones y plan de acción a 90 días.",
  },
  "ebitda-improvement": {
    audience: "Redes con potencial identificado y un objetivo de EBITDA que cumplir en el trimestre.",
    duration: "6-8 semanas",
    result: "Palancas ejecutadas con el equipo, cuadro de mando semanal y rutinas que sostienen la mejora.",
  },
  "integration-100": {
    audience: "Fondos Buy & Build y grupos que compran centros y necesitan integrarlos sin perder facturación ni equipo.",
    duration: "100 días",
    result: "Adquisición que reporta y opera como el grupo al día 100, con sinergias asignadas y playbook reutilizable.",
  },
  "fractional-coo": {
    audience: "Empresas de 5 a 50 M€ cuyo CEO sigue llevando la operación del día a día.",
    duration: "Mínimo 6 meses · 2-3 días/semana",
    result: "Red dirigida con datos, managers con objetivos y rutinas, y un CEO fuera de la operación diaria.",
  },
};

function priceWithoutPrefix(label: string) {
  return label.replace(/^desde\s+/i, "");
}

/** Tabla comparativa de los cuatro servicios. Scroll horizontal en móvil. */
export function ServiceComparisonTable({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white", className)}>
      <Table className="min-w-[960px] text-[15px]">
        <TableCaption className="px-4 pb-4 text-left text-gray-500">
          Precios orientativos sin IVA. El alcance y el presupuesto se cierran por escrito antes de empezar.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-12 px-5 text-navy-900">Servicio</TableHead>
            <TableHead className="h-12 px-5 text-navy-900">Para quién</TableHead>
            <TableHead className="h-12 px-5 text-navy-900">Duración</TableHead>
            <TableHead className="h-12 px-5 text-navy-900">Precio desde</TableHead>
            <TableHead className="h-12 px-5 text-navy-900">Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SERVICES.map((service) => {
            const row = COMPARISON[service.slug];
            return (
              <TableRow key={service.slug} className="align-top">
                <TableCell className="w-[20%] px-5 py-5 align-top whitespace-normal">
                  <Link
                    href={servicePath(service.slug)}
                    className="group inline-flex flex-col gap-1 text-navy-900"
                  >
                    <span className="font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
                      {service.name}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                      {service.shortName}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="w-[26%] px-5 py-5 align-top whitespace-normal leading-relaxed text-gray-600">
                  {row.audience}
                </TableCell>
                <TableCell className="w-[14%] px-5 py-5 align-top whitespace-normal font-medium text-navy-900">
                  {row.duration}
                </TableCell>
                <TableCell className="w-[12%] px-5 py-5 align-top whitespace-normal">
                  <span className="tabular font-semibold text-navy-900">{priceWithoutPrefix(service.priceLabel)}</span>
                </TableCell>
                <TableCell className="w-[28%] px-5 py-5 align-top whitespace-normal leading-relaxed text-gray-600">
                  <p>{row.result}</p>
                  <Link
                    href={servicePath(service.slug)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:gap-2 transition-all"
                  >
                    Ver detalle
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
