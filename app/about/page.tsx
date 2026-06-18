export const dynamic = "force-dynamic";

import { RevealSection } from "@/components/Reveal";
import ResumeActions from "@/components/ResumeActions";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type EducationRecord } from "@/lib/data";
import { getSitePageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getSitePageMetadata("about");
}

export default async function AboutPage() {
  const [siteSettings, education] = (await Promise.all([
    getSiteSettings(),
    getData("education"),
  ])) as [Awaited<ReturnType<typeof getSiteSettings>>, EducationRecord[]];

  return (
    <PageShell>
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-8">
          <RevealSection className="premium-surface premium-outline surface-cut p-6 sm:p-7">
            <div className="section-badge">
              <span>Profile</span>
            </div>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-300">
              {siteSettings.aboutParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
          </RevealSection>

          <section className="space-y-5">
              <RevealSection className="max-w-2xl">
                <div className="section-badge">
                  <span>Education</span>
                </div>
                <h2 className="font-display mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  Academic foundation and current path.
                </h2>
              </RevealSection>

              <div className="space-y-4">
                {education.length > 0 ? (
                  education.map((record, index) => (
                    <RevealSection key={record._id} delay={index * 0.04}>
                      <article className="premium-surface premium-outline surface-cut p-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
                          <div>
                            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                              {record.institution}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              {[record.degree, record.program].filter(Boolean).join(" • ") || "Program details pending"}
                            </p>

                            {record.highlights.length > 0 ? (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {record.highlights.map((highlight) => (
                                  <span
                                    key={highlight}
                                    className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </RevealSection>
                  ))
                ) : (
                  <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-7 text-sm leading-7 text-slate-400">
                    Education updates will appear here once records are added.
                  </RevealSection>
                )}
              </div>
            </section>
        </div>

        <div className="space-y-4">
          <RevealSection className="premium-surface premium-outline surface-cut p-6">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                Snapshot
              </p>
              <p className="font-display mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{siteSettings.role}</p>
              <p className="mt-2 text-sm text-slate-400">{siteSettings.location}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{siteSettings.availability}</p>
            </RevealSection>

          <RevealSection className="premium-surface premium-outline surface-cut p-6">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-slate-500">
                Resume
              </p>
              <ResumeActions siteSettings={siteSettings} className="mt-4" />
            </RevealSection>
        </div>
      </section>
    </PageShell>
  );
}
