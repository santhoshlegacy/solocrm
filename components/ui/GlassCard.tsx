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
  glowColor?: "crimson" | "laser" | "red" | "pink" | "purple" | string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      withSpecularRim = true,
      interactive = true,
      withGlow = false,
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
          // Premium Frosted Glass Fintech:
          // 1. Base: Translucent surface with heavy backdrop blur and soft rounded-2xl corners
          "relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-xl",
          // 2. Translucent white border with subtle ambient glow if enabled
          withGlow
            ? "border border-[#E8B4F8]/40 shadow-[0_0_30px_rgba(232,180,248,0.18)]"
            : "border border-white/10",
          // 3. Precision top specular rim & ambient drop shadow
          withSpecularRim
            ? "shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
            : "drop-shadow-2xl",
          // 4. Subtle, tactile interactive lift & edge illumination
          interactive &&
            "hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:-translate-y-[1px] transition-all duration-200 group cursor-default",
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
