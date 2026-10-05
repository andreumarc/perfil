"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Botón para copiar el enlace privado del resultado al portapapeles. */
export function CopyResultLink({ url }: { url: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>
        {state === "copied" ? <CheckIcon className="text-signal" /> : <CopyIcon />}
        {state === "copied" ? "Copiado" : "Copiar enlace"}
      </Button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Enlace copiado al portapapeles" : ""}
      </span>
      {state === "failed" ? (
        <input
          readOnly
          value={url}
          aria-label="Enlace al resultado"
          onFocus={(e) => e.currentTarget.select()}
          className="h-9 w-full rounded-md border border-input bg-white px-3 text-xs text-gray-700 sm:max-w-xs"
        />
      ) : null}
    </div>
  );
}
