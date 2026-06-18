export const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

export const SECTION_TRANSITION = {
  duration: 0.3,
  ease: MOTION_EASE,
} as const;

export const HOVER_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 0.68,
} as const;

export const SPRING_PRESETS = {
  bouncy: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 },
  smooth: { type: "spring", stiffness: 220, damping: 24, mass: 0.68 },
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
} as const;

export const STAGGER_PRESETS = {
  fast: 0.04,
  normal: 0.08,
  slow: 0.16,
} as const;
