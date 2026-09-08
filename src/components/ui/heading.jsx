import * as React from "react";
import { cn } from "@/lib/utils";

const headingVariants = {
  display: "text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground",
  h1: "text-2xl sm:text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground",
  h2: "text-xl sm:text-2xl md:text-3xl font-heading font-semibold tracking-tight text-foreground",
  h3: "text-lg sm:text-xl font-heading font-semibold tracking-tight text-foreground",
  h4: "text-base sm:text-lg font-heading font-semibold text-foreground",
  h5: "text-sm sm:text-base font-heading font-medium text-foreground",
  h6: "text-xs sm:text-sm font-heading font-medium uppercase tracking-wider text-muted-foreground",
  subheading: "text-sm sm:text-base font-normal text-muted-foreground leading-relaxed",
};

/**
 * Heading component providing standardized semantic typography scale across all viewports.
 * Conforms to TL-003 and docs/design/desgin-system.md.
 */
const Heading = React.forwardRef(
  ({ as, level = 2, size, className, children, ...props }, ref) => {
    const numericLevel = typeof level === "string" ? parseInt(level.replace(/\D/g, ""), 10) || 2 : level;
    const clampedLevel = Math.max(1, Math.min(6, numericLevel));
    const Tag = as || `h${clampedLevel}`;
    const variantKey = size || `h${clampedLevel}`;

    return (
      <Tag
        ref={ref}
        data-slot="heading"
        className={cn(headingVariants[variantKey] || headingVariants.h2, className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";

// eslint-disable-next-line react-refresh/only-export-components
export { Heading, headingVariants };
