"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { setResourceStatusAction } from "@/actions/admin-content";
import { Button } from "@/components/ui/button";
import type { ResourceKey } from "@/lib/validation/content";

/** Botón rápido publicar/despublicar en los listados. */
export function StatusToggle({ resource, id, status }: { resource: ResourceKey; id: string; status: "draft" | "published" }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const next = status === "published" ? "draft" : "published";
  return (
    <Button
      type="button"
      size="sm"
      variant={status === "published" ? "ghost" : "outline"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await setResourceStatusAction({ key: resource, id, status: next });
          if (res.ok) router.refresh();
        })
      }
    >
      {status === "published" ? "Pasar a borrador" : "Publicar"}
    </Button>
  );
}
