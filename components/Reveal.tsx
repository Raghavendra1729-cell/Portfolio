"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { MOTION_EASE } from "@/lib/motion";

type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "fade-down" | "scale" | "blur-up" | "blur-in";

interface RevealProps {
  children: ReactNode;
  id?: string;
  variant?: RevealVariant;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
  className?: string;
}

const distanceMap: Record<RevealVariant, { x?: number; y?: number; scale?: number; filter?: string; initialFilter?: string }> = {
  "fade-up": { y: 28 },
  "fade-down": { y: -28 },
  "fade-left": { x: -32 },
  "fade-right": { x: 32 },
  scale: { y: 18, scale: 0.94 },
  "blur-up": { y: 24, filter: "blur(0px)", initialFilter: "blur(8px)" },
  "blur-in": { filter: "blur(0px)", initialFilter: "blur(12px)" },
};

function createItemVariants(
  variant: RevealVariant,
  reducedMotion: boolean,
  delay = 0,
): Variants {
  const offset = distanceMap[variant];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hiddenState: any = { opacity: 0 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visibleState: any = { opacity: 1, transition: {} };

  if (!reducedMotion) {
    if (offset.x !== undefined) hiddenState.x = offset.x;
    if (offset.y !== undefined) hiddenState.y = offset.y;
    if (offset.scale !== undefined) hiddenState.scale = offset.scale;
    if (offset.initialFilter !== undefined) hiddenState.filter = offset.initialFilter;

    visibleState.x = 0;
    visibleState.y = 0;
    visibleState.scale = 1;
    if (offset.initialFilter !== undefined) visibleState.filter = offset.filter ?? "blur(0px)";

    visibleState.transition = {
      delay,
      duration: 0.3,
      ease: MOTION_EASE,
    };
  } else {
    visibleState.transition = {
      duration: 0.2, delay
    };
  }

  return {
    hidden: hiddenState,
    visible: visibleState,
  };
}

function createContainerVariants(staggerDelay: number, delay: number, reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: reducedMotion ? 0.04 : staggerDelay,
        when: "beforeChildren",
      },
    },
  };
}

export function RevealSection({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  stagger = false,
  staggerDelay = 0.12,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const itemVariants = createItemVariants(variant, reducedMotion, delay);

  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={createContainerVariants(staggerDelay, delay, reducedMotion)}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
  variant = "fade-up",
}: Omit<RevealProps, "delay" | "stagger" | "staggerDelay">) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div variants={createItemVariants(variant, reducedMotion)} className={className}>
      {children}
    </motion.div>
  );
}

export default RevealSection;
