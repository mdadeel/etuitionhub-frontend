"use client";;
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { createElement, memo, useMemo } from "react";

// Hoisted motion components — creating components during render resets their
// state, so build a static cache for every element we support.
const SHIMMER_ELEMENTS = ["p", "div", "span", "h1", "h2", "h3", "h4", "li", "blockquote"];
const motionElementCache = new Map(
  SHIMMER_ELEMENTS.map((element) => [element, motion.create(element)])
);

const getMotionComponent = (element) =>
  motionElementCache.get(element) ?? motionElementCache.get("p");

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2
}) => {
  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread]);

  // createElement instead of JSX so the motion component (looked up from a
  // static cache) is not treated as a component created during render.
  return createElement(
    getMotionComponent(Component),
    {
      animate: { backgroundPosition: "0% center" },
      className: cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        // NOTE: Tailwind 3 hsl() vars (Tailwind 4's --color-* are not defined here)
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),hsl(var(--background)),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className
      ),
      initial: { backgroundPosition: "100% center" },
      style: {
        "--spread": `${dynamicSpread}px`,
        backgroundImage:
          "var(--bg), linear-gradient(hsl(var(--muted-foreground)), hsl(var(--muted-foreground)))"
      },
      transition: {
        duration,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
    children
  );
};

export const Shimmer = memo(ShimmerComponent);
