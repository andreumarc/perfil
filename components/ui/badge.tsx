import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink-900 text-white",
        secondary: "border-transparent bg-gray-100 text-ink-800",
        copper: "border-transparent bg-copper-100 text-copper-700",
        olive: "border-transparent bg-olive-100 text-olive-700",
        success: "border-transparent bg-emerald-50 text-emerald-800",
        warning: "border-transparent bg-amber-50 text-amber-800",
        destructive: "border-transparent bg-red-50 text-red-800",
        outline: "text-foreground border-border",
        muted: "border-transparent bg-gray-100 text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
