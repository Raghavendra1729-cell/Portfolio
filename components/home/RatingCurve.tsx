"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Signature element. A rating curve that draws itself on load, climbing through
 * the competitive-programming tier spectrum (newbie -> ... -> legendary). The
 * ladder tops out at the ember "legendary" band, which is where DIABLO lives.
 * Honest data layer: replace `points` / band values with real contest history.
 */

const BANDS = [
  { y: 56, label: "legendary", tier: "var(--tier-legend)" },
  { y: 100, label: "master", tier: "var(--tier-master)" },
  { y: 144, label: "candidate", tier: "var(--tier-candidate)" },
  { y: 188, label: "expert", tier: "var(--tier-expert)" },
  { y: 232, label: "specialist", tier: "var(--tier-specialist)" },
  { y: 276, label: "pupil", tier: "var(--tier-pupil)" },
  { y: 320, label: "newbie", tier: "var(--tier-newbie)" },
];

// jagged like a real standings history — straight segments, small dips
const POINTS: Array<[number, number]> = [
  [48, 320],
  [104, 300],
  [160, 308],
  [216, 262],
  [272, 250],
  [328, 196],
  [384, 182],
  [440, 132],
  [492, 108],
];

const linePath = "M " + POINTS.map(([x, y]) => `${x} ${y}`).join(" L ");
const areaPath = `${linePath} L 492 336 L 48 336 Z`;
const [nowX, nowY] = POINTS[POINTS.length - 1];

export default function RatingCurve() {
  const reduce = useReducedMotion();

  return (
    <figure className="premium-surface premium-outline surface-cut relative overflow-hidden p-5 sm:p-6">
      <figcaption className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-slate-500">
          rating&nbsp;·&nbsp;the climb
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-slate-400">
          <span className="tier-dot tier-dot--live" style={{ ["--tier" as string]: "var(--signal)" }} />
          live
        </span>
      </figcaption>

      <svg
        viewBox="0 0 540 360"
        className="h-auto w-full"
        role="img"
        aria-label="A rating curve climbing through competitive-programming tiers, from newbie up toward legendary, where DIABLO sits."
      >
        <defs>
          <linearGradient id="ladder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--tier-newbie)" />
            <stop offset="16%" stopColor="var(--tier-pupil)" />
            <stop offset="33%" stopColor="var(--tier-specialist)" />
            <stop offset="50%" stopColor="var(--tier-expert)" />
            <stop offset="66%" stopColor="var(--tier-candidate)" />
            <stop offset="82%" stopColor="var(--tier-master)" />
            <stop offset="100%" stopColor="var(--tier-legend)" />
          </linearGradient>
          <linearGradient id="ladder-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--tier-newbie)" stopOpacity="0.05" />
            <stop offset="60%" stopColor="var(--tier-expert)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--tier-legend)" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* tier bands — the numbering device, keyed to real rating tiers */}
        {BANDS.map((band) => (
          <g key={band.label}>
            <line
              x1="48"
              x2="492"
              y1={band.y}
              y2={band.y}
              stroke={band.label === "legendary" ? "var(--ember)" : "rgba(255,255,255,0.06)"}
              strokeWidth="1"
              strokeDasharray={band.label === "legendary" ? "2 4" : undefined}
            />
            <text
              x="496"
              y={band.y + 3}
              className="font-mono"
              fontSize="8.5"
              letterSpacing="1.5"
              style={{ textTransform: "uppercase", fill: band.tier, opacity: band.label === "legendary" ? 0.9 : 0.45 }}
            >
              {band.label}
            </text>
          </g>
        ))}

        {/* area under the curve */}
        <motion.path
          d={areaPath}
          fill="url(#ladder-fill)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
        />

        {/* the climb */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#ladder)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* data nodes */}
        {POINTS.slice(0, -1).map(([x, y], i) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2.6"
            fill="var(--ink-node, #0a0e16)"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.2"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: reduce ? 0 : 0.6 + i * 0.12 }}
          />
        ))}

        {/* "now" — the live endpoint */}
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : 1.5, duration: 0.4 }}
          style={{ transformOrigin: `${nowX}px ${nowY}px` }}
        >
          <circle cx={nowX} cy={nowY} r="11" fill="none" stroke="var(--signal)" strokeWidth="1">
            {!reduce && (
              <animate attributeName="r" values="6;15;6" dur="2.2s" repeatCount="indefinite" />
            )}
            {!reduce && (
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx={nowX} cy={nowY} r="4.5" fill="var(--signal)" />
          <text
            x={nowX - 8}
            y={nowY - 14}
            textAnchor="end"
            className="font-mono"
            fontSize="9"
            letterSpacing="1.5"
            style={{ fill: "var(--signal)", textTransform: "uppercase" }}
          >
            now
          </text>
        </motion.g>
      </svg>
    </figure>
  );
}
