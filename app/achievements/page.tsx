export const dynamic = "force-dynamic";

import { ExternalLink } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import PageShell from "@/components/layout/PageShell";
import {
  getData,
  type AchievementRecord,
  type HackathonRecord,
} from "@/lib/data";
import { getSitePageMetadata } from "@/lib/metadata";

function getHackathonMeta(hackathon: HackathonRecord) {
  return [hackathon.event, hackathon.organizer, hackathon.date].filter(Boolean).join(" • ");
}

export async function generateMetadata() {
  return getSitePageMetadata("achievements");
}

export default async function AchievementsPage() {
  const [achievements, hackathons] = (await Promise.all([
    getData("achievement"),
    getData("hackathon"),
  ])) as [
    AchievementRecord[],
    HackathonRecord[],
  ];

  return (
    <PageShell>
      <div className="space-y-12">
        <section className="space-y-5">
          <RevealSection>
            <div className="section-badge">
              <span>Achievements</span>
            </div>
          </RevealSection>

          <div className="grid gap-4">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <RevealSection key={achievement._id} delay={index * 0.04}>
                  <TiltCard intensity={4}>
                    <article className="premium-surface premium-outline surface-cut p-6 sm:p-7 transition-all hover:border-white/16">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
                          {[achievement.organization, achievement.date].filter(Boolean).join(" • ")}
                        </p>
                        {achievement.featured ? (
                          <span className="surface-cut w-fit border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-200">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-display mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                        {achievement.title}
                      </h3>

                      <p className="mt-3.5 max-w-3xl text-sm leading-7 text-slate-300">
                        {achievement.description}
                      </p>

                      {achievement.links && achievement.links.length > 0 ? (
                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/6 pt-4 text-sm">
                          {achievement.links.map((link) => (
                            <a
                              key={`${link.name}-${link.url}`}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                            >
                              {link.name}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </TiltCard>
                </RevealSection>
              ))
            ) : (
              <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400">
                Achievements will appear here once records are added.
              </RevealSection>
            )}
          </div>
        </section>

        <section className="space-y-5">
          <RevealSection>
            <div className="section-badge">
              <span>Hackathons</span>
            </div>
          </RevealSection>

          <div className="grid gap-4">
            {hackathons.length > 0 ? (
              hackathons.map((hackathon, index) => (
                <RevealSection key={hackathon._id} delay={index * 0.04}>
                  <TiltCard intensity={4}>
                    <article className="premium-surface premium-outline surface-cut p-6 sm:p-7 transition-all hover:border-white/16">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
                            {getHackathonMeta(hackathon)}
                          </p>
                          <h3 className="font-display mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                            {hackathon.title}
                          </h3>
                        </div>
                        {hackathon.result ? (
                          <span className="surface-cut w-fit border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                            {hackathon.result}
                          </span>
                        ) : null}
                      </div>

                      {hackathon.description ? (
                        <p className="mt-3.5 max-w-3xl text-sm leading-7 text-slate-300">
                          {hackathon.description}
                        </p>
                      ) : null}

                      {hackathon.techStack.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {hackathon.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="surface-cut border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {hackathon.links && hackathon.links.length > 0 ? (
                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/6 pt-4 text-sm">
                          {hackathon.links.map((link) => (
                            <a
                              key={`${link.name}-${link.url}`}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                            >
                              {link.name}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </TiltCard>
                </RevealSection>
              ))
            ) : (
              <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400">
                Hackathon records will be added soon.
              </RevealSection>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
