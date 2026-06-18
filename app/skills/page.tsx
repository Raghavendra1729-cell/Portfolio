export const dynamic = "force-dynamic";

import { RevealSection } from "@/components/Reveal";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type SkillRecord } from "@/lib/data";
import { getSitePageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getSitePageMetadata("skills");
}

export default async function SkillsPage() {
  const [skills, siteSettings] = (await Promise.all([
    getData("skill"),
    getSiteSettings(),
  ])) as [SkillRecord[], Awaited<ReturnType<typeof getSiteSettings>>];
  const intro = siteSettings.pageIntro.skills;

  return (
    <PageShell>

      <div className="grid gap-6 lg:grid-cols-2">
        {skills.length > 0 ? (
          skills.map((category, index) => (
            <RevealSection key={category._id} delay={index * 0.04}>
              <article className="premium-surface premium-outline surface-cut p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                      Capability area
                    </p>
                    <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {category.category}
                    </h2>
                  </div>
                  <div className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                    {category.items.length} items
                  </div>
                </div>

                <div className="mt-6 divide-y divide-white/6 border-t border-white/6">
                  {category.items.map((item) => {
                    return (
                      <div key={item} className="py-4 first:pt-5 last:pb-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">{item}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400 lg:col-span-2">
            No skill categories are available yet.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
