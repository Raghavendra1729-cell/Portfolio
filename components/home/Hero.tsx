"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ResumeActions from "@/components/ResumeActions";
import SocialLinks from "@/components/SocialLinks";
import { RevealSection } from "@/components/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Image from "next/image";
import type { LandingPageRecord, SiteSettingsRecord } from "@/lib/data";
import type { UnifiedProfile } from "@/lib/profiles";

type HeroProps = {
  siteSettings: SiteSettingsRecord;
  landingPage: LandingPageRecord;
};

export default function Hero({ siteSettings, landingPage }: HeroProps) {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-2">
      <RevealSection className="space-y-8" variant="blur-up">
        <div className="space-y-5">
          <h1 className="font-display text-[3.4rem] font-bold leading-[0.9] text-white sm:text-7xl lg:text-[5.6rem]">
            Hello I am Linga Seetha Rama Raghavendra
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            A software engineer with a strong aptitude for rapid learning and executing complex projects.
          </p>
        </div>
      </RevealSection>

      <RevealSection delay={0.08} className="relative flex items-center justify-center lg:justify-end">
        <div className="relative aspect-[4/5] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <Image
            src="/pic.jpeg"
            alt="Profile picture"
            fill
            className="object-cover"
            priority
          />
        </div>
      </RevealSection>
    </section>
  );
}
