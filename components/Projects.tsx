"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Workflow } from "lucide-react";
import { type ProjectRecord } from "@/lib/data";
import { SECTION_TRANSITION } from "@/lib/motion";
import TiltCard from "@/components/ui/TiltCard";

function getProjectWindow(project: ProjectRecord) {
  return project.featured ? "Featured project" : "Selected project";
}



function getLeadSummary(description: string) {
  return (
    description
      .split(/\n+/)
      .map((item) => item.trim())
      .find(Boolean) || "Project details will be added soon."
  );
}

export default function Projects({ data }: { data: ProjectRecord[] }) {
  const reducedMotion = useReducedMotion();

  if (!data.length) {
    return (
      <div className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-10">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-slate-500">
          Projects
        </p>
        <p className="mt-4 text-lg text-slate-300">No projects are available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {data.map((project, index) => {
        const projectWindow = getProjectWindow(project);
        const leadSummary = getLeadSummary(project.description);
        const imageFirst = index % 2 === 1;

        return (
          <motion.div
            key={project._id}
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...SECTION_TRANSITION, delay: index * 0.04 }}
          >
            <TiltCard className="h-full">
              <article className="premium-surface premium-outline surface-cut group h-full overflow-hidden">
                <div className={imageFirst ? "grid gap-0 lg:grid-cols-[0.9fr_1.1fr]" : "grid gap-0 lg:grid-cols-[1.1fr_0.9fr]"}>
                  <div
                    className={
                      imageFirst
                        ? "order-1 relative min-h-[18rem] border-b border-white/8 bg-black/35 lg:border-b-0 lg:border-r"
                        : "order-2 relative min-h-[18rem] border-b border-white/8 bg-black/35 lg:order-2 lg:border-b-0 lg:border-l"
                    }
                  >
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} preview`}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="relative flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(9,11,16,0.8),rgba(4,5,8,0.98))]">
                        <div className="premium-grid absolute inset-0 opacity-30" />
                        <div className="surface-cut relative border border-white/10 bg-white/[0.04] p-5 text-slate-200">
                          <Workflow className="h-8 w-8" />
                        </div>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,15,0.06),rgba(7,10,15,0.56)_100%)]" />
                  </div>

                  <div className={imageFirst ? "order-2 p-6 sm:p-7 lg:order-2 lg:p-8" : "order-1 p-6 sm:p-7 lg:order-1 lg:p-8"}>
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-white/10" />
                      <span>{projectWindow}</span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                          {project.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                          {leadSummary}
                        </p>
                      </div>
                      {project.featured ? (
                        <span className="surface-cut border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                          Stack
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{project.techStack.length} tools</p>
                      </div>
                      <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                          Links
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {project.links.length + Number(Boolean(project.link)) + Number(Boolean(project.repo))}
                        </p>
                      </div>
                      <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                          Mode
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {project.featured ? "Flagship" : "Archive"}
                        </p>
                      </div>
                    </div>

                    {project.techStack.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-5 text-sm">
                      <Link
                        href={`/projects/${project._id}`}
                        className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                      >
                        Open case study
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>

                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Live demo
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}

                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Repository
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}
