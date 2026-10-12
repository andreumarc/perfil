"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

/** Editor Markdown con vista previa (GFM, sin HTML crudo). */
export function MarkdownField({ id, value, onChange, rows = 18 }: { id: string; value: string; onChange: (v: string) => void; rows?: number }) {
  const words = React.useMemo(() => (value.trim() ? value.trim().split(/\s+/).length : 0), [value]);
  return (
    <Tabs defaultValue="edit">
      <div className="flex items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="edit">Editar</TabsTrigger>
          <TabsTrigger value="preview">Vista previa</TabsTrigger>
        </TabsList>
        <span className="tabular text-xs text-gray-500">{words} palabras · {Math.max(1, Math.round(words / 220))} min</span>
      </div>
      <TabsContent value="edit">
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="font-mono text-[13px] leading-relaxed" spellCheck />
        <p className="mt-1.5 text-xs text-gray-500">Markdown: ## Título, **negrita**, listas con -, tablas con | y enlaces [texto](/ruta). Sin H1.</p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="prose-site max-h-[70vh] overflow-y-auto rounded-md border border-gray-200 bg-white p-5">
          {value.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-sm text-gray-500">Nada que previsualizar todavía.</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
}
