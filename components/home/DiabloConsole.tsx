"use client";

import Image from "next/image";
import { ArrowUpRight, PhoneCall } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import { DIABLO_URL } from "@/lib/diablo";

export default function DiabloConsole() {
  return (
    <RevealSection>
      <section aria-labelledby="diablo-heading">
        <div className="diablo-aura premium-surface premium-outline surface-cut relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl space-y-6">
              <h2
                id="diablo-heading"
                className="font-display text-4xl font-bold leading-[0.95] text-white sm:text-5xl"
              >
                Talk to <span style={{ color: "var(--ember)" }}>DIABLO</span>
              </h2>
              <p className="text-base leading-7 text-slate-300 md:text-lg">
                It's my personal AI assistant which knows about me. You can also talk to it about me.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={DIABLO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="diablo-pill surface-cut inline-flex items-center gap-2 px-6 py-3 text-sm font-medium glow-on-hover"
                >
                  Open in new tab
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:+16094478292"
                  className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white hover:bg-white/[0.06] glow-on-hover"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call +1 (609) 447 8292
                </a>
              </div>
            </div>
            <div className="relative aspect-square w-full max-w-xs mx-auto lg:ml-auto lg:mr-0 drop-shadow-2xl">
              <Image 
                src="/diablo.png" 
                alt="Diablo AI Assistant" 
                fill 
                className="object-contain drop-shadow-[0_0_15px_rgba(255,100,50,0.5)]" 
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
