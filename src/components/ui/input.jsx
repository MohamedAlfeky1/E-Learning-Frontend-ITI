import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "",
  {
    variants: {
      variant: {
        default:
          "h-14 w-full min-w-0 rounded-2xl border border-transparent bg-secondary px-5 py-2 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-secondary/30 dark:disabled:bg-input/80",
        iconFieldMd: "w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-4 transition-all h-auto",
        iconFieldXl: "w-full pl-12 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-4 transition-all h-auto",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Input({ className, type, variant, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
