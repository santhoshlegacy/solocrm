"use client";

import React, { forwardRef } from "react";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export const cardEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 28,
      mass: 0.8,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  withSpecularRim?: boolean;
  interactive?: boolean;
  withGlow?: boolean;
  glowColor?: "crimson" | "laser" | "red" | "tomato" | "sage" | "amber" | string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      withSpecularRim = true,
      interactive = true,
      withGlow = false,
      glowColor = "crimson",
      variants,
      ...motionProps
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        variants={variants || cardEntranceVariants}
        className={cn(
          // Luxury Milled Obsidian Hardware Finish:
          // 1. Base: Deep rich slate-obsidian surface
          "relative overflow-hidden rounded-lg bg-[#0e0e11]",
          // 2. Micro-hairline border
          withGlow
            ? "border border-[#d41514]/40"
            : "border border-white/[0.07]",
          // 3. Precision top specular rim & ambient grounding depth
          withSpecularRim
            ? "shadow-luxury"
            : "shadow-subtle",
          // 4. Subtle, tactile interactive lift & edge illumination
          interactive &&
            "hover:border-white/[0.14] hover:shadow-luxury-elevated hover:-translate-y-[1px] transition-all duration-200 group cursor-default",
          className
        )}
        {...motionProps}
      >
        {/* Card Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
