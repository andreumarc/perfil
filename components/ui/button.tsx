import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-navy-900 text-white shadow-xs hover:bg-navy-800",
        signal: "bg-signal text-white shadow-xs hover:bg-signal-dark",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        outline:
          "border border-navy-900/20 bg-background text-navy-900 shadow-xs hover:bg-navy-50 hover:border-navy-900/40",
        "outline-light":
          "border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-navy-100",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-navy-900 underline-offset-4 hover:underline",
        white: "bg-white text-navy-900 shadow-xs hover:bg-navy-50",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1.5 px-3.5 text-sm has-[>svg]:px-3",
        lg: "h-12 rounded-md px-7 text-base has-[>svg]:px-6",
        xl: "h-14 rounded-md px-8 text-base font-semibold has-[>svg]:px-7",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
