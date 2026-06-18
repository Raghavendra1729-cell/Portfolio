import { RevealSection } from "@/components/Reveal";
import PageShell from "@/components/layout/PageShell";
import { getData, type ExperienceRecord } from "@/lib/data";
import { getSitePageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getSitePageMetadata("experience");
}

export default async function ExperiencePage() {
  const experience = (await getData("experience")) as ExperienceRecord[];

  return (
    <PageShell>
      <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-[1.5rem] before:-z-10 before:w-px before:bg-white/10 sm:before:left-[1.75rem] lg:before:left-[14rem]">
        {experience.length > 0 ? (
          experience.map((item, index) => (
            <RevealSection key={item._id} delay={index * 0.04}>
              <article className="premium-surface premium-outline surface-cut relative ml-10 p-6 sm:ml-12 sm:p-7 lg:ml-0 lg:pl-16">
                <div className="absolute left-[-2.5rem] top-8 h-2 w-2 rounded-full border border-white/20 bg-black sm:left-[-3rem] lg:left-[13.8rem] lg:top-9" />
                <div className="grid gap-6 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {[item.startDate, item.endDate || (item.current ? "Present" : undefined)]
                        .filter(Boolean)
                        .join(" - ") || "Timeline pending"}
                    </p>
                    <div className="surface-cut border border-white/8 bg-white/[0.03] px-4 py-3">
                      <p className="text-sm text-slate-300">{item.location || "Location pending"}</p>
                    </div>
                    {item.current ? (
                      <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                        <span className="status-dot bg-[color:var(--signal)]" />
                        Current
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">{item.role}</h2>
                        <p className="mt-2 text-sm text-slate-300">{item.company}</p>
                      </div>
                    </div>

                    {item.description.length > 0 ? (
                      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                        {item.description.map((point) => (
                          <li key={point} className="flex gap-3">
                            <span className="mt-3 h-1.5 w-1.5 rounded-full bg-white/35" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {item.technologies.length > 0 ? (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {item.links.length > 0 ? (
                      <div className="mt-6 flex flex-wrap gap-5 text-sm">
                        {item.links.map((link) => (
                          <a
                            key={`${link.name}-${link.url}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                          >
                            {link.name}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </RevealSection>
          ))
        ) : (
          <RevealSection className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-8 text-sm leading-7 text-slate-400">
            Experience records will appear here as they are added.
          </RevealSection>
        )}
      </div>
    </PageShell>
  );
}
