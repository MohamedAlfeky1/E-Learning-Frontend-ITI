import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none ",
  {
    variants: {
      variant: {
        // Default solid badge
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",

        // Secondary light badge
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",

        // Destructive error badge
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",

        // Outline transparent badge
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",

        // Ghost transparent hover badge
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",

        // Link text badge
        link: "text-primary underline-offset-4 hover:underline",

        // Success badge (Used for 'Popular' tag)
        success:
          "bg-[#E8EFEA] text-[#065F2C] font-bold uppercase tracking-wider",

        lightPruple: "bg-[#dbc8fa] text-purple-700 [a]:hover:bg-primary",

        lightBrown: "bg-[#FFFBEB] text-[#D97706] [a]:hover:bg-primary",

        payment:"bg-[#6BFF8F] text-[#002109] font-bold uppercase tracking-wider",


        // New badge (Used for 'New Course' tag)
        new: "bg-[#6CF68C] text-[#0B4721] font-bold uppercase tracking-wider",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
