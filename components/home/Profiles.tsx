"use client";

import {
  ArrowUpRight,
  Binary,
  ChefHat,
  Code2,
  Github,
  Globe,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import type { ProfileSlug, UnifiedProfile } from "@/lib/profiles";

const ICONS: Record<ProfileSlug, LucideIcon> = {
  github: Github,
  leetcode: Code2,
  codeforces: Binary,
  codechef: ChefHat,
  linkedin: Linkedin,
  website: Globe,
  link: Globe,
};

type ProfilesProps = {
  profiles: UnifiedProfile[];
  eyebrow?: string;
  heading?: string;
  description?: string;
};

export default function Profiles({
  profiles,
  eyebrow = "Profiles",
  heading = "Competitive Programming & Coding Profiles",
  description = "My handles across various platforms.",
}: ProfilesProps) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="profiles-heading" className="space-y-7">
      <RevealSection className="max-w-2xl space-y-4">
        <div className="section-badge">
          <span>{eyebrow}</span>
        </div>
        <h2 id="profiles-heading" className="font-display text-3xl font-bold leading-[1.02] text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="text-base leading-7 text-slate-400">{description}</p>
      </RevealSection>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((p, index) => {
          const Icon = ICONS[p.slug] ?? Globe;
          const card = (
            <article
              className="profile-card premium-surface premium-outline surface-cut group relative flex h-full flex-col p-5"
              style={{ ["--tier" as string]: p.tier }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: p.tier, opacity: 0.55 }} />
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{
                    color: p.tier,
                    borderColor: "color-mix(in srgb, var(--tier) 40%, transparent)",
                    background: "color-mix(in srgb, var(--tier) 12%, transparent)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">{p.name}</h3>
              {p.handle ? (
                <p className="mt-1 truncate font-mono text-[0.74rem] text-slate-400">@{p.handle}</p>
              ) : null}
              {p.blurb ? (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{p.blurb}</p>
              ) : null}

              {p.stats.length > 0 ? (
                <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/8 pt-4">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-slate-500">
                        {s.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-white">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <span className="mt-auto" />
            </article>
          );

          return (
            <RevealSection key={p.key} delay={index * 0.05}>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2"
                  style={{ ["--tw-ring-color" as string]: p.tier }}
                  aria-label={`Open ${p.name} profile`}
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </RevealSection>
          );
        })}
      </div>
    </section>
  );
}
