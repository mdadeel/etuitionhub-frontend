import * as React from "react"
import { cva } from "class-variance-authority";
import * as Slot from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80 border border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 border border-transparent",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20 border border-transparent",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground border",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50 border border-transparent",
        link: "text-primary underline-offset-4 hover:underline border border-transparent",
        primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 border',
        success: 'bg-success/10 text-success border-success/20 hover:bg-success/20 border',
        warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 border',
        error: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 border',
        dark: 'bg-foreground text-background border-foreground hover:opacity-90 border',
        subtle: 'bg-background text-muted-foreground border-border hover:bg-muted border',
      },
      size: {
        xs: 'text-[10px] px-2 py-0.5 h-4',
        sm: 'text-xs px-2.5 py-1 h-5',
        md: 'text-sm px-3 py-1.5 h-6',
        default: 'text-xs px-2.5 py-1 h-5',
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
