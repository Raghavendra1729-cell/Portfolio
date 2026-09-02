import Link from "next/link";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import type { LandingPageRecord, ProjectRecord } from "@/lib/data";

function getLeadSummary(description: string) {
  return (
    description
      .split(/\n+/)
      .map((item) => item.trim())
      .find(Boolean) || "Project details will be added soon."
  );
}

export default function FeaturedProjects({
  landingPage,
  projects,
}: {
  landingPage: LandingPageRecord;
  projects: ProjectRecord[];
}) {
  if (projects.length === 0) {
    return null;
  }

  const [leadProject, ...secondaryProjects] = projects;

  return (
    <section id="home-projects" className="space-y-8">
      <RevealSection className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="section-badge">
            <span>{landingPage.projectsEyebrow}</span>
          </div>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            {landingPage.projectsTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-400">
            {landingPage.projectsDescription}
          </p>
        </div>
        <Link
          href="/projects"
          className="underline-grow inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
        >
          Browse all projects
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </RevealSection>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <RevealSection>
          <TiltCard>
            <article className="premium-surface premium-outline surface-cut h-full p-7 sm:p-8 transition-all hover:border-white/16 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <span>Lead Highlight</span>
                  {leadProject.featured ? (
                    <span className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                      Featured
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-[-0.05em] text-white">
                  {leadProject.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  {getLeadSummary(leadProject.description)}
                </p>

                {leadProject.techStack.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {leadProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="surface-cut border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/8 pt-6 text-sm">
                {leadProject.link ? (
                  <a
                    href={leadProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                  >
                    <Globe className="h-4 w-4" />
                    Live Demo
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                {leadProject.repo ? (
                  <a
                    href={leadProject.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repo
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                <Link
                  href={`/projects/${leadProject._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 transition hover:text-white sm:ml-auto"
                >
                  Case study &amp; details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </TiltCard>
        </RevealSection>

        <div className="space-y-4">
          {secondaryProjects.map((project, index) => (
            <RevealSection key={project._id} delay={index * 0.05}>
              <TiltCard intensity={6}>
                <article className="premium-surface premium-outline surface-cut h-full p-6 sm:p-7 transition glow-on-hover hover:border-white/16 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                        {project.techStack.slice(0, 3).join(" • ") || "Project"}
                      </p>
                      {project.featured ? (
                        <span className="surface-cut border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-[-0.04em] text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-400">
                      {getLeadSummary(project.description)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/6 pt-4 text-sm">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-white transition hover:text-slate-300"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Live Demo
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ) : null}

                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-300 transition hover:text-white"
                      >
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ) : null}

                    <Link
                      href={`/projects/${project._id}`}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 transition hover:text-white ml-auto"
                    >
                      Details
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
