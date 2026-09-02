"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import HeroPortrait from "@/components/HeroPortrait";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import { RevealSection } from "@/components/Reveal";
import { DIABLO_URL } from "@/lib/diablo";
import type { LandingPageRecord, SiteSettingsRecord } from "@/lib/data";

type HeroProps = {
  siteSettings: SiteSettingsRecord;
  landingPage: LandingPageRecord;
};

export default function Hero({ siteSettings, landingPage }: HeroProps) {
  const profileImage = siteSettings.profileImage || "/pic.jpeg";
  const profileAlt = siteSettings.profileImageAlt || `${siteSettings.name} portrait`;

  return (
    <section className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center">
      <RevealSection className="space-y-7" variant="blur-up">
        {/* Eyebrow badge */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-200 backdrop-blur-md">
            <span className="status-dot bg-[color:var(--signal)]" />
            {siteSettings.profileBadge || "Open to Opportunities"}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
            {siteSettings.location || "Bengaluru, India"}
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-4">
          <h1 className="font-display text-[2.8rem] font-bold leading-[0.94] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.6rem]">
            {siteSettings.name}
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--signal)] sm:text-sm">
            {siteSettings.role}
          </p>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {landingPage.heroSummary ||
              "Computer Science undergraduate at Scaler School of Technology & BITS Pilani. Building multithreaded network servers from raw sockets, vision-guided autonomous browser agents, and hybrid RAG voice systems."}
          </p>
        </div>

        {/* Hero Signal Chips */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="metric-panel surface-cut rounded-xl p-3.5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-slate-500">
              LeetCode
            </p>
            <p className="mt-1 text-base font-bold text-white">900+ Solved</p>
            <p className="text-[11px] text-slate-400">365-day active streak</p>
          </div>

          <div className="metric-panel surface-cut rounded-xl p-3.5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-slate-500">
              Leadership
            </p>
            <p className="mt-1 text-base font-bold text-white">TA Buddy</p>
            <p className="text-[11px] text-slate-400">DSA & OOP at Scaler</p>
          </div>

          <div className="metric-panel surface-cut col-span-2 rounded-xl p-3.5 sm:col-span-1">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-slate-500">
              Academics
            </p>
            <p className="mt-1 text-base font-bold text-white">9.14 CGR · 9.02 CGPA</p>
            <p className="text-[11px] text-slate-400">SST & BITS Pilani</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href="/projects"
            className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Explore Projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <a
            href={DIABLO_URL}
            target="_blank"
            rel="noreferrer"
            className="diablo-pill surface-cut inline-flex items-center gap-2 px-5 py-3 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4 text-[color:var(--ember)]" />
            Talk to DIABLO
          </a>

          <ResumeActions siteSettings={siteSettings} compact />
        </div>

        {/* Social Link Row */}
        <div className="pt-2">
          <SocialLinks links={siteSettings.socialLinks} variant="icon" />
        </div>
      </RevealSection>

      {/* Right Column: Interactive 3D HUD Portrait */}
      <RevealSection delay={0.08} className="flex items-center justify-center lg:justify-end">
        <HeroPortrait
          src={profileImage}
          alt={profileAlt}
          name={siteSettings.name}
          badge={siteSettings.profileBadge || "Open to Work"}
          role={siteSettings.role}
          location={siteSettings.location || "Bengaluru, India"}
          availability={siteSettings.availability || "Open to SDE Roles & Internships"}
        />
      </RevealSection>
    </section>
  );
}
