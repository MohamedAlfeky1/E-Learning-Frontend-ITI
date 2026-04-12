import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Changed base radius to rounded-full for the pill shape, adjusted default font weight and gap for icons
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        // Solid purple (Explore Our Mission / + Button)
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",

        // Solid green (Enroll Now)
        success: "bg-[#065F2C] text-white hover:bg-[#065F2C]/90 shadow-sm",

        // Solid white with purple text (Watch Demo)
        white: "bg-white text-primary hover:bg-gray-50 shadow-sm",

        // Light blue/purple background with purple text (Watch Our Story)
        secondary: "bg-primary/10 text-primary hover:bg-primary/20",

        // Ghost with purple text (All Filters)
        ghost: "text-primary hover:bg-primary/10",

        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",

        destructiveOutline:
        "border-2 border-destructive/10 text-destructive bg-background hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        
        link: "text-primary underline-offset-4 hover:underline",

        purpleBtnDefault:"bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-[0.98] disabled:bg-purple-300 shadow-lg shadow-purple-200 ",

        purpleBtnXl:
          "w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-purple-300 shadow-lg shadow-purple-200 mt-4",
        whiteBtnMd:
          "w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed",
      },
      size: {
        // Increased heights and horizontal padding to match the wide pill buttons
        default: "h-12 gap-2 px-8",
        sm: "h-9 gap-1.5 px-4 text-xs [&_svg:not([class*='size-'])]:size-4",
        lg: "h-14 gap-2.5 px-10 text-base [&_svg:not([class*='size-'])]:size-6",

        // Perfect circles for icon buttons
        icon: "size-12",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-14 [&_svg:not([class*='size-'])]:size-6",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
